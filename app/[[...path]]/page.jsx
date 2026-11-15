import { notFound } from 'next/navigation';
import Site from '../../components/Site';
import { STORIES } from '../../data/stories';
import { getDigest } from '../../lib/digest';
import { getToday } from '../../lib/today';
import { parsePath, titleFor } from '../../lib/route';
import { factsForDay } from '../../lib/dyk';

// Every page is built as a plain file (the site is rebuilt every 20 minutes, see .github/workflows/deploy.yml).
export const dynamicParams = false;
export async function generateStaticParams() {
  let items = [];
  try { items = (await getDigest()).items || []; } catch (e) { items = []; }
  const ids = items.map((x) => x.id).filter((id) => /^[A-Za-z0-9-]{1,80}$/.test(id));
  return [{ path: [] }, { path: ['stories'] }, { path: ['about'] }, { path: ['did-you-know'] }]
    .concat(ids.map((id) => ({ path: ['news', id] })))
    .concat(STORIES.map((s) => ({ path: ['story', s.slug] })));
}

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
    story = live ? { title: live.headline || live.title, text: live.brief || live.desc || '', art: live.tag } : sample ? { title: sample.title, text: sample.quick[0], art: sample.art } : null;
  }
  return { r: r, digest: digest, story: story };
}

export async function generateMetadata({ params }) {
  const d = await load(params);
  if (!d) return {};
  const title = titleFor(d.r.view, d.story);
  const description = d.story ? d.story.text : d.r.view === 'facts' ? 'Ten surprising facts every day, two each from Bangladesh, World, Science, Tech and Sport.' : 'The news from Bangladesh and the world in simple words, with a fresh quiz every 6 hours.';
  return { title: title, description: description, openGraph: { title: title, description: description, images: ['/og/' + (d.story ? String(d.story.art || 'speech').split('|')[0] : d.r.view === 'facts' ? 'education' : 'speech') + '.png'] } };
}

export default async function Page({ params }) {
  const [d, today] = await Promise.all([load(params), getToday().catch(() => null)]);
  if (!d) notFound();
  return <Site view={d.r.view} sid={d.r.sid || ''} digest={d.digest} today={today} dyk={factsForDay()} />;
}
