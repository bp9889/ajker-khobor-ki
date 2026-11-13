import { notFound } from 'next/navigation';
import Site from '../../components/Site';
import { STORIES } from '../../data/stories';
import { parsePath, titleFor } from '../../lib/route';

const routeOf = (params) => parsePath('/' + ((params && params.path) || []).join('/'));

export function generateStaticParams() {
  return [{ path: [] }, { path: ['stories'] }, { path: ['about'] }].concat(STORIES.map((s) => ({ path: ['story', s.slug] })));
}
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const r = routeOf(await params);
  if (!r) return {};
  const story = r.view === 'story' ? STORIES[r.si] : null;
  const description = story ? story.quick[0] + ' ' + story.why : 'Five stories a day from Bangladesh and the world, explained in about 60 seconds each.';
  const title = titleFor(r.view, r.si);
  return { title: title, description: description, openGraph: { title: title, description: description, images: ['/og/' + (story ? story.art : 'speech') + '.png'] } };
}

export default async function Page({ params }) {
  const r = routeOf(await params);
  if (!r) notFound();
  return <Site view={r.view} si={r.si} />;
}
