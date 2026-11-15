'use client';
import React from 'react';
import app from '../data/app.json';

// One bar at the bottom of the screen, for three jobs (all set in data/app.json):
// 1. In a phone browser: "Tap to download the app" (Android gets the APK, iPhone gets Add to Home Screen steps).
// 2. Inside the app, when apkVersion is higher than the version the app was opened with: "Download the update".
// 3. Inside the app, once per release number: a short "what's new" note.
// The app shows the live site, so site changes reach it at once; only (2) needs a new download.
const DAY = 24 * 60 * 60 * 1000;
const get = (k) => { try { return window.localStorage.getItem(k); } catch (e) { return null; } };
const set = (k, v) => { try { window.localStorage.setItem(k, String(v)); } catch (e) { /* private mode */ } };

function platform() {
  const ua = navigator.userAgent || '';
  if (/Android/i.test(ua)) return /Mobile/i.test(ua) ? 'android' : 'android-tab';
  if (/iPhone|iPod/i.test(ua)) return 'ios';
  return '';
}

// Is this page running inside the installed app? The app opens the site with ?source=app.
function inApp() {
  const q = new URLSearchParams(window.location.search);
  if (q.get('source') === 'app') {
    set('akk-av', Number(q.get('av')) || 1);
    try { window.sessionStorage.setItem('akk-inapp', '1'); } catch (e) { /* ignore */ }
    return true;
  }
  try { if (window.sessionStorage.getItem('akk-inapp') === '1') return true; } catch (e) { /* ignore */ }
  try { if (window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: fullscreen)').matches) return true; } catch (e) { /* ignore */ }
  return navigator.standalone === true || (document.referrer || '').indexOf('android-app://') === 0;
}

function snoozed(key, ms) { const t = Number(get(key)); return t > 0 && Date.now() - t < ms; }

export default function InstallBanner() {
  const [mode, setMode] = React.useState('');
  const [os, setOs] = React.useState('');
  const [on, setOn] = React.useState(false);
  const [hint, setHint] = React.useState(false);
  const prompt = React.useRef(null);
  const apk = app.apk || '';
  const rel = app.release || null;

  React.useEffect(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
    const p = platform();
    let m = '';
    if (inApp()) {
      const have = Number(get('akk-av')) || 1;
      if (apk && (app.apkVersion || 1) > have && p.indexOf('android') === 0 && !snoozed('akk-upd-no', 3 * DAY)) m = 'update';
      else if (rel && rel.n > (Number(get('akk-rel')) || 0)) m = 'news';
    } else if ((p === 'android' || p === 'ios') && !snoozed('akk-app-no', 14 * DAY)) m = 'install';
    if (!m) return undefined;
    const keep = (e) => { e.preventDefault(); prompt.current = e; };
    const gone = () => { setOn(false); setTimeout(() => setMode(''), 400); };
    window.addEventListener('beforeinstallprompt', keep);
    window.addEventListener('appinstalled', gone);
    setOs(p); setMode(m);
    // Let the reader see the page first, then let the bar rise.
    const t = setTimeout(() => requestAnimationFrame(() => setOn(true)), m === 'install' ? 2500 : 1200);
    return () => { clearTimeout(t); window.removeEventListener('beforeinstallprompt', keep); window.removeEventListener('appinstalled', gone); };
  }, []);

  const hide = () => { setOn(false); setTimeout(() => setMode(''), 400); };
  const close = () => {
    if (mode === 'install') set('akk-app-no', Date.now());
    if (mode === 'update') set('akk-upd-no', Date.now());
    if (mode === 'news' && rel) set('akk-rel', rel.n);
    hide();
  };

  const tap = async () => {
    const ev = prompt.current;
    if (!ev) { setHint(true); return; }
    prompt.current = null;
    try { await ev.prompt(); const r = await ev.userChoice; if (r && r.outcome === 'accepted') hide(); } catch (e) { setHint(true); }
  };

  if (!mode) return null;
  const tab = on ? 0 : -1;
  let title, line, main, no;
  if (mode === 'update') {
    title = 'A new version of the app is ready';
    line = 'Download it and open the file to update. Your saved stories stay.';
    main = <a className="ak-app-go" href={apk} download tabIndex={tab} onClick={() => setTimeout(hide, 400)}>Download the update</a>;
    no = 'Later';
  } else if (mode === 'news') {
    title = rel.title;
    line = rel.note;
    main = rel.href ? <a className="ak-app-go" href={rel.href} tabIndex={tab} onClick={() => set('akk-rel', rel.n)}>{rel.go || 'Show me'}</a> : null;
    no = 'Got it';
  } else {
    const how = os === 'ios'
      ? 'Tap the Share button in Safari, then choose "Add to Home Screen".'
      : 'Open the browser menu (the three dots), then tap "Install app" or "Add to Home screen".';
    title = 'Keep the news on your phone';
    line = hint ? how : 'Opens full screen, like an app. Free.';
    main = apk && os === 'android'
      ? <a className="ak-app-go" href={apk} download tabIndex={tab} onClick={() => setTimeout(close, 400)}>Tap to download the app</a>
      : <button type="button" className="ak-app-go" tabIndex={tab} onClick={tap}>{os === 'ios' ? 'Show me how' : 'Tap to install the app'}</button>;
    no = 'Not now';
  }

  return (
    <div className={'ak-app' + (mode !== 'install' ? ' inapp' : '') + (on ? ' on' : '')} role="region" aria-label={mode === 'install' ? 'Get the app' : 'App update'} aria-hidden={on ? undefined : true}>
      <svg className="ak-app-kite" viewBox="0 0 64 64" width="44" height="44" aria-hidden="true"><rect width="64" height="64" rx="12" fill="#D21F14" /><path d="M32 8 L52 29 L32 54 L12 29 Z" fill="#FFD400" /><path d="M32 8 L52 29 L32 29 Z M12 29 L32 54 L32 29 Z" fill="#fff" /></svg>
      <div className="ak-app-txt" role={mode === 'install' ? undefined : 'status'}>
        <strong>{title}</strong>
        <span>{line}</span>
      </div>
      <div className="ak-app-btns">
        {main}
        <button type="button" className="ak-app-no" tabIndex={tab} onClick={close}>{no}</button>
      </div>
    </div>
  );
}
