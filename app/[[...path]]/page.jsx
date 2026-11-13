import { notFound } from 'next/navigation';
import Site from '../../components/Site';
import { STORIES } from '../../data/stories';
import { getDigest } from '../../lib/digest';
import { parsePath, titleFor } from '../../lib/route';

export const revalidate = 600; // pages pick up new headlines every 10 minutes
export const dynamicParams = true;
export const maxDuration = 300;
export function generateStaticParams() { return []; }

const routeOf = (params) => parsePath('/' + ((params && params.path) || []).join('/'));

async function load(params) {
  const r = routeOf(await params);
  if (!r) return null;
  let digest = null;
  try { digest = await getDigest(); } catch (e) { console.error('[page] digest failed', e); }
  let story = null;
  if (r.view === 'story') {
    const live = digest && digest.items.find((x) => x.id === r.sid);
    const sample = STORIES.find((s) => s.slug === r.sid);
    story = live ? { title: live.headline || live.title, text: live.summary || live.desc || '', art: live.tag } : sample ? { title: sample.title, text: sample.quick[0], art: sample.art } : null;
  }
  return { r: r, digest: digest, story: story };
}

export async function generateMetadata({ params }) {
  const d = await load(params);
  if (!d) return {};
  const title = titleFor(d.r.view, d.story);
  const description = d.story ? d.story.text : 'The news from Bangladesh and the world in simple words, with a fresh quiz every 6 hours.';
  return { title: title, description: description, openGraph: { title: title, description: description, images: ['/og/' + (d.story ? d.story.art : 'speech') + '.png'] } };
}

export default async function Page({ params }) {
  const d = await load(params);
  if (!d) notFound();
  return <Site view={d.r.view} sid={d.r.sid || ''} digest={d.digest} />;
}
