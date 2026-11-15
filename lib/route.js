// Web addresses for each page, shared by the server and the browser.
import { SITE } from '../data/stories';

// `story` is a story object: live headlines have `live: true` and an `id`, samples have a `slug`.
export function pathFor(view, story) {
  if (view === 'story' && story) return story.live ? '/news/' + story.id : '/story/' + (story.slug || story.id);
  if (view === 'all') return '/stories';
  if (view === 'about') return '/about';
  if (view === 'facts') return '/did-you-know';
  return '/';
}

export function parsePath(pathname) {
  const p = pathname.replace(/\/+$/, '') || '/';
  if (p === '/') return { view: 'home' };
  if (p === '/stories') return { view: 'all' };
  if (p === '/about') return { view: 'about' };
  if (p === '/did-you-know') return { view: 'facts' };
  const m = p.match(/^\/(news|story)\/([A-Za-z0-9-]+)$/);
  if (m) return { view: 'story', sid: m[2] };
  return null;
}

export function titleFor(view, story) {
  if (view === 'story' && story) return story.title + ' | ' + SITE;
  if (view === 'all') return 'All stories | ' + SITE;
  if (view === 'about') return 'How we work | ' + SITE;
  if (view === 'facts') return 'Did you know? Ten new facts a day | ' + SITE;
  return SITE + ' Today\'s news in simple words';
}

// A short, stable file name for a picture that carries a fact and flags ("market|Tk 30/kg|bd,pk").
export function artKey(tag) {
  let h = 2166136261; const s = String(tag);
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (s.split('|')[0] || 'government').replace(/[^a-z0-9-]/g, '') + '-' + (h >>> 0).toString(36);
}

export function artFor(tag, dark) {
  // Pictures with a fact sticker and flags are drawn at build time into /pic (app/pic/[file]/route.js).
  if (tag && String(tag).indexOf('|') >= 0) return '/pic/' + artKey(tag) + (dark ? '-n' : '') + '.svg';
  return '/art/' + (tag || 'government') + (dark ? '-n' : '') + '.svg';
}
