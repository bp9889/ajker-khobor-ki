"use client";
// Design lab: lets the site owner try options on the real site (open any page with ?lab=1).
// Nothing here shows for ordinary readers unless they have turned the lab on in this browser.
import React from 'react';
import '../app/lab.css';

const OPTS = {
  p: [['off', 'None'], ['weave', 'Jamdani weave'], ['punch', 'Ticket punch'], ['chai', 'Cha cup'], ['vine', 'Alpona vine']],
  w: [['flap', 'Old flip'], ['stamp', 'Rubber stamp'], ['brush', 'Signboard brush'], ['tear', 'Calendar tear'], ['type', 'Typewriter']],
  s: [['off', 'Plain'], ['route', 'Bus route'], ['sky', 'Open sky'], ['pin', 'Pinboard'], ['ticker', 'Headline ticker']]
};
const DEF = { p: 'off', w: 'flap', s: 'off' };
const HOME_STOPS = [['Today’s five', 'pics-h'], ['Live headlines', 'live-h'], ['On board', 'ride-h'], ['Topics', 'topics-h'], ['Play & learn', 'play-h'], ['Join', 'join']];
const label = (k, id) => (OPTS[k].find((o) => o[0] === id) || [0, id])[1];

function scrollToId(id) { try { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) {} }

const KITES = [['#D21F14', '#FFD400'], ['#00924A', '#F3EFE7'], ['#2F5BEA', '#FFD400']];
function Kite({ a, b, style, cls }) {
  return (<div className={'sk-kite ' + (cls || '')} style={style} aria-hidden="true">
    <svg viewBox="0 0 80 150">
      <path d="M40 4 L72 40 L40 86 L8 40 Z" fill={a} />
      <path d="M40 4 L72 40 L40 40 Z" fill={b} />
      <path d="M8 40 L40 86 L40 40 Z" fill={b} />
      <path d="M40 86 q-9 14 -3 28 t-6 26" fill="none" strokeWidth="3" strokeLinecap="round" style={{ stroke: a }} />
    </svg>
    <i className="sk-string" />
  </div>);
}
function Cloud({ style }) {
  return (<svg className="sk-cloud" style={style} viewBox="0 0 120 48" aria-hidden="true"><path d="M22 42 a16 16 0 0 1 2-31 a22 22 0 0 1 42-4 a18 18 0 0 1 30 12 a15 15 0 0 1 2 23 z" strokeWidth="2.4" strokeLinejoin="round" /></svg>);
}
function Bird({ style }) {
  return (<svg className="sk-bird" style={style} viewBox="0 0 26 12" width="26" height="11" aria-hidden="true"><path d="M1 9 Q7 1 13 8 Q19 1 25 9" fill="none" strokeWidth="2.2" strokeLinecap="round" style={{ stroke: 'var(--ink)' }} /></svg>);
}
function Rickshaw() {
  return (<svg viewBox="0 0 44 30" width="40" height="27" aria-hidden="true">
    <path d="M6 14 Q6 3 19 3 Q26 3 28 12 Z" fill="#D21F14" />
    <path d="M6 14 H30 L27 22 H9 Z" fill="#FFD400" stroke="#1A1714" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="11" cy="24" r="4.6" fill="#FFF" stroke="#1A1714" strokeWidth="2.2" />
    <circle cx="34" cy="24" r="4.6" fill="#FFF" stroke="#1A1714" strokeWidth="2.2" />
    <path d="M30 14 L37 24" stroke="#1A1714" strokeWidth="2.2" strokeLinecap="round" />
  </svg>);
}
function Bloom({ cx, cy, t, c1, c2 }) {
  const petals = [0, 72, 144, 216, 288];
  return (<g className="vn-bloom" style={{ '--t': t }} transform={'translate(' + cx + ' ' + cy + ')'}>
    <g className="vn-b">{petals.map((r) => <ellipse key={r} cx="0" cy="-7" rx="4.2" ry="7" fill={c1} transform={'rotate(' + r + ')'} />)}<circle r="4" fill={c2} /><circle r="1.6" fill="#1A1714" /></g>
  </g>);
}
function Leaf({ cx, cy, rot, t }) {
  return (<g transform={'translate(' + cx + ' ' + cy + ') rotate(' + rot + ')'}><ellipse className="vn-leaf" style={{ '--t': t }} cx="0" cy="-7" rx="4" ry="8" fill="#00924A" /></g>);
}

