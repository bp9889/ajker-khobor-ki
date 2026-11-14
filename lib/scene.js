// Turns a story's headline into what its picture should say: the one key fact (a price, a count, a percentage) as a sticker,
// and the flags of the countries it is about. The scene itself is one of the pictures in /public/art. Nothing here draws a person.
const INK = '#1A1714';
const SW = `stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"`;

// Countries a headline can mention, and the pattern that finds each.
export const COUNTRY = {
  bd: /\b(bangladesh|bangladeshi|dhaka)\b/i, us: /\b(us|u\.s\.|usa|american|america|white house|washington)\b/i, in: /\b(india|indian|delhi)\b/i, ru: /\b(russia|russian|moscow|kremlin)\b/i,
  cn: /\b(china|chinese|beijing)\b/i, uk: /\b(uk|britain|british|london)\b/i, tr: /\b(turkey|turkish|ankara|türkiye)\b/i, ir: /\b(iran|iranian|tehran)\b/i,
  il: /\b(israel|israeli)\b/i, ua: /\b(ukraine|ukrainian|kyiv)\b/i, fr: /\b(france|french|paris)\b/i, pk: /\b(pakistan|pakistani|islamabad)\b/i,
  ar: /\b(argentina)\b/i, br: /\b(brazil)\b/i, au: /\b(australia|australian|aussies)\b/i, de: /\b(germany|german)\b/i, es: /\b(spain|spanish)\b/i, pt: /\b(portugal)\b/i,
};

