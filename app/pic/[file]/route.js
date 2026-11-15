// Story pictures with a fact sticker and flags, drawn once at build time into plain .svg files.
import fs from 'fs';
import path from 'path';
import { compose } from '../../../lib/scene';
import { getDigest } from '../../../lib/digest';
import { artKey } from '../../../lib/route';

export const dynamic = 'force-static';
export const dynamicParams = false;

async function tags() {
  let d = null;
  try { d = await getDigest(); } catch (e) { return new Map(); }
  const m = new Map();
  for (const x of (d && d.items) || []) if (x.tag && String(x.tag).indexOf('|') >= 0) m.set(artKey(x.tag), x.tag);
  return m;
}

export async function generateStaticParams() {
  const out = [];
  for (const key of (await tags()).keys()) out.push({ file: key + '.svg' }, { file: key + '-n.svg' });
  // A build needs at least one file here; this one is never linked.
  return out.length ? out : [{ file: 'none.svg' }];
}

export async function GET(req, { params }) {
  const { file } = await params;
  const dark = /-n\.svg$/.test(file), key = file.replace(/(-n)?\.svg$/, '');
  const tag = (await tags()).get(key) || 'government||';
  const [t, fact = '', flags = ''] = String(tag).split('|');
  const base = path.join(process.cwd(), 'public', 'art', (/^[a-z0-9-]+$/.test(t) ? t : 'government') + (dark ? '-n' : '') + '.svg');
  const svg = compose(fs.readFileSync(fs.existsSync(base) ? base : path.join(process.cwd(), 'public', 'art', 'government' + (dark ? '-n' : '') + '.svg'), 'utf8'), fact.slice(0, 20), flags.split(',').filter((c) => /^[a-z]{2}$/.test(c)).slice(0, 2), dark);
  return new Response(svg, { headers: { 'content-type': 'image/svg+xml; charset=utf-8' } });
}
