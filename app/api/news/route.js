import { getNews } from '../../../lib/news';

export const revalidate = 1800; // refresh the headlines every 30 minutes

export async function GET() {
  const items = await getNews();
  return Response.json({ items: items, updated: new Date().toISOString() });
}