function flagSvg(cc, x, y, w = 40, h = 26) {
  const t = h / 3; let g = '';
  const bars3 = (a, b, c) => `<rect width="${w}" height="${t + .3}" fill="${a}"/><rect y="${t}" width="${w}" height="${t + .3}" fill="${b}"/><rect y="${2 * t}" width="${w}" height="${t + .3}" fill="${c}"/>`;
  switch (cc) {
    case 'bd': g = `<rect width="${w}" height="${h}" fill="#006A4E"/><circle cx="${w * .45}" cy="${h / 2}" r="${h * .3}" fill="#E8261A"/>`; break;
    case 'us': g = Array.from({ length: 7 }, (_, i) => `<rect y="${(i * h / 7).toFixed(1)}" width="${w}" height="${(h / 7 + .3).toFixed(1)}" fill="${i % 2 ? '#fff' : '#D21F14'}"/>`).join('') + `<rect width="${(w * .45).toFixed(1)}" height="${(h * 4 / 7).toFixed(1)}" fill="#2A3F8F"/>`; break;
    case 'in': g = bars3('#FF9933', '#fff', '#138808') + `<circle cx="${w / 2}" cy="${h / 2}" r="${h * .14}" fill="none" stroke="#1F2A8A" stroke-width="1.4"/>`; break;
    case 'ru': g = bars3('#fff', '#1C4FA0', '#D21F14'); break;
    case 'cn': g = `<rect width="${w}" height="${h}" fill="#DE2910"/><circle cx="${w * .22}" cy="${h * .3}" r="${h * .14}" fill="#FFDE00"/>`; break;
    case 'uk': g = `<rect width="${w}" height="${h}" fill="#1F3F8F"/><path d="M0 0L${w} ${h}M${w} 0L0 ${h}" stroke="#fff" stroke-width="5"/><path d="M0 0L${w} ${h}M${w} 0L0 ${h}" stroke="#D21F14" stroke-width="1.6"/><path d="M${w / 2} 0V${h}M0 ${h / 2}H${w}" stroke="#fff" stroke-width="7"/><path d="M${w / 2} 0V${h}M0 ${h / 2}H${w}" stroke="#D21F14" stroke-width="4"/>`; break;
    case 'tr': g = `<rect width="${w}" height="${h}" fill="#E30A17"/><circle cx="${w * .4}" cy="${h / 2}" r="${h * .28}" fill="#fff"/><circle cx="${w * .46}" cy="${h / 2}" r="${h * .23}" fill="#E30A17"/><circle cx="${w * .6}" cy="${h / 2}" r="${h * .08}" fill="#fff"/>`; break;
    case 'ir': g = bars3('#239F40', '#fff', '#DA0000') + `<circle cx="${w / 2}" cy="${h / 2}" r="${h * .1}" fill="#DA0000"/>`; break;
    case 'il': g = `<rect width="${w}" height="${h}" fill="#fff"/><rect y="3" width="${w}" height="3.4" fill="#0038B8"/><rect y="${h - 6.4}" width="${w}" height="3.4" fill="#0038B8"/><circle cx="${w / 2}" cy="${h / 2}" r="${h * .17}" fill="none" stroke="#0038B8" stroke-width="1.4"/>`; break;
    case 'ua': g = `<rect width="${w}" height="${h / 2 + .3}" fill="#0057B7"/><rect y="${h / 2}" width="${w}" height="${h / 2 + .3}" fill="#FFD700"/>`; break;
    case 'fr': g = `<rect width="${w / 3 + .3}" height="${h}" fill="#0055A4"/><rect x="${w / 3}" width="${w / 3 + .3}" height="${h}" fill="#fff"/><rect x="${2 * w / 3}" width="${w / 3 + .3}" height="${h}" fill="#EF4135"/>`; break;
    case 'pk': g = `<rect width="${w}" height="${h}" fill="#01411C"/><rect width="${w / 4}" height="${h}" fill="#fff"/><circle cx="${w * .6}" cy="${h / 2}" r="${h * .28}" fill="#fff"/><circle cx="${w * .66}" cy="${h / 2 - 1.2}" r="${h * .24}" fill="#01411C"/>`; break;
    case 'ar': g = bars3('#75AADB', '#fff', '#75AADB') + `<circle cx="${w / 2}" cy="${h / 2}" r="${h * .1}" fill="#F6B40E"/>`; break;
    case 'br': g = `<rect width="${w}" height="${h}" fill="#009C3B"/><path d="M${w / 2} ${h * .12}L${w * .88} ${h / 2}L${w / 2} ${h * .88}L${w * .12} ${h / 2}Z" fill="#FFDF00"/><circle cx="${w / 2}" cy="${h / 2}" r="${h * .22}" fill="#002776"/>`; break;
    case 'au': g = `<rect width="${w}" height="${h}" fill="#00247D"/><path d="M0 0L${w / 2} ${h / 2}M${w / 2} 0L0 ${h / 2}" stroke="#fff" stroke-width="3"/><path d="M${w / 4} 0V${h / 2}M0 ${h / 4}H${w / 2}" stroke="#D21F14" stroke-width="3"/><circle cx="${w / 4}" cy="${h * .75}" r="${h * .1}" fill="#fff"/><circle cx="${w * .75}" cy="${h * .5}" r="${h * .08}" fill="#fff"/>`; break;
    case 'de': g = bars3('#1A1714', '#DD0000', '#FFCE00'); break;
    case 'es': g = `<rect width="${w}" height="${h}" fill="#AA151B"/><rect y="${h * .25}" width="${w}" height="${h * .5}" fill="#F1BF00"/>`; break;
    case 'pt': g = `<rect width="${w}" height="${h}" fill="#D21F14"/><rect width="${w * .4}" height="${h}" fill="#006600"/><circle cx="${w * .4}" cy="${h / 2}" r="${h * .2}" fill="#FFCC00"/>`; break;
    default: return '';
  }
  return `<g transform="translate(${x} ${y})"><clipPath id="f${cc}"><rect width="${w}" height="${h}"/></clipPath><g clip-path="url(#f${cc})">${g}</g><rect width="${w}" height="${h}" fill="none" ${SW}/></g>`;
}

// Up to two countries, in the order the headline mentions them.
export function flagsOf(title) {
  const hits = [];
  for (const k of Object.keys(COUNTRY)) { const m = COUNTRY[k].exec(title); if (m) hits.push([m.index, k]); }
  return hits.sort((a, b) => a[0] - b[0]).map((h) => h[1]).slice(0, 2);
}

