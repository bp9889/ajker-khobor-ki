// "Explain it simpler": returns the easier retelling of one story's overview. Written on first request, then saved.
import { getSimpler } from '../../../lib/digest';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;
export async function GET(req) {
  const id = new URL(req.url).searchParams.get('id') || '';
  if (!/^[A-Za-z0-9-]{1,80}$/.test(id)) return Response.json({ error: 'bad id' }, { status: 400 });
  try {
    const text = await getSimpler(id);
    if (!text) return Response.json({ error: 'not found' }, { status: 404 });
    return Response.json({ text: text });
  } catch (e) {
    console.error('[simpler] failed', String(e && e.message || e).slice(0, 300));
    return Response.json({ error: 'busy' }, { status: 503 });
  }
}
