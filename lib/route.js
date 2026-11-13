// Web addresses for each page, shared by the server and the browser.
import { SITE } from '../data/stories';

// `story` is a story object: live headlines have `live: true` and an `id`, samples have a `slug`.
export function pathFor(view, story) {
  if (view === 'story' && story) return story.live ? '/news/' + story.id : '/story/' + (story.slug || story.id);
  if (view === 'all') return '/stories';
  if (view === 'about') return '/about';
  return '/';
}

export function parsePath(pathname) {
  const p = pathname.replace(/\/+$/, '') || '/';
  if (p === '/') return { view: 'home' };
  if (p === '/stories') return { view: 'all' };
  if (p === '/about') return { view: 'about' };
  const m = p.match(/^\/(news|story)\/([A-Za-z0-9-]+)$/);
  if (m) return { view: 'story', sid: m[2] };
  return null;
}

export function titleFor(view, story) {
  if (view === 'story' && story) return story.title + ' | ' + SITE;
  if (view === 'all') return 'All stories | ' + SITE;
  if (view === 'about') return 'How we work | ' + SITE;
  return SITE + ' Today\'s news in simple words';
}

export function artFor(tag, dark) {
  return '/art/' + (tag || 'government') + (dark ? '-n' : '') + '.svg';
}
