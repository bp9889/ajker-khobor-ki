export const dynamic = 'force-dynamic';
export async function GET(req) {
  const u = new URL(req.url).searchParams.get('u') || '';
  if (!/^https:\/\/www\.dhakatribune\.com\//.test(u)) return Response.json({ error: 'no' });
  const out = {};
  for (const [name, ua] of [['bot', 'Mozilla/5.0 (compatible; AjkerKhobarKi/1.0)'], ['chrome', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36']]) {
    try {
      const r = await fetch(u, { headers: { 'user-agent': ua, accept: 'text/html' }, cache: 'no-store', signal: AbortSignal.timeout(9000) });
      const h = await r.text();
      out[name] = { status: r.status, len: h.length, p: (h.match(/<p[\s>]/g) || []).length, art: (h.match(/<article/g) || []).length, head: h.slice(0, 200).replace(/\s+/g, ' '), ld: (h.match(/"articleBody"/g) || []).length, og: (h.match(/og:description" content="([^"]{0,200})/) || [])[1] };
    } catch (e) { out[name] = String(e.message || e); }
  }
  return Response.json(out);
}
