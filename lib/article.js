// Reads the public text of a news article so the AI can retell what happened.
// Only used to write the overview; the original link always stays on the story page.
const UA = 'Mozilla/5.0 (compatible; AjkerKhobarKi/1.0; +https://ajker-khobor-ki.vercel.app)';

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', ndash: '–', mdash: '—', hellip: '…' };
function decode(t) {
  return t
    .replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (m, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => (ENT[n.toLowerCase()] !== undefined ? ENT[n.toLowerCase()] : m));
}
const text = (h) => decode(h.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

const JUNK = /^(read more|related|advertisement|follow us|subscribe|copyright|sign up|share|click here|also read|more from|listen|watch|published|updated|\(?photo|image source|getty|reuters|ap\b)/i;

export async function getArticleText(url, max = 2400) {
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml' }, redirect: 'follow', cache: 'no-store', signal: AbortSignal.timeout(9000) });
    if (!res.ok) return '';
    let html = (await res.text()).slice(0, 900000);
    const meta = (html.match(/<meta[^>]+(?:property="og:description"|name="description")[^>]+content="([^"]*)"/i) || [])[1] || '';
    html = html.replace(/<(script|style|noscript|nav|footer|aside|figure|figcaption|header|form|svg|iframe)[\s\S]*?<\/\1>/gi, ' ');
    const arts = html.match(/<article[\s\S]*?<\/article>/gi);
    const scope = arts && arts.length ? arts.sort((a, b) => b.length - a.length)[0] : html;
    const seen = new Set();
    const paras = [];
    for (const m of scope.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
      const p = text(m[1]);
      if (p.length < 50 || JUNK.test(p) || seen.has(p)) continue;
      seen.add(p);
      paras.push(p);
    }
    let out = paras.join(' ');
    if (out.length < 200 && meta) out = decode(meta).trim() + ' ' + out;
    return out.slice(0, max);
  } catch (e) {
    return '';
  }
}

// Reads many articles at once, a few at a time, so a slow site cannot hold everything up.
export async function getMany(items, size = 6) {
  const out = new Array(items.length).fill('');
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      out[i] = await getArticleText(items[i].link);
    }
  }
  await Promise.all(Array.from({ length: size }, worker));
  return out;
}
