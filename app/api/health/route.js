// A small check of what each news feed returned (counts only, no article text).
import { getNews, feedStatus } from '../../../lib/news';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export async function GET() {
  const news = await getNews();
  const by = {};
  for (const x of news) { const k = x.section + ' / ' + x.source; by[k] = (by[k] || 0) + 1; }
  return Response.json({ total: news.length, bySource: by, feeds: feedStatus() });
}
