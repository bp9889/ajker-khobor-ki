// The web app manifest. Phones use it to install the site like an app (full screen, own icon).
export default function manifest() {
  return {
    name: 'AJKER খবর KI?',
    short_name: 'Ajker Khobor',
    description: "Today's news in simple words. Bangladesh and the world, explained in about 60 seconds.",
    id: '/',
    start_url: '/?source=app',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#F3EFE7',
    theme_color: '#D21F14',
    lang: 'en',
    categories: ['news'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'All stories', short_name: 'Stories', url: '/stories?source=shortcut', icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }] },
    ],
  };
}
