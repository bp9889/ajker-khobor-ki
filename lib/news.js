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

// Stories about people get an invented toy-brick character picked by role, never a likeness of a real person.
// - Politicians: a character in the colours of the country the story is about. A named political figure gets a symbol picture (no character at all).
// - Sport: a striker or batter in the team's colours.
// - Female or male: from the headline's own words, otherwise a fixed pick per story.
const HAS_BD_FLAG = new Set(['government', 'diplomacy']);
const COUNTRY = { bd: /\b(bangladesh|bangladeshi|dhaka)\b/i, us: /\b(us|u\.s\.|usa|american|america|white house|washington)\b/i, in: /\b(india|indian|delhi|modi)\b/i, ru: /\b(russia|russian|moscow|kremlin|putin)\b/i,
  cn: /\b(china|chinese|beijing)\b/i, uk: /\b(uk|britain|british|london|starmer)\b/i, tr: /\b(turkey|turkish|ankara|erdogan|türkiye)\b/i, ir: /\b(iran|iranian|tehran)\b/i,
  il: /\b(israel|israeli|netanyahu)\b/i, ua: /\b(ukraine|ukrainian|kyiv|zelensky)\b/i, fr: /\b(france|french|paris|macron)\b/i, pk: /\b(pakistan|pakistani|islamabad)\b/i };
const FOOTBALL = { arg: /\b(argentina|messi)\b/i, bra: /\b(brazil|neymar|vinicius)\b/i, por: /\b(portugal|ronaldo)\b/i, fra: /\b(france|mbappe)\b/i, eng: /\b(england)\b/i, esp: /\b(spain)\b/i, ger: /\b(germany)\b/i,
  rma: /\b(real madrid)\b/i, fcb: /\b(barcelona|barca)\b/i, mun: /\b(man utd|man united|manchester united)\b/i, liv: /\b(liverpool)\b/i, ars: /\b(arsenal)\b/i, che: /\b(chelsea)\b/i, mci: /\b(man city|manchester city)\b/i, bd: /\b(bangladesh|bangladeshi)\b/i };
const CRICKET = { bd: /\b(bangladesh|tigers|bcb)\b/i, ind: /\b(india|indian)\b/i, pak: /\b(pakistan)\b/i, aus: /\b(australia|aussies)\b/i, eng: /\b(england)\b/i, rsa: /\b(south africa|proteas)\b/i, nz: /\b(new zealand|black caps)\b/i, sl: /\b(sri lanka)\b/i, wi: /\b(west indies)\b/i };
// A named political figure, or a title followed by a name ("President Lastname"): these never get a character.
const NAMES = /\b(hasina|yunus|tarique|khaleda|trump|biden|harris|putin|xi jinping|modi|erdogan|netanyahu|zelensky|starmer|macron|khamenei|pezeshkian|sharif|musk)\b/i;
const TITLE_NAME = /\b(?:[Pp]resident|[Pp]rime [Mm]inister|PM|[Mm]inister|[Cc]hief [Aa]dviser|[Gg]overnor|[Mm]ayor|[Cc]hancellor|[Ss]enator)\s+[A-Z][a-z]+/;
const NAMED = { test: (t) => NAMES.test(t) || TITLE_NAME.test(t) };
const FEMALE = /\b(she|her|hers|woman|women|female|girl|girls|mother|queen|lady|actress|sister|wife|daughter|ms|mrs)\b/i;
const MALE = /\b(he|his|him|man|men|male|boy|boys|king|father|brother|husband|son|mr)\b/i;
const first = (map, text) => Object.keys(map).find((k) => map[k].test(text));
const isFemale = (title) => { const f = FEMALE.test(title), m = MALE.test(title); if (f && !m) return true; if (m && !f) return false; return createHash('sha1').update(title).digest()[0] % 2 === 0; };

export function tagFor(title, feed) {
  let tag = feed.tag || art.fallbackBySection[feed.section] || 'government';
  for (const r of RULES) if (r.re.test(title)) { tag = r.tag; break; }
  const abroad = feed.section !== 'Bangladesh';
  if (tag === 'leader' || tag === 'minister' || tag === 'speech') {
    if (NAMED.test(title)) tag = tag === 'leader' ? 'diplomacy' : 'government'; // symbol picture instead of a character
    else {
      const cc = first(COUNTRY, title) || (abroad ? '' : 'bd');
      return (tag === 'leader' ? 'leader' : 'minister') + (cc ? '-' + cc : '') + (isFemale(title) ? '-f' : '');
    }
  }
  if (tag === 'striker') { const k = first(FOOTBALL, title); return 'striker' + (k ? '-' + k : '') + (isFemale(title) ? '-f' : ''); }
  if (tag === 'batter') { const k = first(CRICKET, title); return 'batter' + (k ? '-' + k : '') + (isFemale(title) ? '-f' : ''); }
  if (tag === 'founder' || tag === 'scientist' || tag === 'performer') return tag + (isFemale(title) ? '-f' : '');
  // These two pictures show the Bangladesh flag. Stories from abroad get the same picture with a plain blue banner instead.
  return HAS_BD_FLAG.has(tag) && abroad ? tag + '-w' : tag;
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