// The one number worth showing: a price, a percentage, or a count of something.
export function factOf(title) {
  let m = /(Tk\.?|BDT|৳|US\$|\$|€|£)\s?(\d[\d,.]*)\s?(lakh|crore|million|billion|trillion|m|bn|k)?(?:\s?(?:a|per|\/)\s?(kg|litre|liter|day|month|year|unit|dozen))?/i.exec(title);
  if (m) { const unit = m[3] ? ' ' + m[3].toLowerCase() : ''; const per = m[4] ? '/' + m[4].toLowerCase() : ''; return (m[1].replace(/^BDT$|^৳$/i, 'Tk').replace(/\.$/, '') + ' ' + m[2].replace(/[.,]$/, '') + unit + per).slice(0, 18); }
  m = /(\d+(?:\.\d+)?)\s?(?:%|percent|per cent)/i.exec(title); if (m) return m[1] + '%';
  m = /\b(\d[\d,]*)\s?(lakh|crore|million|billion)\s+(\w+)/i.exec(title); if (m) return m[3].length <= 7 ? (m[1] + ' ' + m[2].toLowerCase() + ' ' + m[3]).slice(0, 18) : m[1] + ' ' + m[2].toLowerCase();
  m = /\b(\d[\d,]*)\s+(killed|dead|injured|workers|factories|students|seats|jobs|people|runs|wickets|goals|points|days|hours|years|trains|buses|flights|houses|villages)\b/i.exec(title); if (m) return (m[1] + ' ' + m[2].toLowerCase()).slice(0, 18);
  m = /\bwithin\s+(an?|\d+)\s+(hour|day|minute|week)s?\b/i.exec(title); if (m) return 'within ' + (/^an?$/i.test(m[1]) ? '1' : m[1]) + ' ' + m[2].toLowerCase();
  m = /\b(flight|phase|round|stage|test)\s?(\d+)\b/i.exec(title); if (m) return m[1][0].toUpperCase() + m[1].slice(1).toLowerCase() + ' ' + m[2];
  return '';
}

// "market|Tk 30/kg|bd,pk"  <->  { tag, fact, flags }
export const encodeArt = (tag, fact, flags) => (fact || (flags && flags.length)) ? [tag, fact || '', (flags || []).join(',')].join('|') : tag;
export function decodeArt(s) { const [tag, fact = '', fl = ''] = String(s || '').split('|'); return { tag: tag || 'government', fact, flags: fl ? fl.split(',').filter(Boolean) : [] }; }

// Puts the sticker and the flags on top of a finished picture (the file ends with the clipped scene group, then the frame).
export function compose(baseSvg, fact, flags, dark) {
  let add = '';
  if (fact) {
    const w = Math.max(70, fact.length * 12.5 + 26);
    const x = 26 + w / 2, y = 54;
    const esc = fact.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    add += `<g transform="rotate(-4 ${x} ${y})"><rect x="${x - w / 2}" y="${y - 20}" width="${w}" height="40" rx="10" fill="#FFD400" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><text x="${x}" y="${y + 8}" font-family="Liberation Sans,Arial,Helvetica,sans-serif" font-weight="700" font-size="21" text-anchor="middle" fill="${INK}">${esc}</text></g>`;
  }
  if (flags && flags.length) {
    const fl = flags.map((cc, i) => flagSvg(cc, i === 0 ? 24 : 336, 196, 40, 26));
    add += fl.join('');
    if (flags.length === 2 && fl[0] && fl[1]) add += `<g><rect x="178" y="198" width="44" height="22" rx="11" fill="#fff" stroke="${INK}" stroke-width="3"/><text x="200" y="214" font-family="Liberation Sans,Arial,sans-serif" font-weight="700" font-size="14" text-anchor="middle" fill="${INK}">vs</text></g>`;
  }
  if (!add) return baseSvg;
  const marker = '</g><rect x="2" y="2"';
  const i = baseSvg.indexOf(marker);
  return i < 0 ? baseSvg : baseSvg.slice(0, i) + add + baseSvg.slice(i);
}
