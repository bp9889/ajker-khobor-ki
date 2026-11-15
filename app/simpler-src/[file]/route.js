// The overview of each written story, saved as a small file so the worker can write "Explain it simpler"
// from our own text only (readers cannot send it their own text to rewrite).
import { getDigest } from '../../../lib/digest';

export const dynamic = 'force-static';
export const dynamicParams = false;

async function items() {
  try { const d = await getDigest(); return ((d && d.items) || []).filter((x) => x.summary && /^[A-Za-z0-9-]{1,80}$/.test(x.id)); } catch (e) { return []; }
}

export async function generateStaticParams() {
  const list = await items();
  return list.length ? list.map((x) => ({ file: x.id + '.json' })) : [{ file: 'none.json' }];
}

export async function GET(req, { params }) {
  const { file } = await params;
  const it = (await items()).find((x) => x.id + '.json' === file);
  return Response.json(it ? { id: it.id, headline: it.headline || it.title, summary: it.summary } : {});
}
