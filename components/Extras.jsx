"use client";
// Two finishing touches: the cha cup that fills as you read (every page), and the open sky beside the content on wide screens.
import React from 'react';
import '../app/extras.css';

const KITES = [['#D21F14', '#FFD400'], ['#00924A', '#F3EFE7'], ['#2F5BEA', '#FFD400']];
// A kite hangs from its string, which runs off the bottom of the screen, so it swings like a real one.
function Kite({ a, b, w, f, top, delay, small }) {
  return (<div className={'sk-kite' + (small ? ' sm' : '')} style={{ width: w, top: top, left: 'calc((var(--rw) - ' + w + 'px) * ' + f + ')', animationDelay: delay + 's' }} aria-hidden="true">
    <svg viewBox="0 0 80 150">
      <path d="M40 4 L72 40 L40 86 L8 40 Z" fill={a} />
      <path d="M40 4 L72 40 L40 40 Z" fill={b} />
      <path d="M8 40 L40 86 L40 40 Z" fill={b} />
      <path d="M40 86 q-9 14 -3 28 t-6 26" fill="none" strokeWidth="3" strokeLinecap="round" style={{ stroke: a }} />
    </svg>
    <i className="sk-string" />
  </div>);
}
function Cloud({ w, f, top, delay }) {
  return (<svg className="sk-cloud" style={{ width: w, top: top, left: 'calc((var(--rw) - ' + w + 'px) * ' + f + ')', animationDelay: delay + 's' }} viewBox="0 0 120 48" aria-hidden="true"><path d="M22 42 a16 16 0 0 1 2-31 a22 22 0 0 1 42-4 a18 18 0 0 1 30 12 a15 15 0 0 1 2 23 z" strokeWidth="2.4" strokeLinejoin="round" /></svg>);
}
function Bird({ top, delay }) {
  return (<svg className="sk-bird" style={{ top: top, animationDelay: delay + 's' }} viewBox="0 0 26 12" width="26" height="11" aria-hidden="true"><path d="M1 9 Q7 1 13 8 Q19 1 25 9" fill="none" strokeWidth="2.2" strokeLinecap="round" style={{ stroke: 'var(--ink)' }} /></svg>);
}
function Star({ x, y, delay }) { return <i className="sk-star" style={{ left: x, top: y, animationDelay: delay + 's' }} />; }

