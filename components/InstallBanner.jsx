'use client';
import React from 'react';
import app from '../data/app.json';

// "Get the app" bar for phones. Shows only on Android and iPhone browsers, never inside the installed app,
// and stays away for two weeks after "Not now". If data/app.json has an apk address the button downloads
// that file; otherwise it opens the phone's own install prompt (Chrome makes a real app from the site).
const SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;
const KEY = 'akk-app-no';

function platform() {
  const ua = navigator.userAgent || '';
  if (/Android/i.test(ua) && /Mobile/i.test(ua)) return 'android';
  if (/iPhone|iPod/i.test(ua)) return 'ios';
  return '';
}

function installed() {
  try {
    if (window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: fullscreen)').matches) return true;
  } catch (e) { /* older browsers */ }
  return navigator.standalone === true || (document.referrer || '').indexOf('android-app://') === 0;
}

function snoozed() {
  try { const t = Number(localStorage.getItem(KEY)); return t > 0 && Date.now() - t < SNOOZE_MS; } catch (e) { return false; }
}

export default function InstallBanner() {
  const [os, setOs] = React.useState('');
  const [on, setOn] = React.useState(false);
  const [hint, setHint] = React.useState(false);
  const prompt = React.useRef(null);
  const apk = app.apk || '';

  React.useEffect(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
    const p = platform();
    if (!p || installed() || snoozed()) return undefined;
    const keep = (e) => { e.preventDefault(); prompt.current = e; };
    const gone = () => { setOn(false); setTimeout(() => setOs(''), 400); };
    window.addEventListener('beforeinstallprompt', keep);
    window.addEventListener('appinstalled', gone);
    setOs(p);
    // Wait a moment so the reader sees the news first, then let the bar rise.
    const t = setTimeout(() => requestAnimationFrame(() => setOn(true)), 2500);
    return () => { clearTimeout(t); window.removeEventListener('beforeinstallprompt', keep); window.removeEventListener('appinstalled', gone); };
  }, []);

  const close = () => {
    try { localStorage.setItem(KEY, String(Date.now())); } catch (e) { /* private mode */ }
    setOn(false);
    setTimeout(() => setOs(''), 400);
  };

  const tap = async () => {
    const ev = prompt.current;
    if (!ev) { setHint(true); return; }
    prompt.current = null;
    try { await ev.prompt(); const r = await ev.userChoice; if (r && r.outcome === 'accepted') { setOn(false); setTimeout(() => setOs(''), 400); } } catch (e) { setHint(true); }
  };

  if (!os) return null;
  const label = apk ? 'Tap to download the app' : 'Tap to install the app';
  const how = os === 'ios'
    ? 'Tap the Share button in Safari, then choose "Add to Home Screen".'
    : 'Open the browser menu (the three dots), then tap "Install app" or "Add to Home screen".';

  return (
    <div className={'ak-app' + (on ? ' on' : '')} role="region" aria-label="Get the app" aria-hidden={on ? undefined : true}>
      <svg className="ak-app-kite" viewBox="0 0 64 64" width="44" height="44" aria-hidden="true"><rect width="64" height="64" rx="12" fill="#D21F14" /><path d="M32 8 L52 29 L32 54 L12 29 Z" fill="#FFD400" /><path d="M32 8 L52 29 L32 29 Z M12 29 L32 54 L32 29 Z" fill="#fff" /></svg>
      <div className="ak-app-txt">
        <strong>Keep the news on your phone</strong>
        <span>{hint ? how : 'Opens full screen, like an app. Free.'}</span>
      </div>
      <div className="ak-app-btns">
        {apk && os === 'android'
          ? <a className="ak-app-go" href={apk} download tabIndex={on ? 0 : -1} onClick={() => setTimeout(close, 400)}>{label}</a>
          : <button type="button" className="ak-app-go" tabIndex={on ? 0 : -1} onClick={tap}>{os === 'ios' ? 'Show me how' : label}</button>}
        <button type="button" className="ak-app-no" tabIndex={on ? 0 : -1} onClick={close}>Not now</button>
      </div>
    </div>
  );
}
