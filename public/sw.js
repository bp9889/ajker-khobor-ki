// Keeps the app opening even with no signal: a news page needs the network, so offline shows a friendly page instead of an error.
// Navigation preload lets the browser start loading the page while this worker is still waking up, so it adds no delay.
const OFFLINE = '/offline.html';
const CACHE = 'akk-shell-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.add(OFFLINE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => (self.registration.navigationPreload ? self.registration.navigationPreload.enable() : null))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.mode !== 'navigate') return;
  e.respondWith((async () => {
    try {
      const early = await e.preloadResponse;
      return early || await fetch(e.request);
    } catch (err) {
      return (await caches.match(OFFLINE)) || Response.error();
    }
  })());
});
