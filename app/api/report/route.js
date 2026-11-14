// "Report a mistake": readers flag a wrong overview, quiz answer or fact. Reports are written to the Vercel runtime log
// as "[report] {...}" so they can be read there. Nothing about the reader is stored.
export const dynamic = 'force-dynamic';
const KINDS = ['overview', 'quiz', 'fact', 'other'];
const clean = (v, n) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, n) : '');
export async function POST(req) {
  let b = null;
  try { const t = await req.text(); if (t.length > 4000) return Response.json({ error: 'too long' }, { status: 413 }); b = JSON.parse(t); } catch (e) { return Response.json({ error: 'bad request' }, { status: 400 }); }
  const kind = KINDS.includes(b && b.kind) ? b.kind : 'other';
  const note = clean(b && b.note, 600), title = clean(b && b.title, 160), id = clean(b && b.id, 80), where = clean(b && b.where, 200);
  if (!title && !note) return Response.json({ error: 'empty' }, { status: 400 });
  console.warn('[report] ' + JSON.stringify({ at: new Date().toISOString(), kind: kind, id: id, title: title, where: where, note: note }));
  return Response.json({ ok: true });
}
