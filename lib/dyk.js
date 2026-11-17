// "Did you know?": ten hand-written facts a day, two from each section, from the banks in data/dyk/*.json.
// A fact is not shown again until every other fact in its section has been shown. To add facts, add [hook, more, hookBn, moreBn] to the bank files.
// The id comes from the English hook only, so editing the Bangla never changes a fact's id.
import bangladesh from '../data/dyk/bangladesh.json';
import world from '../data/dyk/world.json';
import science from '../data/dyk/science.json';
import tech from '../data/dyk/tech.json';
import sport from '../data/dyk/sport.json';

export const DYK_SECTIONS = [
  { name: 'Bangladesh', key: 'bd', color: '#00924A', list: bangladesh },
  { name: 'World', key: 'wd', color: '#D21F14', list: world },
  { name: 'Science', key: 'sc', color: '#8B3FD9', list: science },
  { name: 'Tech', key: 'tc', color: '#2F5BEA', list: tech },
  { name: 'Sport', key: 'sp', color: '#F28C00', list: sport },
];
const PER_SECTION = 2;
const MONTHS_BN = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];

// The day number in Dhaka (UTC+6), so new facts arrive at midnight Bangladesh time.
export function dhakaDay(t = Date.now()) { return Math.floor((t + 6 * 3600 * 1000) / 86400000); }

function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function order(n, seed) { const r = rng(seed), a = Array.from({ length: n }, (x, i) => i); for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

export function factId(sec, hook) { return sec.key + '-' + hash(hook).toString(36); }

export function factsForDay(day = dhakaDay()) {
  const d = new Date(day * 86400000);
  const date = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' });
  const dateBn = d.getUTCDate() + ' ' + MONTHS_BN[d.getUTCMonth()];
  return {
    day: day, date: date, dateBn: dateBn,
    sections: DYK_SECTIONS.map((sec) => {
      // One fixed shuffled order per section, walked two facts a day. A fact comes back only after the whole bank has been shown.
      const n = sec.list.length, ord = order(n, hash(sec.key));
      const facts = Array.from({ length: PER_SECTION }, (x, j) => ord[(day * PER_SECTION + j) % n]).map((i) => { const p = sec.list[i]; return { id: factId(sec, p[0]), hook: p[0], more: p[1], hookBn: p[2] || '', moreBn: p[3] || '' }; });
      return { name: sec.name, color: sec.color, facts: facts };
    }),
  };
}

export const DYK_TOTAL = DYK_SECTIONS.reduce((n, s) => n + s.list.length, 0);
