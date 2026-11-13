import Parser from 'rss-parser';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;
const C = [
  ['Star front', 'https://www.thedailystar.net/frontpage/rss.xml'],
  ['Star bd', 'https://www.thedailystar.net/news/bangladesh/rss.xml'],
  ['Star rss', 'https://www.thedailystar.net/rss.xml'],
  ['PA en', 'https://en.prothomalo.com/feed/'],
  ['PA en nos', 'https://en.prothomalo.com/feed'],
  ['PA bd', 'https://en.prothomalo.com/bangladesh/feed'],
  ['PA sitemap', 'https://en.prothomalo.com/sitemap/sitemap-news.xml'],
  ['bdnews24', 'https://bdnews24.com/rss.xml'],
  ['bdn w', 'https://bdnews24.com/?widgetName=rssfeed&widgetId=1150&getXmlFeed=true'],
  ['bdn bd', 'https://bdnews24.com/bangladesh/rss.xml'],
  ['bdn feed', 'https://bdnews24.com/feed'],
];
const UA = 'Mozilla/5.0 (compatible; AjkerKhoborKi/1.0; RSS reader)';
const parser = new Parser();
async function one([name, url]) {
  const out = { name };
  try {
    const r = await fetch(url, { headers: { 'user-agent': UA, accept: 'application/rss+xml, application/xml, text/xml, */*' }, cache: 'no-store', signal: AbortSignal.timeout(9000) });
    const txt = await r.text();
    out.status = r.status; out.len = txt.length; out.type = r.headers.get('content-type'); out.head = txt.slice(0, 160).replace(/\s+/g, ' ');
    try { const f = await parser.parseString(txt); out.items = (f.items || []).length; out.dates = (f.items || []).slice(0, 3).map((i) => i.isoDate || i.pubDate || 'none'); out.titles = (f.items || []).slice(0, 2).map((i) => (i.title || '').slice(0, 60)); } catch (e) { out.parseErr = String(e.message).slice(0, 80); }
  } catch (e) { out.err = String(e.message || e).slice(0, 60); }
  return out;
}
export async function GET() { return Response.json(await Promise.all(C.map(one))); }
