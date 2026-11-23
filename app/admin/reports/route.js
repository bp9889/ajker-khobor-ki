// Private list of readers' "Report a mistake" notes. Protected by the browser's own password box (HTTP Basic auth):
// any user name, password = the REPORTS_PASSWORD env var in Vercel. Without that env var the page does not exist (404).
import { timingSafeEqual, createHash } from 'crypto';
import { blobReady, latestReports } from '../../../lib/reports';

export const dynamic = 'force-dynamic';

const same = (a, b) => timingSafeEqual(createHash('sha256').update(String(a)).digest(), createHash('sha256').update(String(b)).digest());
const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const page = (body, status = 200, extra = {}) => new Response('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Reports | AJKER খবর KI?</title><style>body{font-family:system-ui,sans-serif;margin:0;padding:16px;background:#F7F3EA;color:#1A1714}h1{font-size:22px;margin:0 0 4px}p.m{color:#6B6358;margin:0 0 16px}.r{background:#fff;border:2px solid #E2D9C6;border-radius:12px;padding:12px 14px;margin:0 0 10px}.k{display:inline-block;font-size:12px;font-weight:700;text-transform:uppercase;background:#1A1714;color:#fff;border-radius:6px;padding:2px 7px;margin-right:6px}.t{font-weight:700;margin:6px 0}.n{white-space:pre-wrap;margin:6px 0}.w{font-size:13px;color:#6B6358;word-break:break-all}a{color:#2F5BEA}</style></head><body>' + body + '</body></html>',
  { status: status, headers: Object.assign({ 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' }, extra) });

export async function GET(req) {
  const pass = process.env.REPORTS_PASSWORD;
  if (!pass) return new Response('Not found', { status: 404 });
  const m = /^Basic\s+(.+)$/i.exec(req.headers.get('authorization') || '');
  const given = m ? Buffer.from(m[1], 'base64').toString('utf8').split(':').slice(1).join(':') : null;
  if (given === null || !same(given, pass)) return page('<h1>Password needed</h1>', 401, { 'www-authenticate': 'Basic realm="AJKER reports", charset="UTF-8"' });
  if (!blobReady()) return page('<h1>Reports</h1><p class="m">No Blob store is connected yet, so reports only go to the Vercel log (search <b>[report]</b>, kept about an hour).</p>');
  let data;
  try { data = await latestReports(200); } catch (e) { return page('<h1>Reports</h1><p class="m">Could not read the Blob store: ' + esc(String(e && e.message || e).slice(0, 200)) + '</p>', 500); }
  const when = (iso) => { try { return new Date(iso).toLocaleString('en-GB', { timeZone: 'Asia/Dhaka', dateStyle: 'medium', timeStyle: 'short' }); } catch (e) { return iso; } };
  const rows = data.reports.map((r) => '<div class="r"><div><span class="k">' + esc(r.kind) + '</span><span class="w">' + esc(when(r.at)) + ' (Dhaka)</span></div>' +
    (r.title ? '<div class="t">' + esc(r.title) + '</div>' : '') + (r.note ? '<div class="n">' + esc(r.note) + '</div>' : '') +
    // "where" comes from the reader's browser: only a plain path on this site becomes a link (never javascript: or another site).
    '<div class="w">' + (r.where ? 'Page: ' + (/^\/[A-Za-z0-9\-_/]*$/.test(r.where) ? '<a href="' + esc(r.where) + '">' + esc(r.where) + '</a>' : esc(r.where)) : '') + (r.id ? ' · id ' + esc(r.id) : '') + '</div></div>').join('');
  return page('<h1>Reader reports</h1><p class="m">' + (data.total ? 'Newest first. Showing ' + data.reports.length + ' of ' + data.total + '.' : 'No reports yet.') + '</p>' + rows);
}
