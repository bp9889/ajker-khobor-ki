// Drops headlines that cover the same event as one we already kept (e.g. five stories about one outage).
// Two headlines count as the same story when they share enough of their distinctive words.
const STOP = new Set(('a an the and or but of to in on at for from by with as is are was were be been it its this that these those after before over under into out up down off about amid against between during while than then so not no new says say said will would could should may might can has have had do does did how why what who when where which more most less one two three four first second latest live news report reports update updates now today year years day days week weeks man woman men women people over per just still also back their his her our your they them he she we you i').split(/\s+/));
const GENERIC = new Set('bangladesh bangladeshi dhaka government govt police court minister country world global national international city'.split(' '));

function tokens(s) {
  const t = String(s || '').toLowerCase().replace(/[’']s\b/g, '').replace(/[^a-z0-9ঀ-৿\s]/g, ' ').split(/\s+/);
  const out = new Set();
  for (let w of t) {
    if (!w || w.length < 3 || STOP.has(w) || GENERIC.has(w) || /^\d+$/.test(w)) continue;
    w = w.replace(/(ing|ed|es|s)$/, (m) => (w.length - m.length >= 4 ? '' : m));
    out.add(w);
  }
  return out;
}

export function sameStory(a, b) {
  const ta = tokens(a.title), tb = tokens(b.title);
  if (!ta.size || !tb.size) return false;
  let both = 0, heavy = 0;
  for (const w of ta) if (tb.has(w)) { both++; if (w.length >= 5) heavy++; }
  const small = Math.min(ta.size, tb.size);
  // Two long distinctive words in common ("microsoft" + "outage") is the same event.
  if (heavy >= 2) return true;
  if (both >= 3 && both / small >= 0.34) return true;
  if (both >= 2 && both / small >= 0.5) return true;
  // One shared word plus a similar blurb also counts ("outage" vs "disruption" in the headline).
  if (both >= 1) {
    const da = tokens(a.title + ' ' + a.desc), db = tokens(b.title + ' ' + b.desc);
    let c = 0;
    for (const w of da) if (db.has(w)) c++;
    if (c >= 4 && c / Math.min(da.size, db.size) >= 0.3) return true;
  }
  return false;
}

export function dedupe(list) {
  const kept = [];
  for (const it of list) if (!kept.some((k) => sameStory(k, it))) kept.push(it);
  return kept;
}
