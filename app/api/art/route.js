// A story's picture: the scene for its topic, plus the key fact as a sticker and the flags of the countries it is about.
import { compose } from '../../../lib/scene';

export const revalidate = 86400;

const SAFE = /^[a-z0-9-]+$/;
export async function GET(request) {
  const url = new URL(request.url);
  const tag = url.searchParams.get('t') || 'government';
  const fact = (url.searchParams.get('f') || '').slice(0, 20);
  const flags = (url.searchParams.get('c') || '').split(',').filter((x) => /^[a-z]{2}$/.test(x)).slice(0, 2);
  const dark = url.searchParams.get('d') === '1';
  if (!SAFE.test(tag)) return new Response('bad tag', { status: 400 });
  const res = await fetch(new URL('/art/' + tag + (dark ? '-n' : '') + '.svg', url.origin));
  if (!res.ok) return new Response('not found', { status: 404 });
  const svg = compose(await res.text(), fact, flags, dark);
  return new Response(svg, { headers: { 'content-type': 'image/svg+xml; charset=utf-8', 'cache-control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800' } });
}
