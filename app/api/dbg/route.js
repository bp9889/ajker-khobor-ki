import Parser from 'rss-parser';
import { getArticleText } from '../../../lib/article';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;
const C = [
  ['PA en', 'https://en.prothomalo.com/feed/'],
  ['PA en2', 'https://en.prothomalo.com/feed/bangladesh'],
  ['Star', 'https://www.thedailystar.net/rss.xml'],
  ['Star front', 'https://www.thedailystar.net/frontpage/rss.xml'],
  ['Star bd', 'https://www.thedailystar.net/news/bangladesh/rss.xml'],
  ['bdnews24', 'https://bdnews24.com/rss.xml'],
  ['bdnews24 w', 'https://bdnews24.com/?widgetName=rssfeed&widgetId=1150&getXmlFeed=true'],
  ['NewAge', 'https://www.newagebd.net/rss/rss.xml'],
  ['NewAge2', 'https://www.newagebd.net/rss'],
  ['FE', 'https://thefinancialexpress.com.bd/feed'],
  ['DailySun', 'https://www.daily-sun.com/rss'],
  ['DhakaPost', 'https://en.dhakapost.com/rss'],
  ['Observer', 'https://www.observerbd.com/rss.xml'],
  ['BSS', 'https://www.bssnews.net/rss'],
  ['UNB', 'https://unb.com.bd/rss'],
  ['TBS bd', 'https://www.tbsnews.net/bangladesh/rss.xml'],
  ['TBS sports', 'https://www.tbsnews.net/sports/rss.xml'],
  ['TBS tech', 'https://www.tbsnews.net/tech/rss.xml'],
  ['Star sports', 'https://www.thedailystar.net/sports/rss.xml'],
  ['Star tech', 'https://www.thedailystar.net/tech-startup/rss.xml'],
  ['Guardian world', 'https://www.theguardian.com/world/rss'],
  ['Guardian tech', 'https://www.theguardian.com/technology/rss'],
  ['DW', 'https://rss.dw.com/rdf/rss-en-all'],
  ['France24', 'https://www.france24.com/en/rss'],
  ['NPR', 'https://feeds.npr.org/1001/rss.xml'],
  ['Cricinfo', 'https://www.espncricinfo.com/rss/content/story/feeds/0.xml'],
  ['Verge', 'https://www.theverge.com/rss/index.xml'],
  ['Ars', 'https://feeds.arstechnica.com/arstechnica/index'],
];
const UA = 'Mozilla/5.0 (compatible; AjkerKhoborKi/1.0; RSS reader)';
const parser = new Parser();
async function one([name, url]) {
  const out = { name };
  try {
    const r = await fetch(url, { headers: { 'user-agent': UA, accept: 'application/rss+xml, application/xml, text/xml, */*' }, cache: 'no-store', signal: AbortSignal.timeout(9000) });
    out.feed = r.status;
    if (!r.ok) return out;
    const f = await parser.parseString(await r.text());
    const items = f.items || [];
    out.items = items.length;
    const link = items.map((i) => i.link).find((l) => /^https?:/.test(l || ''));
    if (link) { const t = await getArticleText(link); out.textLen = t.length; out.sample = link.slice(0, 90); }
  } catch (e) { out.err = String(e.message || e).slice(0, 60); }
  return out;
}
export async function GET() {
  return Response.json(await Promise.all(C.map(one)));
}
