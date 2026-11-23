// "Report a mistake": readers flag a wrong overview, quiz answer or fact. Nothing about the reader is stored.
// Each report is written to the Vercel runtime log as "[report] {...}" (kept only about an hour on the free plan) and,
// when a Vercel Blob store is connected, saved as a private file so it can be read later at /admin/reports (lib/reports.js).
import { saveReport } from '../../../lib/reports';

export const dynamic = 'force-dynamic';
const KINDS = ['overview', 'quiz', 'fact', 'other'];
const clean = (v, n) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, n) : '');

export async function POST(req) {
  let b = null;
  try { const t = await req.text(); if (t.length > 4000) return Response.json({ error: 'too long' }, { status: 413 }); b = JSON.parse(t); } catch (e) { return Response.json({ error: 'bad request' }, { status: 400 }); }
  const kind = KINDS.includes(b && b.kind) ? b.kind : 'other';
  const note = clean(b && b.note, 600), title = clean(b && b.title, 160), id = clean(b && b.id, 80), where = clean(b && b.where, 200);
  if (!title && !note) return Response.json({ error: 'empty' }, { status: 400 });
  const rec = { at: new Date().toISOString(), kind: kind, id: id, title: title, where: where, note: note };
  console.warn('[report] ' + JSON.stringify(rec));
  try { await saveReport(rec); } catch (e) { console.error('[report] could not save to Blob:', String(e && e.message || e).slice(0, 200)); }
  return Response.json({ ok: true });
}
