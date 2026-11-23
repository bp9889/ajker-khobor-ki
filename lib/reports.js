// Readers' "Report a mistake" notes, kept as private files in a Vercel Blob store (folder reports/).
// Works once a Blob store is connected to the project (Vercel adds BLOB_READ_WRITE_TOKEN); until then reports only go to the log.
import { put, list, get } from '@vercel/blob';

export const blobReady = () => !!(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

export async function saveReport(rec) {
  if (!blobReady()) return false;
  await put('reports/' + rec.at.replace(/[:.]/g, '-') + '-' + rec.kind + '.json', JSON.stringify(rec), { access: 'private', addRandomSuffix: true, contentType: 'application/json' });
  return true;
}

// The newest reports first (up to `max`).
export async function latestReports(max = 200) {
  const found = [];
  let cursor;
  do { const r = await list({ prefix: 'reports/', limit: 1000, cursor: cursor }); found.push(...r.blobs); cursor = r.hasMore ? r.cursor : undefined; } while (cursor && found.length < 5000);
  found.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  const out = await Promise.all(found.slice(0, max).map(async (b) => {
    try { const g = await get(b.pathname, { access: 'private', useCache: false }); return g && g.statusCode === 200 ? await new Response(g.stream).json() : null; } catch (e) { return null; }
  }));
  return { total: found.length, reports: out.filter(Boolean) };
}
