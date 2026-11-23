import { notFound } from 'next/navigation';
import Site from '../../components/Site';
import { STORIES } from '../../data/stories';
import { getDigest, getStory } from '../../lib/digest';
import { getToday } from '../../lib/today';
import { parsePath, titleFor } from '../../lib/route';
import { factsForDay } from '../../lib/dyk';

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
    // A story that has left the feeds comes from the week-long archive and is added to this page's list, so its link still works.
    const live = await getStory(r.sid, digest);
    if (live && digest && !digest.items.some((x) => x.id === live.id)) digest = Object.assign({}, digest, { items: digest.items.concat([live]) });
    const sample = STORIES.find((s) => s.slug === r.sid);
    story = live ? { title: live.headline || live.title, text: live.brief || live.desc || '', art: live.tag } : sample ? { title: sample.title, text: sample.quick[0], art: sample.art } : null;
  }
  return { r: r, digest: digest, story: story };
}

export async function generateMetadata({ params }) {
  const d = await load(params);
  if (!d) return {};
  const title = titleFor(d.r.view, d.story);
  const description = d.story ? d.story.text : d.r.view === 'facts' ? 'Ten surprising facts every day, two each from Bangladesh, World, Science, Tech and Sport.' : 'The news from Bangladesh and the world in simple words, with a fresh quiz every 6 hours.';
  return { title: title, description: description, openGraph: { title: title, description: description, images: [d.story ? '/og/' + String(d.story.art || 'speech').split('|')[0] + '.png' : '/og/share.png'] } };
}

export default async function Page({ params }) {
  const [d, today] = await Promise.all([load(params), getToday().catch(() => null)]);
  if (!d) notFound();
  return <Site view={d.r.view} sid={d.r.sid || ''} digest={d.digest} today={today} dyk={factsForDay()} />;
}