export default function Extras({ d }) {
  const [ready, setReady] = React.useState(false);
  const [w, setW] = React.useState(0);
  const [show, setShow] = React.useState(false);
  const [full, setFull] = React.useState(false);
  const root = React.useRef(null);
  const view = d ? d.view : 'home';

  React.useEffect(() => {
    setReady(true);
    const size = () => setW(document.documentElement.clientWidth);
    size(); window.addEventListener('resize', size);
    return () => window.removeEventListener('resize', size);
  }, []);

  // Reading progress, eased a little, goes straight into CSS variables so the page does not re-render on every scroll.
  React.useEffect(() => {
    if (!ready) return undefined;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, run = false, cur = 0, tgt = 0, lastShow = null, lastFull = null;
    const apply = (p) => {
      const el = root.current; if (!el) return;
      el.style.setProperty('--p', p.toFixed(4));
      el.style.setProperty('--sy', String(Math.round(window.scrollY)));
      const sh = p > 0.015; if (sh !== lastShow) { lastShow = sh; setShow(sh); }
      const fu = p > 0.985; if (fu !== lastFull) { lastFull = fu; setFull(fu); }
    };
    const frame = () => { run = false; cur += (tgt - cur) * (reduce ? 1 : 0.2); if (Math.abs(tgt - cur) < 0.0008) cur = tgt; apply(cur); if (cur !== tgt) kick(); };
    const kick = () => { if (!run) { run = true; raf = requestAnimationFrame(frame); } };
    const measure = () => { const h = document.documentElement; const max = Math.max(1, h.scrollHeight - window.innerHeight); tgt = Math.min(1, Math.max(0, window.scrollY / max)); kick(); };
    window.addEventListener('scroll', measure, { passive: true }); window.addEventListener('resize', measure);
    const iv = setInterval(measure, 900); measure();
    return () => { window.removeEventListener('scroll', measure); window.removeEventListener('resize', measure); clearInterval(iv); cancelAnimationFrame(raf); };
  }, [ready, view]);

  if (!ready || !d) return <div className="ak-extras" />;
  const cw = d.cw || 1176;
  const rw = Math.min(300, Math.floor((w - cw) / 2 - 28));
  const sky = rw >= 96;

  return (<div className="ak-extras" ref={root} style={{ '--p': 0, '--sy': 0, '--cw': cw + 'px', '--rw': Math.max(0, rw) + 'px', '--sw': Math.max(0.8, Math.min(2.2, rw / 110)).toFixed(2) }}>
    <div className={'ak-chai' + (show ? ' show' : '') + (full ? ' full' : '')} aria-hidden="true">
      <svg viewBox="0 0 64 92" width="64" height="92">
        <defs><clipPath id="ch-in"><path d="M12 22 H48 L44 74 Q44 78 40 78 H20 Q16 78 16 74 Z" /></clipPath></defs>
        <g className="ch-steam"><path d="M22 16 q-5 -6 0 -11 t0 -11" /><path d="M30 16 q-5 -6 0 -11 t0 -11" /><path d="M38 16 q-5 -6 0 -11 t0 -11" /></g>
        <g clipPath="url(#ch-in)"><g className="ch-liq"><rect x="0" y="22" width="64" height="70" fill="#B5651D" /><rect x="0" y="22" width="64" height="9" fill="#E3B27A" /><path className="ch-wave" d="M-30 24 q8 -5 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 V34 H-30 Z" fill="#E3B27A" /></g></g>
        <path d="M12 22 H48 L44 74 Q44 78 40 78 H20 Q16 78 16 74 Z" fill="none" strokeWidth="2.6" strokeLinejoin="round" style={{ stroke: 'var(--ink)' }} />
        <path d="M48 30 q10 0 9 11 q-1 9 -9 9" fill="none" strokeWidth="2.6" strokeLinecap="round" style={{ stroke: 'var(--ink)' }} />
        <ellipse cx="30" cy="82" rx="22" ry="4.5" fill="#D21F14" style={{ stroke: 'var(--ink)' }} strokeWidth="2.2" />
      </svg>
    </div>

    {sky ? (<>
      <aside className="ak-rail ak-rail-l" aria-hidden="true">
        <Star x="20%" y="8%" delay={0} /><Star x="70%" y="20%" delay={-1.4} /><Star x="40%" y="46%" delay={-0.7} />
        <div className="sk-l" style={{ '--k': 0.03 }}><Cloud w={100} f={0.2} top="12%" delay={-3} /><Cloud w={84} f={0.6} top="58%" delay={0} /></div>
        <div className="sk-l" style={{ '--k': 0.07 }}>
          <Kite a={KITES[0][0]} b={KITES[0][1]} w={74} f={0.25} top="9%" delay={-1} />
          <Kite a={KITES[1][0]} b={KITES[1][1]} w={54} f={0.6} top="44%" delay={-4} small />
        </div>
        <Bird top="30%" delay={-6} /><Bird top="72%" delay={-12} />
      </aside>
      <aside className="ak-rail ak-rail-r" aria-hidden="true">
        <Star x="60%" y="12%" delay={0} /><Star x="25%" y="30%" delay={-1} /><Star x="78%" y="52%" delay={-2} />
        <div className="sk-l" style={{ '--k': 0.03 }}><Cloud w={96} f={0.7} top="6%" delay={-8} /><Cloud w={100} f={0.1} top="50%" delay={-5} /></div>
        <div className="sk-l" style={{ '--k': 0.06 }}>
          <Kite a={KITES[2][0]} b={KITES[2][1]} w={70} f={0.5} top="16%" delay={-2.5} />
          <Kite a={KITES[0][1]} b={KITES[0][0]} w={54} f={0.15} top="56%" delay={-5.5} small />
        </div>
        <Bird top="24%" delay={-3} /><Bird top="64%" delay={-9} />
      </aside>
    </>) : null}
  </div>);
}
