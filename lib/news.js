// Reads publishers' RSS feeds and returns headlines with a link back to the original report.
// We keep the headline, link, publisher, time and the feed's own short description. Feeds that fail are skipped.
import Parser from 'rss-parser';
import { createHash } from 'crypto';
import feeds from '../data/feeds.json';
import art from '../data/art-tags.json';
import { dedupe } from './dedupe';
import { factOf, flagsOf, encodeArt } from './scene';

const parser = new Parser({ timeout: 12000 });
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// A keyword must match as a whole word in the headline ("AI" must not match "aid" or "air").
const RULES = art.tags.map((t) => ({ tag: t.tag, re: new RegExp('(^|[^a-z0-9])(' + t.keywords.map((k) => esc(k.trim().toLowerCase())).join('|') + ')(s|es)?($|[^a-z0-9])', 'i') }));

// A story's picture is the scene for its topic. Deaths and tragedies get the quiet ribbon-and-candle picture, never a cheerful one.
// Stories from abroad never show the Bangladesh flag. The picture also carries the story's key fact and the flags of the countries it is about (lib/scene.js).
const HAS_BD_FLAG = new Set(['government', 'diplomacy', 'speech']);
const SOMBER = /\b(dies|died|dead|death|deaths|killed|kills|killing|funeral|mourn|mourns|mourning|tribute|tributes|tragedy|tragic|passes away|passed away|collapses|collapsed|drowned|drowns|suicide|murder|murdered|fatal|obituary|late|rip|injured|injury|crash|crashes|accident|blast|massacre|victims?)\b/i;
const CHEERFUL = new Set(['cricket', 'football', 'trophy', 'culture', 'game', 'tennis']);
// Busy topics have more than one drawing (<tag>-2.svg, ...). The headline picks one, so a story always keeps its picture
// but the stories around it look different.
const VARIANTS = new Map(art.tags.filter((t) => t.variants > 1).map((t) => [t.tag, t.variants]));
function variantOf(tag, title) {
  const w = /-w$/.test(tag), base = w ? tag.slice(0, -2) : tag; // "diplomacy-w" -> "diplomacy-2-w"
  const n = VARIANTS.get(base); if (!n) return tag;
  let h = 0; for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) >>> 0;
  const k = h % n; return k ? base + '-' + (k + 1) + (w ? '-w' : '') : tag;
}

export function tagFor(title, feed) {
  let tag = feed.tag || art.fallbackBySection[feed.section] || 'government';
  for (const r of RULES) if (r.re.test(title)) { tag = r.tag; break; }
  // "Tigers" is the cricket team's nickname, so cricket is checked before wildlife. Outside the sport pages, a tiger
  // headline with no cricket words in it is about real tigers (the Sundarbans, a census).
  if (tag === 'cricket' && feed.section !== 'Sport' && /\btigers?\b/i.test(title) && !/\b(cricket|odi|t20|test|bcb|bpl|wickets?|runs|innings|series)\b/i.test(title)) tag = 'wildlife';
  if (SOMBER.test(title) && CHEERFUL.has(tag)) return 'solemn';
  return HAS_BD_FLAG.has(tag) && feed.section !== 'Bangladesh' ? tag + '-w' : tag;
}

// "market|Tk 30/kg|bd,pk": the scene, the key fact, the countries. Only stories that have something to say get more than the scene.
export function artOf(title, feed) {
  const tag = tagFor(title, feed);
  if (tag === 'solemn') return tag;
  let flags = flagsOf(title);
  if (feed.section === 'Bangladesh' && flags.length === 1 && flags[0] === 'bd') flags = []; // a lone Bangladesh flag on a Bangladesh story says nothing
  return encodeArt(variantOf(tag, title), factOf(title), flags);
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
      return { id: createHash('sha1').update(link).digest('hex').slice(0, 10), title: title, link: link, desc: desc, source: f.source, section: f.section, tag: artOf(title, f), date: t && !isNaN(t) ? t.toISOString() : null };
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
