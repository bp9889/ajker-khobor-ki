// Reads publishers' RSS feeds and returns headlines with a link back to the original report.
// We keep the headline, link, publisher, time and the feed's own short description. Feeds that fail are skipped.
import Parser from 'rss-parser';
import { createHash } from 'crypto';
import feeds from '../data/feeds.json';
import art from '../data/art-tags.json';
import { dedupe } from './dedupe';

const parser = new Parser({ timeout: 12000 });
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// A keyword must match as a whole word in the headline ("AI" must not match "aid" or "air").
const RULES = art.tags.map((t) => ({ tag: t.tag, re: new RegExp('(^|[^a-z0-9])(' + t.keywords.map((k) => esc(k.trim().toLowerCase())).join('|') + ')(s|es)?($|[^a-z0-9])', 'i') }));

export function tagFor(title, feed) {
  for (const r of RULES) if (r.re.test(title)) return r.tag;
  return feed.tag || art.fallbackBySection[feed.section] || 'government';
}

const SKIP = /\/(video|videos|sounds|lifestyle|entertainment)\/|scorecard|podcast/i;

// Some feeds give a field as an object (for example with attributes) instead of plain text.
const txt = (v) => { if (typeof v === 'string') return v; if (Array.isArray(v)) return v.map(txt).find(Boolean) || ''; if (v && typeof v === 'object') { const k = ['_', '#text', '__cdata', 'cdata', 'value', 'text', '$t'].find((x) => typeof v[x] === 'string' && v[x]); if (k) return v[k]; for (const x of Object.keys(v)) { if (x === '$' || x === 'attributes') continue; const r = txt(v[x]); if (r) return r; } } return ''; };

const STATUS = {};
export const feedStatus = () => STATUS;

async function readFeed(f) {
  try {
    const res = await fetch(f.url, { next: { revalidate: 1800 }, headers: { 'user-agent': 'Mozilla/5.0 (compatible; AjkerKhoborKi/1.0; RSS reader)', accept: 'application/rss+xml, application/xml, text/xml, */*' }, signal: AbortSignal.timeout(12000) });
    if (!res.ok) { STATUS[f.url] = 'http ' + res.status; console.error('[news] feed', f.source, f.section, f.url, 'status', res.status); return []; }
    const feed = await parser.parseString(await res.text());
    const got = (feed.items || []).slice(0, 14).map((it) => { try {
      const title = txt(it.title).replace(/\s+/g, ' ').trim();
      const link = txt(it.link).trim();
      if (!title || !/^https?:\/\//.test(link) || SKIP.test(link) || SKIP.test(title)) { if (!STATUS[f.url + '#why']) STATUS[f.url + '#why'] = 'skipped: title=' + JSON.stringify(title).slice(0, 60) + ' link=' + JSON.stringify(link).slice(0, 80) + ' rawTitle=' + JSON.stringify(it.title).slice(0, 120) + ' keys=' + Object.keys(it).join(','); return null; }
      const d = txt(it.isoDate) || txt(it.pubDate); const t = d ? new Date(d) : null;
      const desc = (txt(it.contentSnippet) || txt(it.summary) || txt(it.content)).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 420);
      return { id: createHash('sha1').update(link).digest('hex').slice(0, 10), title: title, link: link, desc: desc, source: f.source, section: f.section, tag: tagFor(title, f), date: t && !isNaN(t) ? t.toISOString() : null };
    } catch (e) { STATUS[f.url + '#why'] = 'threw: ' + String(e && e.message || e).slice(0, 100); return null; } }).filter(Boolean);
    STATUS[f.url] = 'ok: ' + (feed.items || []).length + ' items, ' + got.length + ' usable';
    return got;
  } catch (e) { STATUS[f.url] = 'failed: ' + String(e && e.message || e).slice(0, 80); console.error('[news] feed', f.source, f.section, f.url, 'failed:', String(e && e.message || e).slice(0, 120)); return []; }
}

export async function getNews() {
  const lists = await Promise.all(feeds.map(readFeed));
  const seen = new Set(), out = [];
  // Take turns between feeds so no single publisher fills the list.
  for (let i = 0; i < 14; i++) for (const l of lists) { const it = l[i]; if (it && !seen.has(it.link) && !seen.has(it.title.toLowerCase())) { seen.add(it.link); seen.add(it.title.toLowerCase()); out.push(it); } }
  const fresh = out.filter((x) => !x.date || Date.now() - new Date(x.date).getTime() < 3 * 86400000);
  // Newest first within the round-robin order is already mixed by publisher; drop repeats of the same event.
  return dedupe(fresh).slice(0, 90);
}
