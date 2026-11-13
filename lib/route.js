// Web addresses for each page, shared by the server and the browser.
import { STORIES, SITE } from '../data/stories';

export function pathFor(view, si) {
  if (view === 'story') return '/story/' + STORIES[si].slug;
  if (view === 'all') return '/stories';
  if (view === 'about') return '/about';
  return '/';
}

export function parsePath(pathname) {
  const p = pathname.replace(/\/+$/, '') || '/';
  if (p === '/') return { view: 'home', si: 0 };
  if (p === '/stories') return { view: 'all', si: 0 };
  if (p === '/about') return { view: 'about', si: 0 };
  const m = p.match(/^\/story\/([^/]+)$/);
  if (m) { const si = STORIES.findIndex((s) => s.slug === m[1]); if (si >= 0) return { view: 'story', si: si }; }
  return null;
}

export function titleFor(view, si) {
  if (view === 'story') return STORIES[si].title + ' | ' + SITE;
  if (view === 'all') return 'All stories | ' + SITE;
  if (view === 'about') return 'How we work | ' + SITE;
  return SITE + ' Today\'s news, explained in 60 seconds';
}

export function artFor(tag, dark) {
  return '/art/' + (tag || 'government') + (dark ? '-n' : '') + '.svg';
}