export default function Lab({ d }) {
  const [ready, setReady] = React.useState(false);
  const [on, setOn] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const [sel, setSel] = React.useState(DEF);
  const [dim, setDim] = React.useState({ w: 0, h: 0 });
  const [step, setStep] = React.useState(0);
  const [show, setShow] = React.useState(false);
  const [stop, setStop] = React.useState(0);
  const [copied, setCopied] = React.useState(false);
  const root = React.useRef(null);
  const view = d ? d.view : 'home';

  React.useEffect(() => {
    let s = {}, enabled = false;
    try {
      const q = new URLSearchParams(window.location.search).get('lab');
      if (q === '1') window.localStorage.setItem('akk-lab', '1');
      if (q === '0') { window.localStorage.removeItem('akk-lab'); window.localStorage.removeItem('akk-labsel'); }
      enabled = window.localStorage.getItem('akk-lab') === '1';
      s = JSON.parse(window.localStorage.getItem('akk-labsel') || '{}') || {};
    } catch (e) {}
    const ok = (k, v) => (OPTS[k].some((o) => o[0] === v) ? v : DEF[k]);
    setSel({ p: ok('p', s.p), w: ok('w', s.w), s: ok('s', s.s) });
    setOn(enabled); setReady(true);
    const size = () => setDim({ w: document.documentElement.clientWidth, h: window.innerHeight });
    size(); window.addEventListener('resize', size);
    return () => window.removeEventListener('resize', size);
  }, []);

  React.useEffect(() => {
    try { document.documentElement.setAttribute('data-ak-w', sel.w); } catch (e) {}
    return () => { try { document.documentElement.removeAttribute('data-ak-w'); } catch (e) {} };
  }, [sel.w]);

  // Scroll progress, eased a little, written straight to CSS variables so the page does not re-render on every scroll.
  const wantsScroll = ready && (sel.p !== 'off' || sel.s === 'route' || sel.s === 'sky');
  React.useEffect(() => {
    if (!wantsScroll) return undefined;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, run = false, cur = 0, tgt = 0, lastStep = -1, lastShow = null, lastStop = -1;
    const apply = (p) => {
      const el = root.current; if (!el) return;
      el.style.setProperty('--p', p.toFixed(4));
      el.style.setProperty('--sy', String(Math.round(window.scrollY)));
      const n = Math.round(p * 10); if (n !== lastStep) { lastStep = n; setStep(n); }
      const sh = p > 0.015; if (sh !== lastShow) { lastShow = sh; setShow(sh); }
      if (view === 'home') {
        let idx = 0;
        HOME_STOPS.forEach((st, i) => { const e = document.getElementById(st[1]); if (e && e.getBoundingClientRect().top < window.innerHeight * 0.45) idx = i; });
        if (idx !== lastStop) { lastStop = idx; setStop(idx); }
      }
    };
    const frame = () => { run = false; cur += (tgt - cur) * (reduce ? 1 : 0.2); if (Math.abs(tgt - cur) < 0.0008) cur = tgt; apply(cur); if (cur !== tgt) kick(); };
    const kick = () => { if (!run) { run = true; raf = requestAnimationFrame(frame); } };
    const measure = () => { const h = document.documentElement; const max = Math.max(1, h.scrollHeight - window.innerHeight); tgt = Math.min(1, Math.max(0, window.scrollY / max)); kick(); };
    window.addEventListener('scroll', measure, { passive: true }); window.addEventListener('resize', measure);
    const iv = setInterval(measure, 900); measure();
    return () => { window.removeEventListener('scroll', measure); window.removeEventListener('resize', measure); clearInterval(iv); cancelAnimationFrame(raf); };
  }, [wantsScroll, view]);

  const save = (n) => { try { window.localStorage.setItem('akk-labsel', JSON.stringify(n)); } catch (e) {} };
  const replayWord = React.useCallback((tries) => {
    const el = document.querySelector('.ak-word');
    if (!el) { if ((tries || 0) < 1 && d && d.nav && d.nav[0]) { d.nav[0].go(); setTimeout(() => replayWord(1), 1300); } return; }
    try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) {}
    setTimeout(() => { el.classList.remove('io-in'); void el.offsetWidth; el.classList.add('io-in'); }, 700);
  }, [d]);
  const pick = (k, id) => {
    const n = Object.assign({}, sel, { [k]: id }); setSel(n); save(n);
    if (k === 'w') setTimeout(() => replayWord(0), 80);
    if (k === 'p' && id !== 'off' && view !== 'story' && d && d.items && d.items[0]) d.items[0].open();
    if (k === 's' && id !== 'off') window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const turnOff = () => { try { window.localStorage.removeItem('akk-lab'); window.localStorage.removeItem('akk-labsel'); } catch (e) {} setSel(DEF); setOn(false); };
  const summary = 'Scroll indicator: ' + label('p', sel.p) + ' | Word of the day: ' + label('w', sel.w) + ' | Sides: ' + label('s', sel.s);
  const copy = () => { try { navigator.clipboard.writeText(summary); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch (e) {} };

  if (!ready || !d) return <div className="ak-lab" />;

  const items = d.items || [];
  const cw = d.cw || 1240;
  const rw = Math.min(300, Math.floor((dim.w - cw) / 2 - 28));
  const rails = sel.s !== 'off' && rw >= 150;
  const storyP = view === 'story' && sel.p !== 'off';
  const needW = cw + 2 * (150 + 28);
  const lit = (i) => items[i] || items[0];
  const bn = items.filter((x) => x.cat === 'Bangladesh' || x.cat === 'Sport'), wd = items.filter((x) => x.cat !== 'Bangladesh' && x.cat !== 'Sport');
  const tl = bn.length >= 3 ? bn : items.filter((x, i) => i % 2 === 0), tr = wd.length >= 3 ? wd : items.filter((x, i) => i % 2 === 1);
  const dh = d.dhaka;
  const stops = view === 'home' ? HOME_STOPS.map((s, i) => ({ label: s[0], cur: i === stop, go: () => scrollToId(s[1]) })) : (d.nav || []).map((n) => ({ label: n.label, cur: n.cur, go: n.go }));

  const cut = (it, rot, delay) => it ? (<a key={it.id} className="pb-note pb-cut" href={it.href} onClick={it.open} style={{ '--rot': rot + 'deg', '--c': it.color, '--d': delay + 'ms' }}>
    <i className="pb-tape" aria-hidden="true" />
    <span className="pb-cat">{it.cat}</span>
    <span className="pb-ti">{it.title}</span>
    <span className="pb-go">Read in 60 sec</span>
  </a>) : null;
  const ticker = (list, side) => (<div className={'tk-col tk-' + side}>
    <p className="tk-h"><i aria-hidden="true" />{side === 'l' ? 'Just in' : 'Around the world'}</p>
    <div className="tk-win">
      <div className="tk-run" style={{ '--dur': Math.max(40, list.length * 11) + 's' }}>
        {[0, 1].map((rep) => (<ul key={rep} aria-hidden={rep ? 'true' : undefined}>
          {list.map((it, i) => (<li key={i}><a href={it.href} onClick={it.open} tabIndex={rep ? -1 : undefined} style={{ '--c': it.color }}><span>{it.cat}</span>{it.title}</a></li>))}
        </ul>))}
      </div>
    </div>
  </div>);

  return (<div className="ak-lab" ref={root} style={{ '--p': 0, '--sy': 0, '--cw': cw + 'px', '--rw': Math.max(0, rw) + 'px' }}>
    {/* Scroll indicators: story pages only */}
    {storyP && sel.p === 'weave' ? (<div className={'ak-ind ak-weave' + (show ? ' show' : '')} aria-hidden="true"><div className="wv-warp" /><div className="wv-cloth" /><i className="wv-shuttle" /></div>) : null}
    {storyP && sel.p === 'punch' ? (<div className={'ak-ind ak-punch' + (show ? ' show' : '')} aria-hidden="true"><div className="pn-ticket">
      <span className="pn-lab">Reading ticket</span>
      <span className="pn-holes">{Array.from({ length: 10 }, (x, i) => (<i key={i} className={'pn-h' + (i < step ? ' on' : '')}><b /></i>))}</span>
      <span className="pn-n">{step}/10</span>
    </div></div>) : null}
    {storyP && sel.p === 'chai' ? (<div className={'ak-ind ak-chai' + (show ? ' show' : '') + (step >= 10 ? ' full' : '')} aria-hidden="true">
      <svg viewBox="0 0 64 92" width="64" height="92">
        <defs><clipPath id="ch-in"><path d="M12 22 H48 L44 74 Q44 78 40 78 H20 Q16 78 16 74 Z" /></clipPath></defs>
        <g className="ch-steam"><path d="M22 16 q-5 -6 0 -11 t0 -11" /><path d="M30 16 q-5 -6 0 -11 t0 -11" /><path d="M38 16 q-5 -6 0 -11 t0 -11" /></g>
        <g clipPath="url(#ch-in)"><g className="ch-liq"><rect x="0" y="22" width="64" height="70" fill="#B5651D" /><rect x="0" y="22" width="64" height="9" fill="#E3B27A" /><path className="ch-wave" d="M-30 24 q8 -5 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 V34 H-30 Z" fill="#E3B27A" /></g></g>
        <path d="M12 22 H48 L44 74 Q44 78 40 78 H20 Q16 78 16 74 Z" fill="none" strokeWidth="2.6" strokeLinejoin="round" style={{ stroke: 'var(--ink)' }} />
        <path d="M48 30 q10 0 9 11 q-1 9 -9 9" fill="none" strokeWidth="2.6" strokeLinecap="round" style={{ stroke: 'var(--ink)' }} />
        <ellipse cx="30" cy="82" rx="22" ry="4.5" fill="#D21F14" style={{ stroke: 'var(--ink)' }} strokeWidth="2.2" />
      </svg>
    </div>) : null}
    {storyP && sel.p === 'vine' ? (<div className={'ak-ind ak-vine' + (show ? ' show' : '')} aria-hidden="true">
      <svg viewBox="0 0 40 600" preserveAspectRatio="xMidYMin meet">
        <path className="vn-stem" pathLength="1" d="M20 0 C 38 40, 2 80, 20 120 S 38 200, 20 240 S 2 320, 20 360 S 38 440, 20 480 S 2 560, 20 600" fill="none" strokeWidth="3.4" strokeLinecap="round" />
        <Leaf cx={28} cy={60} rot={70} t={0.09} /><Leaf cx={12} cy={100} rot={-70} t={0.16} />
        <Leaf cx={28} cy={200} rot={70} t={0.32} /><Leaf cx={12} cy={260} rot={-70} t={0.43} />
        <Leaf cx={28} cy={400} rot={70} t={0.66} /><Leaf cx={12} cy={460} rot={-70} t={0.76} />
        <Bloom cx={20} cy={150} t={0.22} c1="#D21F14" c2="#FFD400" /><Bloom cx={20} cy={310} t={0.5} c1="#2F5BEA" c2="#FFD400" />
        <Bloom cx={20} cy={430} t={0.7} c1="#FFD400" c2="#D21F14" /><Bloom cx={20} cy={580} t={0.96} c1="#D21F14" c2="#FFFFFF" />
      </svg>
    </div>) : null}

    {/* Wide-screen sides */}
    {rails && sel.s === 'route' ? (<>
      <aside className="ak-rail ak-rail-l" aria-label="Page stops"><div className="rt">
        <p className="rt-h">You are here</p>
        <div className="rt-track"><i className="rt-line" /><i className="rt-fill" /><span className="rt-bus"><Rickshaw /></span>
          <ol>{stops.map((s, i) => (<li key={i} className={s.cur ? 'cur' : ''}><button type="button" onClick={s.go} aria-current={s.cur ? 'page' : undefined}><i aria-hidden="true" /><span>{s.label}</span></button></li>))}</ol>
        </div>
      </div></aside>
      <aside className="ak-rail ak-rail-r" aria-label="Dhaka now"><div className="rt-sign">
        <p className="rt-sh" lang="bn">ঢাকা</p>
        {dh ? (<><p className="rt-t">{dh.temp}<small>°C</small></p><p className="rt-s">{dh.sky}</p>{dh.aqi != null ? (<p className="rt-a"><i style={{ background: dh.aqiColor }} aria-hidden="true" />{'AQI ' + dh.aqi + ' · ' + dh.aqiName}</p>) : null}</>) : <p className="rt-s">Weather is on its way.</p>}
        <p className="rt-n">Dhaka only. Updated through the day.</p>
      </div></aside>
    </>) : null}

    {rails && sel.s === 'sky' ? (<>
      <aside className="ak-rail ak-rail-l ak-sky" aria-hidden="true">
        <i className="sk-star" style={{ left: '20%', top: '8%' }} /><i className="sk-star" style={{ left: '70%', top: '20%', animationDelay: '-1.4s' }} /><i className="sk-star" style={{ left: '40%', top: '46%', animationDelay: '-.7s' }} />
        <div className="sk-l" style={{ '--k': 0.03 }}><Cloud style={{ left: '8%', top: '12%', animationDelay: '-3s' }} /><Cloud style={{ left: '30%', top: '58%', width: 90 }} /></div>
        <div className="sk-l" style={{ '--k': 0.07 }}>
          <Kite a={KITES[0][0]} b={KITES[0][1]} style={{ left: '12%', top: '9%', width: 74, animationDelay: '-1s' }} />
          <Kite a={KITES[1][0]} b={KITES[1][1]} style={{ left: '56%', top: '44%', width: 56, animationDelay: '-4s' }} cls="sm" />
        </div>
        <Bird style={{ top: '30%', animationDelay: '-6s' }} /><Bird style={{ top: '72%', animationDelay: '-12s' }} />
      </aside>
      <aside className="ak-rail ak-rail-r ak-sky" aria-hidden="true">
        <i className="sk-star" style={{ left: '60%', top: '12%' }} /><i className="sk-star" style={{ left: '25%', top: '30%', animationDelay: '-1s' }} /><i className="sk-star" style={{ left: '78%', top: '52%', animationDelay: '-2s' }} />
        <div className="sk-l" style={{ '--k': 0.03 }}><Cloud style={{ left: '40%', top: '6%', animationDelay: '-8s', width: 100 }} /><Cloud style={{ left: '6%', top: '50%', animationDelay: '-5s' }} /></div>
        <div className="sk-l" style={{ '--k': 0.06 }}>
          <Kite a={KITES[2][0]} b={KITES[2][1]} style={{ left: '40%', top: '16%', width: 70, animationDelay: '-2.5s' }} />
          <Kite a={KITES[0][1]} b={KITES[0][0]} style={{ left: '10%', top: '56%', width: 54, animationDelay: '-5.5s' }} cls="sm" />
        </div>
        <Bird style={{ top: '24%', animationDelay: '-3s' }} /><Bird style={{ top: '64%', animationDelay: '-9s' }} />
      </aside>
    </>) : null}

    {rails && sel.s === 'pin' ? (<>
      <aside className="ak-rail ak-rail-l lb-pinrail" aria-label="Pinned notes"><div className="pb">
        {cut(lit(0), -2.2, 0)}
        {dh ? (<div className="pb-note pb-sticky" style={{ '--rot': '2deg', '--d': '120ms' }}><i className="pb-tape" aria-hidden="true" />
          <span className="pb-cat" lang="bn">ঢাকা এখন</span><span className="pb-big">{dh.temp}°C <small>{dh.sky}</small></span>
          {dh.aqi != null ? <span className="pb-aq"><i style={{ background: dh.aqiColor }} aria-hidden="true" />{'AQI ' + dh.aqi + ', ' + dh.aqiName}</span> : null}</div>) : null}
        {cut(lit(1), 1.6, 240)}
      </div></aside>
      <aside className="ak-rail ak-rail-r lb-pinrail" aria-label="Pinned notes"><div className="pb">
        {d.wotd ? (<div className="pb-note pb-word" style={{ '--rot': '1.8deg', '--d': '80ms' }}><i className="pb-tape" aria-hidden="true" />
          <span className="pb-cat">Word of the day</span><span className="pb-big">{d.wotd.term}</span><span className="pb-mean">{d.wotd.meaning}</span></div>) : null}
        {cut(lit(2), -1.8, 200)}
        <button type="button" className="pb-note pb-quiz" style={{ '--rot': '-2.4deg', '--d': '320ms' }} onClick={() => (view === 'home' ? scrollToId('play-h') : d.nav[0].go())}><i className="pb-tape" aria-hidden="true" />
          <span className="pb-cat">Play & learn</span><span className="pb-ti">Eight quick questions on today&rsquo;s news</span><span className="pb-go">Try the quiz</span></button>
      </div></aside>
    </>) : null}

    {rails && sel.s === 'ticker' ? (<>
      <aside className="ak-rail ak-rail-l ak-tk" aria-label="Latest headlines">{ticker(tl, 'l')}</aside>
      <aside className="ak-rail ak-rail-r ak-tk" aria-label="More headlines">{ticker(tr, 'r')}</aside>
    </>) : null}

    {/* The lab panel */}
    {on ? (<div className={'lb' + (open ? ' open' : ' min')}>
      {open ? (<div className="lb-panel" role="group" aria-label="Design lab">
        <div className="lb-top"><b>Design lab</b><button type="button" className="lb-x" onClick={() => setOpen(false)} aria-label="Close the lab panel">Close</button></div>
        <fieldset className="lb-g"><legend>Scroll indicator</legend>
          <p>Shows on story pages. Picking one opens a story. Scroll to watch it.</p>
          <div className="lb-chips" role="radiogroup" aria-label="Scroll indicator">{OPTS.p.map((o) => (<button key={o[0]} type="button" role="radio" aria-checked={sel.p === o[0]} className={'lb-chip' + (sel.p === o[0] ? ' on' : '')} onClick={() => pick('p', o[0])}>{o[1]}</button>))}</div>
        </fieldset>
        <fieldset className="lb-g"><legend>Word of the day</legend>
          <p>Picking one scrolls to the word and plays it.</p>
          <div className="lb-chips" role="radiogroup" aria-label="Word of the day">{OPTS.w.map((o) => (<button key={o[0]} type="button" role="radio" aria-checked={sel.w === o[0]} className={'lb-chip' + (sel.w === o[0] ? ' on' : '')} onClick={() => pick('w', o[0])}>{o[1]}</button>))}</div>
          <button type="button" className="lb-link" onClick={() => replayWord(0)}>Play it again</button>
        </fieldset>
        <fieldset className="lb-g"><legend>Left and right sides</legend>
          <p>{rails ? 'Your window fits them (' + dim.w + ' px wide).' : 'Your window is ' + dim.w + ' px wide. On this page they need about ' + needW + ' px, so widen the window or zoom out (Ctrl and minus). Story pages need less.'}</p>
          <div className="lb-chips" role="radiogroup" aria-label="Left and right sides">{OPTS.s.map((o) => (<button key={o[0]} type="button" role="radio" aria-checked={sel.s === o[0]} className={'lb-chip' + (sel.s === o[0] ? ' on' : '')} onClick={() => pick('s', o[0])}>{o[1]}</button>))}</div>
        </fieldset>
        <div className="lb-foot"><div className="lb-sum"><span>{summary}</span><button type="button" className="lb-link" onClick={copy}>{copied ? 'Copied' : 'Copy my picks'}</button></div>
          <button type="button" className="lb-link lb-off" onClick={turnOff}>Turn the lab off</button></div>
      </div>) : (<button type="button" className="lb-open" onClick={() => setOpen(true)}>Design lab</button>)}
    </div>) : null}
  </div>);
}
