// The whole page layout. `v` holds the values and handlers from Site.jsx (renderVals).
import React from 'react';
import { css } from '../lib/css';
import Extras from './Extras';


// A taxi-meter style number: each digit is a column of 0-9 that rolls to its value when the block scrolls into view.
function Odo({ pre, value, post }) {
  return (<span className={"ak-odo"} role={"img"} aria-label={(pre || '') + value + (post || '')}>
    {pre ? <span aria-hidden={"true"}>{pre}</span> : null}
    {String(value).split('').map((ch, k) => /\d/.test(ch)
      ? <span key={k} className={"ak-dg"} aria-hidden={"true"}><span className={"ak-dr"} style={{ '--n': ch, '--i': k }}>{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => <i key={d}>{d}</i>)}</span></span>
      : <span key={k} aria-hidden={"true"}>{ch}</span>)}
    {post ? <span aria-hidden={"true"}>{post}</span> : null}
  </span>);
}

// The word of the day: a signboard painter brushes it in from left to right.
// Pictures blended into the four "Explore by topic" cards. Each is a flat, low-contrast layer behind the text.
function TopicArt({ name }) {
  const W = 'rgba(255,255,255,'; const K = 'rgba(26,23,20,';
  let g = null;
  if (name === 'Bangladesh') {
    g = (<g>
      <path d="M146 4 V200" stroke={W + '.55)'} strokeWidth="4" strokeLinecap="round" />
      <circle cx="146" cy="6" r="5" fill={W + '.7)'} />
      <g transform="rotate(-5 150 60)">
        <path d="M150 18 C184 6 214 32 250 18 S292 10 306 16 V108 C292 102 276 114 250 108 C214 94 184 118 150 110 Z" fill="#006A4E" stroke={W + '.55)'} strokeWidth="2.5" strokeLinejoin="round" />
        <ellipse cx="226" cy="63" rx="29" ry="30" fill="#E8261A" />
        <path d="M150 18 C184 6 214 32 250 18 S292 10 306 16 V40 C284 34 270 42 250 40 C214 30 184 44 150 40 Z" fill={W + '.1)'} />
      </g>
      <circle cx="40" cy="40" r="46" fill={W + '.07)'} />
    </g>);
  } else if (name === 'World') {
    g = (<g>
      <g fill="none" stroke={W + '.2)'} strokeWidth="1.5">
        <ellipse cx="170" cy="90" rx="146" ry="70" /><ellipse cx="170" cy="90" rx="90" ry="70" /><ellipse cx="170" cy="90" rx="36" ry="70" />
        <path d="M24 90 H316 M40 56 H300 M40 124 H300" />
      </g>
      <g fill={W + '.34)'}>
        <path d="M30 50 L70 38 L105 44 L112 62 L98 80 L84 92 L72 84 L52 76 L36 62 Z" /><path d="M118 28 L142 26 L138 44 L122 46 Z" />
        <path d="M88 100 L112 98 L124 116 L112 150 L100 166 L92 140 Z" /><path d="M150 48 L176 40 L188 54 L172 68 L152 64 Z" />
        <path d="M152 72 L186 70 L202 96 L188 130 L170 144 L158 112 Z" /><path d="M190 44 L262 34 L300 56 L284 84 L252 92 L232 106 L214 86 L196 70 Z" />
        <path d="M262 120 L292 118 L298 138 L270 146 Z" />
      </g>
      <path d="M100 66 Q160 8 232 62" fill="none" stroke={W + '.8)'} strokeWidth="2.5" strokeDasharray="1 7" strokeLinecap="round" />
      <circle cx="100" cy="66" r="5" fill="#FFD400" /><circle cx="232" cy="62" r="5" fill="#FFD400" />
    </g>);
  } else if (name === 'Tech') {
    g = (<g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <g stroke={W + '.4)'} strokeWidth="2.5">
        <path d="M210 76 H150 L130 56 H86 M210 94 H168 L150 112 H70 M236 112 V150 H190 L176 164 H120 M262 112 V176 M290 94 H316" />
      </g>
      <g fill={W + '.5)'}><circle cx="86" cy="56" r="4" /><circle cx="70" cy="112" r="4" /><circle cx="120" cy="164" r="4" /><circle cx="262" cy="176" r="4" /></g>
      <rect x="208" y="40" width="82" height="76" rx="12" fill={W + '.16)'} stroke={W + '.55)'} strokeWidth="3" />
      <rect x="226" y="58" width="46" height="40" rx="6" fill={W + '.18)'} stroke={W + '.5)'} strokeWidth="2.5" />
      <path d="M222 36 V24 M238 36 V24 M254 36 V24 M270 36 V24 M286 36 V28 M222 120 V132 M238 120 V132 M254 120 V132 M270 120 V132" stroke={W + '.5)'} strokeWidth="3" />
      <path d="M241 74 L233 78 L241 82 M257 74 L265 78 L257 82" stroke={W + '.85)'} strokeWidth="3" />
      <path d="M40 30 q22 -18 44 0 M50 40 q12 -10 24 0" stroke={W + '.5)'} strokeWidth="3" /><circle cx="62" cy="50" r="3.5" fill={W + '.6)'} stroke="none" />
    </g>);
  } else {
    g = (<g strokeLinecap="round" strokeLinejoin="round">
      <g transform="rotate(32 120 90)"><rect x="106" y="8" width="26" height="86" rx="10" fill={K + '.14)'} stroke={K + '.5)'} strokeWidth="3" /><rect x="114" y="92" width="10" height="64" rx="4" fill={K + '.14)'} stroke={K + '.5)'} strokeWidth="3" /><path d="M110 30 h18 M110 44 h18 M110 58 h18" stroke={K + '.3)'} strokeWidth="2" /></g>
      <circle cx="248" cy="62" r="38" fill={W + '.3)'} stroke={K + '.5)'} strokeWidth="3" />
      <path d="M222 36 Q248 62 222 88 M274 36 Q248 62 274 88" fill="none" stroke={K + '.55)'} strokeWidth="3" strokeDasharray="1 6" />
      <circle cx="196" cy="140" r="28" fill={W + '.32)'} stroke={K + '.5)'} strokeWidth="3" />
      <path d="M196 128 l11 8 -4 13 h-14 l-4 -13 z" fill={K + '.45)'} />
      <g fill="none" stroke={K + '.45)'} strokeWidth="3"><path d="M278 140 V186 M292 140 V186 M306 140 V186" /><path d="M274 140 H298 M288 140 H312" /></g>
      <path d="M40 120 l6 12 13 2 -10 9 3 13 -12 -7 -12 7 3 -13 -10 -9 13 -2 z" fill={W + '.45)'} />
    </g>);
  }
  return (<svg className="fz-art" viewBox="0 0 320 200" preserveAspectRatio="xMaxYMid meet" aria-hidden="true" focusable="false">{g}</svg>);
}

function Flap({ word }) {
  return (<span className={"ak-flap"}>{word}</span>);
}

const Ico = {
  find: <svg viewBox={"0 0 24 24"} width={"22"} height={"22"} aria-hidden={"true"}><circle cx={"10.5"} cy={"10.5"} r={"6.5"} fill={"none"} strokeWidth={"2.4"} style={css("stroke:var(--ink)")} /><path d={"M15.5 15.5L21 21"} strokeWidth={"2.6"} strokeLinecap={"round"} style={css("stroke:var(--ink)")} /></svg>,
  listen: <svg viewBox={"0 0 24 24"} width={"20"} height={"20"} aria-hidden={"true"} className={"ak-eq"}><rect x={"3"} y={"4"} width={"3.4"} height={"16"} rx={"1.7"} /><rect x={"8.5"} y={"4"} width={"3.4"} height={"16"} rx={"1.7"} /><rect x={"14"} y={"4"} width={"3.4"} height={"16"} rx={"1.7"} /><rect x={"19.5"} y={"4"} width={"3.4"} height={"16"} rx={"1.7"} /></svg>,
  simple: <svg viewBox={"0 0 24 24"} width={"20"} height={"20"} aria-hidden={"true"}><path d={"M4 6h16M4 12h10M4 18h6"} fill={"none"} strokeWidth={"2.4"} strokeLinecap={"round"} style={css("stroke:currentColor")} /></svg>,
  kite: <svg viewBox={"0 0 24 28"} width={"20"} height={"24"} aria-hidden={"true"} className={"ak-kite"}><path className={"ak-kite-b"} d={"M12 1l9 9-9 12-9-12z"} strokeWidth={"2.2"} strokeLinejoin={"round"} /><path className={"ak-kite-t"} d={"M12 22q-3 2-1 4t-1 2"} fill={"none"} strokeWidth={"2"} strokeLinecap={"round"} /></svg>,
  wa: <svg viewBox={"0 0 24 24"} width={"20"} height={"20"} aria-hidden={"true"}><path d={"M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3z"} fill={"#25A244"} /><path d={"M8.8 8.4c.3 3.2 3.3 6 6.6 6.4l1.2-1.4-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2z"} fill={"#FFFFFF"} /></svg>,
  ms: <svg viewBox={"0 0 24 24"} width={"20"} height={"20"} aria-hidden={"true"}><path d={"M12 2.5c-5.2 0-9.5 3.9-9.5 8.9 0 2.6 1.200 4.900 3.100 6.500V21l3.200-1.800c1 .3 2 .4 3.200.4 5.200 0 9.500-3.900 9.500-8.900S17.200 2.500 12 2.500z"} fill={"#2F7BF5"} /><path d={"M6.500 13.500l3.400-3.600 2.500 2.100 3.100-2.100-3.400 3.700-2.500-2.100z"} fill={"#FFFFFF"} /></svg>,
  copy: <svg viewBox={"0 0 24 24"} width={"20"} height={"20"} aria-hidden={"true"}><rect x={"8"} y={"8"} width={"12"} height={"12"} rx={"2.5"} fill={"none"} strokeWidth={"2.2"} style={css("stroke:currentColor")} /><path d={"M16 8V6.500A2.500 2.500 0 0 0 13.500 4h-7A2.500 2.500 0 0 0 4 6.500v7A2.500 2.500 0 0 0 6.500 16H8"} fill={"none"} strokeWidth={"2.2"} style={css("stroke:currentColor")} /></svg>,
  flag: <svg viewBox={"0 0 24 24"} width={"18"} height={"18"} aria-hidden={"true"}><path d={"M5 21V4m0 1h12l-2.500 4L17 13H5"} fill={"none"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} style={css("stroke:currentColor")} /></svg>,
  bell: <svg viewBox={"0 0 24 24"} width={"20"} height={"20"} aria-hidden={"true"} className={"ak-bell"}><path d={"M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6z"} fill={"currentColor"} /><path d={"M9.500 19a2.500 2.500 0 0 0 5 0"} fill={"none"} strokeWidth={"2"} strokeLinecap={"round"} style={css("stroke:currentColor")} /></svg>,
};

// The top of a story page. Used twice (for even and odd stories) so the highlight and image replay when you move to the next story.
function storyHead(v) {
  const st = v.st, text = st.leadText || '';
  const m = /^(.+?[.!?])(\s+|$)/.exec(text), first = m ? m[1] : text, rest = text.slice(first.length);
  return (<div className={"pg-in"}>
    <img className={"fz-hero"} src={v.heroImg} alt={v.heroAlt} width={"400"} height={"260"} />
    <p style={css("margin:0 0 12px")}>
      <span style={css(`display:inline-block;background:${v.s.color};color:#FFFFFF;font-weight:700;font-size:15px;border-radius:999px;padding:4px 12px`)}>
        {v.s.cat}
      </span>
    </p>
    <h1 className={"pg-h1 pg-disp"} style={css("font-weight:800;font-size:84px;line-height:.95;margin:0 0 14px")}>
      {v.s.title}
    </h1>
    <p style={css("margin:0 0 10px;font-size:17px;color:var(--muted)")}>
      {st.updated}
    </p>
    <p className={"ak-ai"}>
      {st.isAI ? <span className={"ak-aichip"}>{"AI-written"}</span> : null}
      <span>{st.aiNote}</span>
    </p>
    <p key={st.simpleOn ? 's' : 'o'} className={"fz-lead ak-lead" + (st.busy ? " ak-busy" : "") + (st.simpleOn ? " ak-focus" : "")} aria-live={"polite"}>
      {st.simpleOn ? text : (<><span className={"ak-mark"}>{first}</span>{rest}</>)}
    </p>
    {st.err ? <p role={"alert"} className={"ak-err"}>{"The simpler version is not ready right now. Try again in a minute."}</p> : null}
    <div className={"ak-acts"} role={"group"} aria-label={"Story actions"}>
      {st.canSpeak ? (<button type={"button"} className={"ak-act" + (st.speaking ? " on" : "")} onClick={st.listen} aria-pressed={st.speaking ? "true" : "false"}>{Ico.listen}<span>{st.speaking ? "Stop" : "Listen"}</span></button>) : null}
      {st.canSimple ? (<button type={"button"} className={"ak-act" + (st.simpleOn ? " on" : "")} onClick={st.simple} aria-busy={st.busy ? "true" : "false"} aria-pressed={st.simpleOn ? "true" : "false"}>{Ico.simple}<span>{st.simpleLabel}{st.busy ? <i className={"ak-dots"} aria-hidden={"true"}><b /><b /><b /></i> : null}</span></button>) : null}
      <button type={"button"} className={"ak-act ak-save" + (st.saved ? " on" : "")} onClick={st.save} aria-pressed={st.saved ? "true" : "false"}>{Ico.kite}<span>{st.saved ? "Saved" : "Save for later"}</span></button>
    </div>
    <div className={"ak-acts ak-share"} role={"group"} aria-label={"Share this story"}>
      <span className={"ak-sharelab"}>{"Share"}</span>
      <button type={"button"} className={"ak-act"} onClick={st.wa}>{Ico.wa}<span>{"WhatsApp"}</span></button>
      <button type={"button"} className={"ak-act"} onClick={st.ms}>{Ico.ms}<span>{"Messenger"}</span></button>
      <button type={"button"} className={"ak-act"} onClick={st.copy}>{Ico.copy}<span>{"Copy link"}</span></button>
      <button type={"button"} className={"ak-act ak-flag"} onClick={st.report}>{Ico.flag}<span>{"Report a mistake"}</span></button>
    </div>
  </div>);
}

export default function view(v) {
  return (<>
    <div className={v.rootClass} data-theme={v.theme} style={css("position:relative;overflow:hidden;font-family:'Anek Bangla',system-ui,sans-serif;color:var(--ink);background:var(--bg);min-height:100vh;transition:background-color 300ms ease,color 300ms ease")}>
      {v.trLiveA ? (<>
        <div className={"tr-layer"} aria-hidden={"true"}>
          <div className={"fz-kswoop"}>
            <svg viewBox={"-90 0 210 300"} width={"120"} height={"170"} style={css("overflow:visible")}>
              <path d={"M60 104 C 20 150, -30 180, -90 260"} fill={"none"} strokeWidth={"2"} strokeDasharray={"2 6"} style={css("stroke:var(--ink)")} opacity={".5"} />
              <path d={"M60 0 L104 46 L60 104 L16 46 Z"} fill={"#D21F14"} />
              <path d={"M60 0 L104 46 L60 46 Z"} fill={"#FFD400"} />
              <path d={"M16 46 L60 104 L60 46 Z"} fill={"#FFD400"} />
              <path d={"M60 104 q -12 18 -4 36 t -8 36"} fill={"none"} strokeWidth={"3.5"} style={css("stroke:#D21F14")} />
            </svg>
          </div>
        </div>
      </>) : null}
      {v.trLiveB ? (<>
        <div className={"tr-layer"} aria-hidden={"true"}>
          <div className={"fz-kswoop"}>
            <svg viewBox={"-90 0 210 300"} width={"120"} height={"170"} style={css("overflow:visible")}>
              <path d={"M60 104 C 20 150, -30 180, -90 260"} fill={"none"} strokeWidth={"2"} strokeDasharray={"2 6"} style={css("stroke:var(--ink)")} opacity={".5"} />
              <path d={"M60 0 L104 46 L60 104 L16 46 Z"} fill={"#D21F14"} />
              <path d={"M60 0 L104 46 L60 46 Z"} fill={"#FFD400"} />
              <path d={"M16 46 L60 104 L60 46 Z"} fill={"#FFD400"} />
              <path d={"M60 104 q -12 18 -4 36 t -8 36"} fill={"none"} strokeWidth={"3.5"} style={css("stroke:#D21F14")} />
            </svg>
          </div>
        </div>
      </>) : null}
      <div className={"fz-shell"} style={css("position:relative;z-index:1")}>
        <header style={css("max-width:1240px;margin:0 auto;padding:22px 32px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap")}>
          <a href={"/"} onClick={v.goHome} aria-label={"AJKER খবর KI? home"} style={css("text-decoration:none;display:inline-flex;align-items:center;background:#D21F14;border-radius:4px;padding:4px 14px 0")}>
            <span className={"np3-disp"} style={css("font-weight:800;font-size:32px;line-height:1.25;color:#FFFFFF")}>
              {"AJKER "}
              <span lang={"bn"} style={css("color:#FFD400")}>
                {"খবর"}
              </span>
              {" KI?"}
            </span>
          </a>
          <nav aria-label={"Main"} style={css("display:flex;gap:22px;align-items:center;flex-wrap:wrap")}>
            {(v.navItems || []).map((n, nI) => (<React.Fragment key={nI}>
              <button type={"button"} className={"fz-nav"} onClick={n.go} aria-current={n.cur} style={css(`text-decoration-line:${n.line}`)}>
                {n.label}
              </button>
            </React.Fragment>))}
          </nav>
          <div style={css("display:flex;gap:12px;align-items:center;flex-wrap:wrap")}>
            <button type={"button"} className={"np3-btn ak-findbtn"} onClick={v.togglePanel} aria-expanded={v.panel.open ? "true" : "false"} aria-label={v.panelBtnLabel} style={css("width:46px;height:46px;border-radius:12px;border:2px solid var(--line);background:var(--panel);color:var(--ink);cursor:pointer;display:flex;align-items:center;justify-content:center;position:relative")}>
              {Ico.find}
              {v.savedN > 0 ? <span className={"ak-pip"} aria-hidden={"true"}>{v.savedN}</span> : null}
            </button>
            <button type={"button"} className={"np3-btn"} onClick={v.toggleTheme} aria-label={v.themeLabel} style={css("width:46px;height:46px;border-radius:12px;border:2px solid var(--line);background:var(--panel);color:var(--ink);cursor:pointer;display:flex;align-items:center;justify-content:center")}>
              {v.isDark ? (<>
                <svg viewBox={"0 0 24 24"} width={"22"} height={"22"} aria-hidden={"true"}>
                  <circle cx={"12"} cy={"12"} r={"4.5"} fill={"#FFD400"} />
                  <path d={"M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"} stroke={"#FFD400"} strokeWidth={"2"} strokeLinecap={"round"} />
                </svg>
              </>) : null}
              {v.isLight ? (<>
                <svg viewBox={"0 0 24 24"} width={"22"} height={"22"} aria-hidden={"true"}>
                  <path d={"M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"} fill={"#1A1714"} />
                </svg>
              </>) : null}
            </button>
            <a href={"#join"} onClick={v.goJoin} className={"np3-btn"} style={css("font-weight:700;font-size:17px;padding:10px 18px;border-radius:12px;background:var(--ink);color:var(--bg);text-decoration:none")}>
              {"Join the waitlist"}
            </a>
          </div>
        </header>
        {v.panel.open ? (<div className={"ak-panel"}>
          <div className={"ak-panel-in"} role={"search"}>
            <div className={"ak-ptabs"}>
              <button type={"button"} className={"ak-ptab" + (v.panel.find ? " on" : "")} onClick={v.panel.findTab} aria-pressed={v.panel.find ? "true" : "false"}>{"Search"}</button>
              <button type={"button"} className={"ak-ptab" + (v.panel.savedOn ? " on" : "")} onClick={v.panel.savedTab} aria-pressed={v.panel.savedOn ? "true" : "false"}>{"Saved (" + v.panel.savedN + ")"}</button>
              <button type={"button"} className={"ak-pclose"} onClick={v.panel.close} aria-label={"Close"}>{"×"}</button>
            </div>
            {v.panel.find ? (<>
              <input className={"ak-pin"} autoFocus type={"search"} value={v.panel.q} onChange={v.panel.onQ} placeholder={"Search today's stories: cricket, dollar, AI"} aria-label={"Search stories"} />
              {v.panel.idle ? <p className={"ak-pmsg"}>{"Type a word. We search the stories on the site right now."}</p> : null}
              {v.panel.noResults ? <p className={"ak-pmsg"}>{"Nothing on the site matches that right now. Try a shorter word."}</p> : null}
              <ul className={"ak-plist"}>
                {(v.panel.results || []).map((r, rI) => (<li key={rI} className={"ak-res"} style={{ '--i': rI }}>
                  <a className={"ak-resa"} href={r.href} onClick={r.open}>
                    <span className={"ak-dot"} style={{ background: r.color }} aria-hidden={"true"} />
                    <span className={"ak-rest"}><b>{r.title}</b><small>{r.sub}</small></span>
                  </a>
                  <button type={"button"} className={"ak-act ak-save ak-mini" + (r.saved ? " on" : "")} onClick={r.toggle} aria-pressed={r.saved ? "true" : "false"} aria-label={r.saved ? "Remove from saved" : "Save for later"}>{Ico.kite}</button>
                </li>))}
              </ul>
            </>) : null}
            {v.panel.savedOn ? (<>
              {v.panel.noSaved ? <p className={"ak-pmsg"}>{"Nothing saved yet. Tap Save for later on a story. Saved stories stay on this device only."}</p> : null}
              <ul className={"ak-plist"}>
                {(v.panel.savedRows || []).map((r, rI) => (<li key={rI} className={"ak-res"} style={{ '--i': rI }}>
                  <a className={"ak-resa"} href={r.href} onClick={r.open} target={r.ext ? "_blank" : undefined} rel={r.ext ? "noopener noreferrer" : undefined}>
                    <span className={"ak-dot"} style={{ background: r.color }} aria-hidden={"true"} />
                    <span className={"ak-rest"}><b>{r.title}</b><small>{r.sub}</small></span>
                  </a>
                  <button type={"button"} className={"ak-act ak-save ak-mini on"} onClick={r.toggle} aria-pressed={"true"} aria-label={"Remove from saved"}>{Ico.kite}</button>
                </li>))}
              </ul>
            </>) : null}
          </div>
        </div>) : null}
        <main id={"top"}>
          <div className={"fz-strip"} aria-hidden={"true"}>
            <div className={"fz-flock fz-flock1"}>
              <div className={"fz-flock-in"}>
                <svg className={"fz-bird"} viewBox={"0 0 26 12"} width={"26"} height={"11"} style={css("left:118px;top:22px;animation-delay:-0.00s")}>
                  <path d={"M1 9 Q7 1 13 8 Q19 1 25 9"} fill={"none"} strokeWidth={"2.2"} strokeLinecap={"round"} style={css("stroke:var(--ink)")} />
                </svg>
                <svg className={"fz-bird"} viewBox={"0 0 26 12"} width={"22"} height={"10"} style={css("left:96px;top:10px;animation-delay:-0.15s")}>
                  <path d={"M1 9 Q7 1 13 8 Q19 1 25 9"} fill={"none"} strokeWidth={"2.2"} strokeLinecap={"round"} style={css("stroke:var(--ink)")} />
                </svg>
                <svg className={"fz-bird"} viewBox={"0 0 26 12"} width={"22"} height={"10"} style={css("left:96px;top:36px;animation-delay:-0.30s")}>
                  <path d={"M1 9 Q7 1 13 8 Q19 1 25 9"} fill={"none"} strokeWidth={"2.2"} strokeLinecap={"round"} style={css("stroke:var(--ink)")} />
                </svg>
                <svg className={"fz-bird"} viewBox={"0 0 26 12"} width={"20"} height={"9"} style={css("left:74px;top:0px;animation-delay:-0.10s")}>
                  <path d={"M1 9 Q7 1 13 8 Q19 1 25 9"} fill={"none"} strokeWidth={"2.2"} strokeLinecap={"round"} style={css("stroke:var(--ink)")} />
                </svg>
                <svg className={"fz-bird"} viewBox={"0 0 26 12"} width={"20"} height={"9"} style={css("left:74px;top:46px;animation-delay:-0.25s")}>
                  <path d={"M1 9 Q7 1 13 8 Q19 1 25 9"} fill={"none"} strokeWidth={"2.2"} strokeLinecap={"round"} style={css("stroke:var(--ink)")} />
                </svg>
              </div>
            </div>
            <div className={"fz-flock fz-flock2"}>
              <div className={"fz-flock-in"}>
                <svg className={"fz-bird"} viewBox={"0 0 26 12"} width={"18"} height={"8"} style={css("left:60px;top:14px;animation-delay:-0.20s")}>
                  <path d={"M1 9 Q7 1 13 8 Q19 1 25 9"} fill={"none"} strokeWidth={"2.2"} strokeLinecap={"round"} style={css("stroke:var(--ink)")} />
                </svg>
                <svg className={"fz-bird"} viewBox={"0 0 26 12"} width={"15"} height={"6"} style={css("left:42px;top:4px;animation-delay:-0.00s")}>
                  <path d={"M1 9 Q7 1 13 8 Q19 1 25 9"} fill={"none"} strokeWidth={"2.2"} strokeLinecap={"round"} style={css("stroke:var(--ink)")} />
                </svg>
                <svg className={"fz-bird"} viewBox={"0 0 26 12"} width={"15"} height={"6"} style={css("left:42px;top:26px;animation-delay:-0.30s")}>
                  <path d={"M1 9 Q7 1 13 8 Q19 1 25 9"} fill={"none"} strokeWidth={"2.2"} strokeLinecap={"round"} style={css("stroke:var(--ink)")} />
                </svg>
              </div>
            </div>
            <svg viewBox={"0 0 1440 110"} preserveAspectRatio={"none"} style={css("position:absolute;inset:0;width:100%;height:100%")}>
              <path d={"M0 26 Q720 92 1440 34"} fill={"none"} strokeWidth={"2"} style={css("stroke:var(--ink)")} opacity={".35"} />
              <path d={"M0 38 Q620 106 1440 30"} fill={"none"} strokeWidth={"1.5"} style={css("stroke:var(--ink)")} opacity={".22"} />
              <path d={"M0 40 Q820 82 1440 42"} fill={"none"} strokeWidth={"1.5"} style={css("stroke:var(--ink)")} opacity={".2"} />
            </svg>
            <div style={css("position:absolute;left:14.0%;top:16px;transform:scaleX(-1);opacity:.7")}>
              <svg className={"np3-crow"} viewBox={"0 0 34 26"} width={"34"} height={"26"} style={css("animation-delay:-0s")}>
                <path d={"M4 16 Q8 8 18 8 Q22 3 27 5 L33 7 L28 9 Q27 14 22 17 L14 19 L9 25 L9 19 Q5 19 4 16 Z"} style={css("fill:var(--ink)")} />
                <path d={"M16 18 L16 26 M20 17 L20 26"} strokeWidth={"1.5"} style={css("stroke:var(--ink)")} />
              </svg>
            </div>
            <div style={css("position:absolute;left:33.0%;top:30px;transform:scaleX(1);opacity:.7")}>
              <svg className={"np3-crow"} viewBox={"0 0 34 26"} width={"34"} height={"26"} style={css("animation-delay:-3s")}>
                <path d={"M4 16 Q8 8 18 8 Q22 3 27 5 L33 7 L28 9 Q27 14 22 17 L14 19 L9 25 L9 19 Q5 19 4 16 Z"} style={css("fill:var(--ink)")} />
                <path d={"M16 18 L16 26 M20 17 L20 26"} strokeWidth={"1.5"} style={css("stroke:var(--ink)")} />
              </svg>
            </div>
            <div style={css("position:absolute;left:58.0%;top:35px;transform:scaleX(-1);opacity:.7")}>
              <svg className={"np3-crow"} viewBox={"0 0 34 26"} width={"34"} height={"26"} style={css("animation-delay:-6s")}>
                <path d={"M4 16 Q8 8 18 8 Q22 3 27 5 L33 7 L28 9 Q27 14 22 17 L14 19 L9 25 L9 19 Q5 19 4 16 Z"} style={css("fill:var(--ink)")} />
                <path d={"M16 18 L16 26 M20 17 L20 26"} strokeWidth={"1.5"} style={css("stroke:var(--ink)")} />
              </svg>
            </div>
            <div style={css("position:absolute;left:80.0%;top:26px;transform:scaleX(1);opacity:.7")}>
              <svg className={"np3-crow"} viewBox={"0 0 34 26"} width={"34"} height={"26"} style={css("animation-delay:-0s")}>
                <path d={"M4 16 Q8 8 18 8 Q22 3 27 5 L33 7 L28 9 Q27 14 22 17 L14 19 L9 25 L9 19 Q5 19 4 16 Z"} style={css("fill:var(--ink)")} />
                <path d={"M16 18 L16 26 M20 17 L20 26"} strokeWidth={"1.5"} style={css("stroke:var(--ink)")} />
              </svg>
            </div>
          </div>
          {v.vHome ? (<>
            <div className={v.pageClass} id={"top-home"}>
              <section aria-label={"Introduction"} style={css("position:relative;max-width:1240px;margin:0 auto;padding:36px 32px 0")}>
                <div className={"fz-hero-kite np3-kite"} aria-hidden={"true"} style={css("right:6%;top:6px;z-index:3;--d:6s")}>
                  <svg viewBox={"0 0 120 300"} width={"110"} height={"275"} style={css("overflow:visible")}>
                    <path d={"M60 104 C 52 170, 78 220, 48 300"} fill={"none"} strokeWidth={"1.2"} style={css("stroke:var(--ink)")} opacity={".4"} />
                    <path d={"M60 0 L104 46 L60 104 L16 46 Z"} fill={"#D21F14"} />
                    <path d={"M60 0 L104 46 L60 46 Z"} fill={"#FFD400"} />
                    <path d={"M16 46 L60 104 L60 46 Z"} fill={"#FFD400"} />
                    <path d={"M60 0 V104 M16 46 H104"} strokeWidth={"1.5"} style={css("stroke:var(--ink)")} opacity={".5"} />
                    <path className={"np3-tail"} d={"M60 104 q 10 20 0 40 t 0 40 t 0 40"} fill={"none"} strokeWidth={"3"} style={css("stroke:#D21F14")} />
                  </svg>
                </div>
                <div className={"fz-hero-kite np3-kite"} aria-hidden={"true"} style={css("right:22%;top:70px;z-index:3;--d:8s;opacity:.9")}>
                  <svg viewBox={"0 0 120 300"} width={"70"} height={"175"} style={css("overflow:visible")}>
                    <path d={"M60 104 C 52 170, 78 220, 48 300"} fill={"none"} strokeWidth={"1.2"} style={css("stroke:var(--ink)")} opacity={".4"} />
                    <path d={"M60 0 L104 46 L60 104 L16 46 Z"} fill={"#00924A"} />
                    <path d={"M60 0 L104 46 L60 46 Z"} fill={"#F3EFE7"} />
                    <path d={"M16 46 L60 104 L60 46 Z"} fill={"#F3EFE7"} />
                    <path className={"np3-tail"} d={"M60 104 q 10 20 0 40 t 0 40 t 0 40"} fill={"none"} strokeWidth={"3"} style={css("stroke:#00924A")} />
                  </svg>
                </div>
                <h1 className={"np3-h1 np3-disp"} style={css("font-weight:800;font-size:112px;line-height:.95;margin:0 0 18px;max-width:1000px")}>
                  <span style={css("display:block")}>
                    {"Today's news,"}
                  </span>
                  <span style={css("display:block;height:1.05em;overflow:hidden;color:var(--hl)")}>
                    <span className={"np3-words"} style={css(`display:block;transform:translateY(-${v.wordOffset}em)`)}>
                      <span style={css("display:block;height:1.05em")}>
                        {"from "}<span lang={"bn"}>{"ঢাকা"}</span>{"."}
                      </span>
                      <span style={css("display:block;height:1.05em")}>
                        {"from the world."}
                      </span>
                      <span style={css("display:block;height:1.05em")}>
                        {"in 60 seconds."}
                      </span>
                      <span style={css("display:block;height:1.05em")}>
                        {"without the noise."}
                      </span>
                    </span>
                  </span>
                </h1>
                <p style={css("font-size:21px;line-height:1.5;max-width:600px;margin:0 0 30px;color:var(--muted)")}>
                  {"People are waiting at the bus stands with questions about the news. Stop and pick them up, and each passenger brings a story explained. Not in the mood to ride? Skip the game and open all five."}
                </p>
              </section>
              <section id={"game"} aria-label={"Passenger stops"} style={css("position:relative;z-index:2;max-width:1240px;margin:0 auto;padding:0 32px")}>
                <div style={css("background:var(--bg);border-radius:30px;padding:16px;margin:-16px;box-shadow:0 0 0 1px var(--line)")}>
                  <div className={"np3-game"} tabIndex={"0"} role={"application"} aria-label={"Passenger stops. Hold Right arrow to pedal, Left arrow to brake, Space to jump, B to ring the bell. Stop at a bus stand to pick up a passenger."} onKeyDown={v.keyDown} onKeyUp={v.keyUp} style={css("position:relative;border:2px solid var(--line);border-radius:22px;overflow:hidden;background:var(--canvas);touch-action:manipulation")}>
                    <canvas id={"np3-canvas"} ref={v.setCanvas} onPointerDown={v.tapJump} style={css("display:block;width:100%;aspect-ratio:1000/380;cursor:pointer")} />
                    {v.crashed ? (<>
                      <div className={"np3-pop"} role={"status"} style={css("position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none")}>
                        <div style={css("background:var(--panel);border:2px solid var(--line);border-radius:18px;padding:20px 24px;text-align:center;pointer-events:auto;max-width:440px")}>
                          <p className={"np3-disp"} style={css("margin:0 0 4px;font-weight:800;font-size:32px;color:var(--accent2)")}>
                            {"Crash!"}
                          </p>
                          <p style={css("margin:0 0 14px;font-size:18px;line-height:1.45")}>
                            {v.crashMsg}
                          </p>
                          <button type={"button"} className={"np3-btn"} onClick={v.again} style={css("font-family:inherit;font-weight:700;font-size:18px;padding:12px 24px;border-radius:12px;border:0;background:#FFD400;color:#000000;cursor:pointer")}>
                            {"Ride again from the last stand"}
                          </button>
                        </div>
                      </div>
                    </>) : null}
                    {v.won ? (<>
                      <div className={"np3-pop"} role={"status"} style={css("position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;background:rgba(26,23,20,.25)")}>
                        <div style={css("background:var(--panel);border:2px solid var(--line);border-radius:18px;padding:22px 26px;text-align:center;pointer-events:auto;max-width:480px")}>
                          <p className={"np3-disp"} style={css("margin:0 0 6px;font-weight:800;font-size:34px")}>
                            {"All 5 passengers picked up!"}
                          </p>
                          <p style={css("margin:0 0 16px;font-size:18px;line-height:1.45")}>
                            {"Your stories are waiting below. Now the real ride begins: "}
                            <strong>
                              {"rush hour"}
                            </strong>
                            {". The road speeds up and fills with traffic. Every metre and every obstacle you clear earns points."}
                          </p>
                          <div style={css("display:flex;gap:10px;justify-content:center;flex-wrap:wrap")}>
                            <button type={"button"} className={"np3-btn"} onClick={v.startRush} style={css("font-family:inherit;font-weight:700;font-size:18px;padding:12px 22px;border-radius:12px;border:0;background:#D21F14;color:#FFFFFF;cursor:pointer")}>
                              {"Start rush hour"}
                            </button>
                            <a href={"#ride-h"} className={"np3-btn"} style={css("font-weight:700;font-size:18px;padding:12px 20px;border-radius:12px;border:2px solid var(--line);color:var(--ink);text-decoration:none")}>
                              {"Read my stories"}
                            </a>
                          </div>
                        </div>
                      </div>
                    </>) : null}
                    {v.over ? (<>
                      <div className={"np3-pop"} role={"status"} style={css("position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;background:rgba(26,23,20,.25)")}>
                        <div style={css("background:var(--panel);border:2px solid var(--line);border-radius:18px;padding:22px 26px;text-align:center;pointer-events:auto;max-width:460px")}>
                          <p style={css("margin:0;font-weight:700;font-size:17px;color:var(--accent2)")}>
                            {"Rush hour over"}
                          </p>
                          <p className={"np3-disp"} style={css("margin:0;font-weight:800;font-size:64px;line-height:1")}>
                            {v.score}
                          </p>
                          <p style={css("margin:0 0 6px;font-weight:600;font-size:16px;color:var(--muted)")}>
                            {"points"}
                          </p>
                          <p style={css("margin:0 0 16px;font-size:17px;line-height:1.45")}>
                            {v.overMsg}
                          </p>
                          <div style={css("display:flex;gap:10px;justify-content:center;flex-wrap:wrap")}>
                            <button type={"button"} className={"np3-btn"} onClick={v.startRush} style={css("font-family:inherit;font-weight:700;font-size:18px;padding:12px 24px;border-radius:12px;border:0;background:#FFD400;color:#000000;cursor:pointer")}>
                              {"Restart"}
                            </button>
                            <a href={"#ride-h"} className={"np3-btn"} style={css("font-weight:700;font-size:18px;padding:12px 20px;border-radius:12px;border:2px solid var(--line);color:var(--ink);text-decoration:none")}>
                              {"Read my stories"}
                            </a>
                          </div>
                        </div>
                      </div>
                    </>) : null}
                    {v.gameActive ? (<>
                      <button type={"button"} className={"np3-btn"} onClick={v.toAmbient} aria-label={"Stop playing"} title={"Stop playing"} style={css("position:absolute;right:12px;top:12px;width:44px;height:44px;border-radius:12px;border:2px solid var(--line);background:var(--panel);cursor:pointer;display:flex;align-items:center;justify-content:center")}>
                        <svg viewBox={"0 0 24 24"} width={"18"} height={"18"} aria-hidden={"true"}>
                          <path d={"M6 6l12 12M18 6L6 18"} strokeWidth={"2.5"} strokeLinecap={"round"} style={css("stroke:var(--ink)")} />
                        </svg>
                      </button>
                    </>) : null}
                  </div>
                  {v.inviteOn ? (<>
                    <div style={css("display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:14px;background:var(--panel);border:2px solid var(--line);border-radius:16px;padding:10px 10px 10px 18px")}>
                      <p style={css("margin:0;flex:1 1 320px;font-size:17px;line-height:1.4")}>
                        <strong className={"np3-disp"} style={css("font-weight:800;font-size:24px;margin-right:8px")}>
                          {"Want to ride?"}
                        </strong>
                        {"Pick up 5 passengers and their stories, then take on rush hour."}
                      </p>
                      <button type={"button"} className={"np3-btn"} onClick={v.start} style={css("font-family:inherit;font-weight:700;font-size:17px;padding:11px 22px;border-radius:12px;border:0;background:#FFD400;color:#000000;cursor:pointer")}>
                        {"Play"}
                      </button>
                      <button type={"button"} className={"np3-btn"} onClick={v.showAll} style={css("font-family:inherit;font-weight:700;font-size:17px;padding:10px 16px;border-radius:12px;border:2px solid var(--line);background:transparent;color:var(--ink);cursor:pointer")}>
                        {"Skip to the stories"}
                      </button>
                      <button type={"button"} className={"np3-btn"} onClick={v.closeInvite} aria-label={"Close and just watch"} style={css("width:44px;height:44px;border-radius:12px;border:0;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center")}>
                        <svg viewBox={"0 0 24 24"} width={"18"} height={"18"} aria-hidden={"true"}>
                          <path d={"M6 6l12 12M18 6L6 18"} strokeWidth={"2.5"} strokeLinecap={"round"} style={css("stroke:var(--ink)")} />
                        </svg>
                      </button>
                    </div>
                  </>) : null}
                  {v.playPill ? (<>
                    <div style={css("display:flex;justify-content:flex-end;margin-top:14px")}>
                      <button type={"button"} className={"np3-btn"} onClick={v.start} style={css("font-family:inherit;font-weight:700;font-size:16px;padding:10px 18px;border-radius:999px;border:2px solid var(--line);background:var(--panel);color:var(--ink);cursor:pointer")}>
                        {"Play the game"}
                      </button>
                    </div>
                  </>) : null}
                  {v.gameActive ? (<>
                    <div style={css("display:flex;gap:12px;margin-top:14px;flex-wrap:wrap;align-items:stretch")}>
                      <button type={"button"} className={"np3-btn"} onPointerDown={v.pedalOn} onPointerUp={v.pedalOff} onPointerLeave={v.pedalOff} onPointerCancel={v.pedalOff} style={css("flex:1 1 150px;font-family:inherit;font-weight:700;font-size:18px;padding:14px;border-radius:14px;border:2px solid var(--ink);background:var(--panel);color:var(--ink);cursor:pointer;touch-action:none")}>
                        {"Hold to pedal"}
                      </button>
                      <button type={"button"} className={"np3-btn"} onPointerDown={v.tapJump} style={css("flex:1 1 150px;font-family:inherit;font-weight:700;font-size:18px;padding:14px;border-radius:14px;border:0;background:#FFD400;color:#000000;cursor:pointer;touch-action:none")}>
                        {"Jump"}
                      </button>
                      <button type={"button"} className={"np3-btn"} onPointerDown={v.ringBell} style={css("flex:1 1 150px;font-family:inherit;font-weight:700;font-size:18px;padding:14px;border-radius:14px;border:0;background:#D21F14;color:#FFFFFF;cursor:pointer;touch-action:none")}>
                        {"Ring the bell"}
                      </button>
                      <div style={css("flex:2 1 300px;display:flex;align-items:center;font-size:16px;color:var(--muted);line-height:1.4")}>
                        {"Let go of pedal to stop at a stand. Picked up today: "}
                        <strong style={css("color:var(--ink);margin-left:6px")}>
                          {v.pickedCount}
                        </strong>
                        <button type={"button"} className={"np3-btn"} onClick={v.showAll} style={css("margin-left:auto;font-family:inherit;font-weight:600;font-size:16px;padding:8px 12px;border-radius:10px;border:0;background:transparent;color:var(--ink);text-decoration:underline;text-decoration-color:var(--accent2);text-underline-offset:3px;cursor:pointer")}>
                          {"Skip the game, show all 5"}
                        </button>
                      </div>
                    </div>
                    <p style={css("margin:10px 0 0;font-size:15px;color:var(--muted)")}>
                      {`Keyboard: click the road, hold → to pedal, ← to brake, Space to jump, B for the bell. Rush hour best: ${v.rushBest} points`}
                    </p>
                  </>) : null}
                </div>
              </section>
              {v.hasSigns ? (<section aria-label={"Today in Dhaka"} style={css("max-width:1240px;margin:0 auto;padding:34px 32px 0")}>
                <div className={"ak-signs"} data-io={"1"} style={{ '--cols': v.signCols2 }}>
                  <div className={"ak-wire"} aria-hidden={"true"} />
                  {(v.signs || []).map((g, gI) => (<div key={g.key} className={"ak-sign"} style={{ '--i': gI, '--c': g.color }}>
                    <span className={"ak-sl"}>{g.label}</span>
                    <span className={"ak-sv np3-disp"}><Odo pre={g.pre} value={g.big} post={g.post} /></span>
                    <span className={"ak-ss"}>{g.sub}</span>
                  </div>))}
                  {v.fx ? (<div className={"ak-sign ak-fx"} style={{ '--i': 2, '--c': '#00924A' }}>
                    <span className={"ak-sl"} id={"fx-l"}>{"Money converter"}</span>
                    <div className={"ak-fxrow"} role={"group"} aria-labelledby={"fx-l"}>
                      <input className={"ak-fxin"} inputMode={"decimal"} aria-label={"Amount"} value={v.fx.amt} onChange={v.fx.onAmt} />
                      <select className={"ak-fxsel"} aria-label={"Convert from"} value={v.fx.from} onChange={v.fx.onFrom}>
                        {v.fx.list.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
                      </select>
                      <button type={"button"} className={"ak-swap"} onClick={v.fx.swap} aria-label={"Swap the two currencies"}>
                        <svg viewBox={"0 0 24 24"} width={"20"} height={"20"} aria-hidden={"true"}><path d={"M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"} fill={"none"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} style={css("stroke:currentColor")} /></svg>
                      </button>
                      <select className={"ak-fxsel"} aria-label={"Convert to"} value={v.fx.to} onChange={v.fx.onTo}>
                        {v.fx.list.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
                      </select>
                    </div>
                    <span className={"ak-sv ak-fxv np3-disp" + (v.fx.big.length > 10 ? " long" : "")}><Odo pre={v.fx.sym} value={v.fx.big} post={"\u00a0" + v.fx.to} /></span>
                    <span className={"ak-ss"}>{v.fx.rateLine + (v.fx.asOf ? ", rate of " + v.fx.asOf : "")}</span>
                  </div>) : null}
                </div>
                <p className={"ak-todaynote"}>{v.todayNote}</p>
              </section>) : null}
              <section aria-labelledby={"ride-h"} aria-live={"polite"} style={css("max-width:1240px;margin:0 auto;padding:56px 32px 70px")}>
                <div style={css("display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap;border-top:3px solid var(--ink);padding-top:16px;margin-bottom:26px")}>
                  <h2 id={"ride-h"} className={"np3-disp"} style={css("font-weight:800;font-size:56px;line-height:1;margin:0")}>
                    {"Today's five"}
                  </h2>
                  <span style={css("font-weight:600;font-size:17px;color:var(--muted)")}>
                    {`${v.pickedCount} of ${v.fiveN} picked up`}
                  </span>
                </div>
                {v.empty ? (<>
                  <div className={"ak-lock"}>
                    <p>{"Today's five stories are waiting at the bus stands. Play the game to pick them up, or open them now."}</p>
                    <div className={"ak-lockbtns"}>
                      <button type={"button"} className={"fz-dykbtn"} onClick={v.playNow}>{"Play to pick them up"}</button>
                      <button type={"button"} className={"fz-dykbtn fz-dykbtn2"} onClick={v.showAll}>{"Open all five now"}</button>
                    </div>
                  </div>
                </>) : null}
                {v.evenFlash ? (<>
                  <article className={"np3-in"} style={css(`background:var(--panel);border:2px solid var(--line);border-left:10px solid ${v.ride.color};border-radius:20px;padding:30px;display:grid;gap:14px`)}>
                    <img src={v.rideImg} alt={""} width={"400"} height={"260"} style={css("display:block;width:100%;max-width:520px;height:auto;aspect-ratio:400/260;border-radius:14px")} />
                    <p style={css("margin:0;font-weight:600;font-size:16px;color:var(--muted)")}>
                      {`${v.ride.cat}, ${v.ride.time} read`}
                    </p>
                    <h3 className={"np3-disp"} style={css("font-weight:800;font-size:44px;line-height:1.02;margin:0;max-width:900px")}>
                      {v.ride.title}
                    </h3>
                    <p style={css("margin:0;font-size:20px;line-height:1.55;max-width:760px")}>
                      {v.ride.brief}
                    </p>
                    <p style={css("margin:0;font-size:19px;line-height:1.55;max-width:760px;color:var(--muted)")}>
                      <strong style={css("color:var(--ink)")}>
                        {"Why should I care?"}
                      </strong>
                      {` ${v.ride.why}`}
                    </p>
                    <a href={v.rideHref} onClick={v.openRide} style={css("font-weight:700;font-size:18px")}>
                      {"Read the full explainer"}
                    </a>
                  </article>
                </>) : null}
                {v.oddFlash ? (<>
                  <article className={"np3-in"} style={css(`background:var(--panel);border:2px solid var(--line);border-left:10px solid ${v.ride.color};border-radius:20px;padding:30px;display:grid;gap:14px`)}>
                    <img src={v.rideImg} alt={""} width={"400"} height={"260"} style={css("display:block;width:100%;max-width:520px;height:auto;aspect-ratio:400/260;border-radius:14px")} />
                    <p style={css("margin:0;font-weight:600;font-size:16px;color:var(--muted)")}>
                      {`${v.ride.cat}, ${v.ride.time} read`}
                    </p>
                    <h3 className={"np3-disp"} style={css("font-weight:800;font-size:44px;line-height:1.02;margin:0;max-width:900px")}>
                      {v.ride.title}
                    </h3>
                    <p style={css("margin:0;font-size:20px;line-height:1.55;max-width:760px")}>
                      {v.ride.brief}
                    </p>
                    <p style={css("margin:0;font-size:19px;line-height:1.55;max-width:760px;color:var(--muted)")}>
                      <strong style={css("color:var(--ink)")}>
                        {"Why should I care?"}
                      </strong>
                      {` ${v.ride.why}`}
                    </p>
                    <a href={v.rideHref} onClick={v.openRide} style={css("font-weight:700;font-size:18px")}>
                      {"Read the full explainer"}
                    </a>
                  </article>
                </>) : null}
                {v.hasPicked ? (<>
                  <div style={css("margin-top:24px")}>
                    <p style={css("margin:0 0 10px;font-weight:700;font-size:17px")}>
                      {"Pick another"}
                    </p>
                    <div style={css("display:flex;gap:10px;flex-wrap:wrap")}>
                      {(v.picked || []).map((p, pI) => (<React.Fragment key={pI}>
                        <button type={"button"} className={"np3-chip"} onClick={p.show} aria-pressed={p.on} style={css(p.style)}>
                          {p.title}
                        </button>
                      </React.Fragment>))}
                    </div>
                  </div>
                </>) : null}
              </section>
              {v.hasLive ? (<>
                <section aria-labelledby={"live-h"} style={css("max-width:1240px;margin:0 auto;padding:56px 32px 0")}>
                  <div style={css("display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap;border-top:3px solid var(--ink);padding-top:16px;margin-bottom:14px")}>
                    <h2 id={"live-h"} className={"np3-disp"} style={css("font-weight:800;font-size:56px;line-height:1;margin:0")}>
                      <span className={"fz-livedot"} aria-hidden={"true"} />
                      {"Live headlines"}
                    </h2>
                    {v.newN > 0 ? (<button type={"button"} className={"ak-new"} onClick={v.seeNew}>{Ico.bell}<span>{v.newLabel}</span></button>) : (<span style={css("font-weight:600;font-size:17px;color:var(--muted)")}>
                      {v.checked || "Tap a headline for the simple version."}
                    </span>)}
                  </div>
                  <div role={"group"} aria-label={"Filter live headlines"} style={css("display:flex;gap:8px;flex-wrap:wrap;margin-bottom:22px")}>
                    {(v.liveChips || []).map((c, cI) => (<React.Fragment key={cI}>
                      <button type={"button"} className={"pg-btn"} onClick={c.go} aria-pressed={c.on} style={css(c.style)}>
                        {c.name}
                      </button>
                    </React.Fragment>))}
                  </div>
                  <div className={"fz-live"}>
                    {(v.live || []).map((h, hI) => (<React.Fragment key={hI}>
                      <a className={"fz-livec"} href={h.href} onClick={h.open}>
                        <img src={h.img} alt={""} width={"400"} height={"260"} loading={"lazy"} />
                        <span style={css("display:flex;flex-direction:column;gap:4px;min-width:0")}>
                          <span style={css("font-weight:600;font-size:14px;color:var(--muted)")}>
                            <span style={css(`color:${h.color};font-weight:700`)}>
                              {h.section}
                            </span>
                            {`, ${h.from}`}
                          </span>
                          <span className={"np3-disp"} style={css("font-weight:800;font-size:21px;line-height:1.12")}>
                            {h.title}
                            {h.isNew && !h.read ? <span className={"ak-newtag"}>{"New"}</span> : null}
                            {h.read ? <span className={"fz-readtag"}>{h.read}</span> : null}
                          </span>
                        </span>
                      </a>
                    </React.Fragment>))}
                  </div>
                  <div className={"ak-livefoot"}>
                    {v.liveMore ? <button type={"button"} className={"fz-dykbtn fz-dykbtn2"} onClick={v.showMoreLive}>{v.liveMoreLabel}</button> : null}
                    <button type={"button"} className={"fz-dykbtn fz-dykbtn2"} onClick={v.toAll}>{"See every story"}</button>
                  </div>
                </section>
              </>) : null}
              <div className={"fz-strip"} aria-hidden={"true"}>
                <svg viewBox={"0 0 1440 110"} preserveAspectRatio={"none"} style={css("position:absolute;inset:0;width:100%;height:100%")}>
                  <path d={"M0 32 Q720 84 1440 43"} fill={"none"} strokeWidth={"2"} style={css("stroke:var(--ink)")} opacity={".35"} />
                  <path d={"M0 44 Q620 98 1440 39"} fill={"none"} strokeWidth={"1.5"} style={css("stroke:var(--ink)")} opacity={".22"} />
                  <path d={"M0 49 Q820 74 1440 48"} fill={"none"} strokeWidth={"1.5"} style={css("stroke:var(--ink)")} opacity={".2"} />
                </svg>
                <div style={css("position:absolute;left:14.0%;top:19px;transform:scaleX(-1);opacity:.7")}>
                  <svg className={"np3-crow"} viewBox={"0 0 34 26"} width={"34"} height={"26"} style={css("animation-delay:-1s")}>
                    <path d={"M4 16 Q8 8 18 8 Q22 3 27 5 L33 7 L28 9 Q27 14 22 17 L14 19 L9 25 L9 19 Q5 19 4 16 Z"} style={css("fill:var(--ink)")} />
                    <path d={"M16 18 L16 26 M20 17 L20 26"} strokeWidth={"1.5"} style={css("stroke:var(--ink)")} />
                  </svg>
                </div>
                <div style={css("position:absolute;left:33.0%;top:30px;transform:scaleX(1);opacity:.7")}>
                  <svg className={"np3-crow"} viewBox={"0 0 34 26"} width={"34"} height={"26"} style={css("animation-delay:-4s")}>
                    <path d={"M4 16 Q8 8 18 8 Q22 3 27 5 L33 7 L28 9 Q27 14 22 17 L14 19 L9 25 L9 19 Q5 19 4 16 Z"} style={css("fill:var(--ink)")} />
                    <path d={"M16 18 L16 26 M20 17 L20 26"} strokeWidth={"1.5"} style={css("stroke:var(--ink)")} />
                  </svg>
                </div>
                <div style={css("position:absolute;left:58.0%;top:35px;transform:scaleX(-1);opacity:.7")}>
                  <svg className={"np3-crow"} viewBox={"0 0 34 26"} width={"34"} height={"26"} style={css("animation-delay:-7s")}>
                    <path d={"M4 16 Q8 8 18 8 Q22 3 27 5 L33 7 L28 9 Q27 14 22 17 L14 19 L9 25 L9 19 Q5 19 4 16 Z"} style={css("fill:var(--ink)")} />
                    <path d={"M16 18 L16 26 M20 17 L20 26"} strokeWidth={"1.5"} style={css("stroke:var(--ink)")} />
                  </svg>
                </div>
                <div style={css("position:absolute;left:80.0%;top:30px;transform:scaleX(1);opacity:.7")}>
                  <svg className={"np3-crow"} viewBox={"0 0 34 26"} width={"34"} height={"26"} style={css("animation-delay:-1s")}>
                    <path d={"M4 16 Q8 8 18 8 Q22 3 27 5 L33 7 L28 9 Q27 14 22 17 L14 19 L9 25 L9 19 Q5 19 4 16 Z"} style={css("fill:var(--ink)")} />
                    <path d={"M16 18 L16 26 M20 17 L20 26"} strokeWidth={"1.5"} style={css("stroke:var(--ink)")} />
                  </svg>
                </div>
              </div>
              <section aria-labelledby={"topics-h"} style={css("max-width:1240px;margin:0 auto;padding:10px 32px 60px")}>
                <div style={css("display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap;border-top:3px solid var(--ink);padding-top:16px;margin-bottom:22px")}>
                  <h2 id={"topics-h"} className={"np3-disp"} style={css("font-weight:800;font-size:56px;line-height:1;margin:0")}>
                    {"Explore by topic"}
                  </h2>
                  <span style={css("font-weight:600;font-size:17px;color:var(--muted)")}>
                    {"Pick what you care about"}
                  </span>
                </div>
                <div className={"fz-topics"}>
                  {(v.topics || []).map((t, tI) => (<React.Fragment key={tI}>
                    <button type={"button"} className={"fz-topic"} data-t={t.name} onClick={t.go} style={css(`background:${t.color};color:${t.fg}`)}>
                      <TopicArt name={t.name} />
                      <span style={css("position:relative;font-weight:600;font-size:15px;opacity:.85")}>
                        {t.count}
                      </span>
                      <span className={"np3-disp"} style={css("position:relative;font-weight:800;font-size:36px;line-height:1")}>
                        {t.name}
                      </span>
                      <span style={css("position:relative;font-size:16px;line-height:1.35;opacity:.9")}>
                        {t.blurb}
                      </span>
                    </button>
                  </React.Fragment>))}
                </div>
              </section>
              <section aria-labelledby={"play-h"} style={css("max-width:1240px;margin:0 auto;padding:10px 32px 70px")}>
                <div style={css("display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap;border-top:3px solid var(--ink);padding-top:16px;margin-bottom:22px")}>
                  <h2 id={"play-h"} className={"np3-disp"} style={css("font-weight:800;font-size:56px;line-height:1;margin:0")}>
                    {"Play & learn"}
                  </h2>
                  <span style={css("font-weight:600;font-size:17px;color:var(--muted)")}>
                    {"A new quiz and new facts every 6 hours"}
                  </span>
                </div>
                <div className={"ak-play"}>
                  <div className={"ak-pcard"}>
                    <h3 id={"quiz-h"} className={"np3-disp ak-ph"}>{"Quick check"}</h3>
                    <div className={"ak-qdots"} role={"group"} aria-label={"Questions"}>
                      {(v.quizDots || []).map((d, dI) => (<button key={dI} type={"button"} onClick={d.go} aria-label={"Question " + (dI + 1)} aria-current={d.on ? "step" : undefined} className={"ak-qd" + (d.on ? " on" : "") + (d.done ? (d.right ? " ok" : " no") : "")} />))}
                    </div>
                    {(v.quiz || []).filter((q, qI) => qI === v.quizI).map((qz) => (<fieldset key={qz.key} className={"ak-qcard"}>
                      <legend style={css("float:left;width:100%;padding:0;margin:0 0 14px;font-weight:700;font-size:20px;line-height:1.35")}>
                        <span className={"fz-topicchip"}>{qz.topic}</span>
                        {qz.q}
                      </legend>
                      <div style={css("display:flex;flex-direction:column;gap:8px;clear:both")}>
                        {(qz.opts || []).map((op, opI) => (<React.Fragment key={opI}>
                          <button type={"button"} className={op.cls} onClick={op.pick} aria-pressed={op.picked} disabled={op.locked} style={css(op.style)}>
                            {op.t}
                          </button>
                        </React.Fragment>))}
                      </div>
                      {qz.done ? (<>
                        <p className={"np3-in"} role={"status"} style={css("margin:12px 0 0;font-size:16px;line-height:1.45;color:var(--muted)")}>
                          <strong style={css(`color:${qz.verdictColor}`)}>
                            {qz.verdict}
                          </strong>
                          {` ${qz.why}`}
                        </p>
                      </>) : null}
                    </fieldset>))}
                    <div className={"ak-qfoot"}>
                      <span className={"ak-qpos"}>{v.quizDone ? v.quizScore : v.quizPos}</span>
                      {v.quizAnswered && v.quizHasNext ? <button type={"button"} className={"fz-dykbtn"} onClick={v.quizNext}>{"Next question"}</button> : null}
                      {v.quizDone ? <button type={"button"} className={"fz-dykbtn fz-dykbtn2"} onClick={v.quizAgain}>{"Play again"}</button> : null}
                      {(v.quiz || []).filter((q, qI) => qI === v.quizI).map((qz) => (qz.done ? <button key={"r" + qz.key} type={"button"} className={"ak-link"} onClick={qz.report}>{"Wrong answer? Tell us"}</button> : null))}
                    </div>
                  </div>
                  {v.dyk && v.dyk.has ? (<div className={"ak-pcard"}>
                    <h3 id={"dyk-h"} className={"np3-disp ak-ph"}>{"Did you know?"}</h3>
                    <div role={"group"} aria-label={"Fact topics"} style={css("display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px")}>
                      {(v.dyk.tabs || []).map((t, tI) => (<React.Fragment key={tI}>
                        <button type={"button"} onClick={t.go} aria-pressed={t.on} style={css(t.style)}>
                          {t.name}
                        </button>
                      </React.Fragment>))}
                    </div>
                    <div className={"fz-dyk ak-dyk"} style={css(`border-left-color:${v.dyk.color}`)}>
                      <p key={v.dyk.hook} className={"np3-disp fz-dykhook ak-hook"} aria-live={"polite"}>
                        {v.dyk.hook}
                      </p>
                      {v.dyk.open ? (<>
                        <p className={"np3-in fz-dykmore"}>
                          {v.dyk.more}
                        </p>
                      </>) : null}
                      <div className={"fz-dykbar"}>
                        <button type={"button"} className={"fz-dykbtn"} onClick={v.dyk.toggle} aria-expanded={v.dyk.open ? "true" : "false"}>
                          {v.dyk.label}
                        </button>
                        <button type={"button"} className={"fz-dykbtn fz-dykbtn2"} onClick={v.dyk.next}>
                          {"Next fact"}
                        </button>
                        <span className={"fz-dykpos"}>
                          {v.dyk.section + ", " + v.dyk.pos}
                        </span>
                      </div>
                    </div>
                    <div className={"ak-qfoot"}><button type={"button"} className={"ak-link"} onClick={v.dykReport}>{"Spotted a mistake in this fact?"}</button></div>
                  </div>) : null}
                </div>
                {v.wotd ? (<div className={"ak-word"} data-io={"1"}>
                  <span className={"ak-wlab"}>{"Word of the day"}</span>
                  <p className={"ak-wterm np3-disp"}><Flap word={v.wotd.term} /></p>
                  <p className={"ak-wmean"}>{v.wotd.meaning}</p>
                  <a className={"ak-wfrom"} href={v.wotd.href} onClick={v.wotd.open}>{"From: " + v.wotd.from}</a>
                </div>) : null}
              </section>
              <section id={"join"} aria-labelledby={"join-h"} style={css("padding:20px 32px 100px")}>
                <div style={css("max-width:1000px;margin:0 auto;background:var(--panel);border:2px solid var(--line);border-radius:24px;padding:52px 40px;text-align:center")}>
                  <h2 id={"join-h"} className={"np3-disp"} style={css("font-weight:800;font-size:62px;line-height:1;margin:0 0 10px")}>
                    {"Catch the first ride"}
                  </h2>
                  <p style={css("font-size:20px;margin:0 auto 26px;max-width:520px;line-height:1.5;color:var(--muted)")}>
                    {"Five stories every morning. Free, and you can hop off any time."}
                  </p>
                  {v.notJoined ? (<>
                    <form onSubmit={v.join} style={css("display:flex;gap:12px;justify-content:center;flex-wrap:wrap;max-width:560px;margin:0 auto")}>
                      <label htmlFor={"np3-email"} style={css("position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)")}>
                        {"Email address"}
                      </label>
                      <input id={"np3-email"} type={"email"} required placeholder={"you@example.com"} style={css("flex:1 1 260px;min-width:0;font-family:inherit;font-size:19px;padding:14px 20px;border-radius:14px;border:2px solid var(--line);background:var(--bg);color:var(--ink)")} />
                      <button type={"submit"} className={"np3-btn"} style={css("font-family:inherit;font-weight:700;font-size:19px;padding:14px 24px;border-radius:14px;border:0;background:#D21F14;color:#FFFFFF;cursor:pointer")}>
                        {"Join the waitlist"}
                      </button>
                    </form>
                  </>) : null}
                  {v.joined ? (<>
                    <p className={"np3-pop np3-disp"} role={"status"} style={css("font-weight:800;font-size:32px;margin:0")}>
                      {"You're on the list. First ride tomorrow morning."}
                    </p>
                  </>) : null}
                </div>
              </section>
            </div>
          </>) : null}
          {v.vStory ? (<>
            <div className={v.pageClass} style={css("max-width:900px;margin:0 auto;padding:20px 32px 90px")}>
              <div style={css("display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:26px")}>
                <p style={css("margin:0;font-weight:600;font-size:16px;color:var(--muted)")}>
                  <a href={"/"} onClick={v.goHome}>
                    {"Today's five"}
                  </a>
                  {` / ${v.crumb} / ${v.posText}`}
                </p>
                <div style={css("display:flex;gap:8px")}>
                  <button type={"button"} className={"pg-btn"} onClick={v.prev} style={css("font-family:inherit;font-weight:700;font-size:16px;padding:9px 14px;border-radius:10px;border:2px solid var(--line);background:var(--panel);color:var(--ink);cursor:pointer")}>
                    {"Previous story"}
                  </button>
                  <button type={"button"} className={"pg-btn"} onClick={v.next} style={css("font-family:inherit;font-weight:700;font-size:16px;padding:9px 14px;border-radius:10px;border:0;background:var(--ink);color:var(--bg);cursor:pointer")}>
                    {"Next story"}
                  </button>
                </div>
              </div>
              {v.even ? storyHead(v) : null}
              {v.odd ? storyHead(v) : null}
              {v.isLive ? (<>
                <section aria-labelledby={"src-h"} className={"fz-src"}>
                  <h2 id={"src-h"} className={"pg-disp"} style={css("font-weight:800;font-size:30px;margin:0 0 6px")}>
                    {"Read the full story"}
                  </h2>
                  <p style={css("margin:0 0 14px;font-size:17px;line-height:1.5;color:var(--muted)")}>
                    {v.noAI ? "The simple version of this one arrives with the next update. Until then, here is the publisher's own report." : "The exact details and quotes are in the original report."}
                  </p>
                  <a className={"fz-srcbtn"} href={v.s.link} target={"_blank"} rel={"noopener noreferrer"}>
                    <span style={css("font-weight:700;font-size:15px;color:var(--muted)")}>
                      {`Original report from ${v.s.source}`}
                    </span>
                    <span className={"pg-disp"} style={css("font-weight:800;font-size:24px;line-height:1.15")}>
                      {v.s.orig}
                    </span>
                    <span className={"fz-srcgo"}>
                      {"Open the original (new tab)"}
                    </span>
                  </a>
                  {v.st.hasAlso ? (<div className={"ak-also"}>
                    <p className={"ak-alsolab"}>{"Also reported by"}</p>
                    <ul>
                      {(v.st.also || []).map((a, aI) => (<li key={aI}><a href={a.link} target={"_blank"} rel={"noopener noreferrer"}><b>{a.source}</b>{": " + a.title}</a></li>))}
                    </ul>
                  </div>) : null}
                </section>
              </>) : null}
              {v.st.hasMore ? (<section className={"ak-moresec"} aria-label={"More about this story"}>
                <button type={"button"} className={"ak-morebtn"} onClick={v.st.toggleMore} aria-expanded={v.st.more ? "true" : "false"} aria-controls={"ak-more"}>
                  <span className={"ak-mtxt"}><b>{v.st.more ? "Less" : "More"}</b><small>{"Key points, why it matters, word meanings"}</small></span>
                  <svg viewBox={"0 0 24 24"} width={"26"} height={"26"} aria-hidden={"true"} className={"ak-chev"}><path d={"M6 9l6 6 6-6"} fill={"none"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={css("stroke:currentColor")} /></svg>
                </button>
                <div id={"ak-more"} className={"ak-more" + (v.st.more ? " on" : "")} inert={!v.st.more}>
                  <div className={"ak-moreIn"}>
              <section className={"ak-mi"} style={{ ...css("border-top:3px solid var(--ink);padding-top:18px;margin-bottom:34px"), '--i': 0 }} aria-labelledby={"l1"}>
                <h2 id={"l1"} className={"pg-disp"} style={css("display:flex;align-items:center;gap:12px;font-weight:800;font-size:34px;margin:0 0 16px")}>
                  <span aria-hidden={"true"} style={css("width:44px;height:44px;border-radius:50%;background:#FFD400;color:#000;display:inline-flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;font-family:Anek Bangla,sans-serif")}>
                    {"1"}
                  </span>
                  {v.s.quickTitle}
                </h2>
                <ul style={css("margin:0;padding-left:22px;display:flex;flex-direction:column;gap:10px;font-size:21px;line-height:1.5")}>
                  {(v.s.quick || []).map((q, qI) => (<React.Fragment key={qI}>
                    <li>
                      {q}
                    </li>
                  </React.Fragment>))}
                </ul>
              </section>
              {v.hasWhy ? (<>
              <section className={"ak-mi"} style={{ ...css("border-top:3px solid var(--ink);padding-top:18px;margin-bottom:34px"), '--i': 1 }} aria-labelledby={"l2"}>
                <h2 id={"l2"} className={"pg-disp"} style={css("display:flex;align-items:center;gap:12px;font-weight:800;font-size:34px;margin:0 0 16px")}>
                  <span aria-hidden={"true"} style={css("width:44px;height:44px;border-radius:50%;background:var(--ink);color:var(--bg);display:inline-flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;font-family:Anek Bangla,sans-serif")}>
                    {"2"}
                  </span>
                  {"Why should I care?"}
                </h2>
                <blockquote style={css("position:relative;margin:0;padding:6px 0 6px 64px;font-size:26px;line-height:1.5;font-weight:600")}>
                  <span aria-hidden={"true"} className={"pg-disp"} style={css("position:absolute;left:0;top:-18px;font-weight:800;font-size:110px;line-height:1;color:var(--accent2)")}>
                    {"“"}
                  </span>
                  {v.s.why}
                </blockquote>
              </section>
              </>) : null}
              {v.hasTerms ? (<>
                <section className={"ak-mi"} style={{ ...css("border-top:3px solid var(--ink);padding-top:18px;margin-bottom:34px"), '--i': 2 }} aria-labelledby={"l4"}>
                  <h2 id={"l4"} className={"pg-disp"} style={css("display:flex;align-items:center;gap:12px;font-weight:800;font-size:34px;margin:0 0 16px")}>
                    <span aria-hidden={"true"} style={css("width:44px;height:44px;border-radius:50%;background:#D21F14;color:#FFF;display:inline-flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;font-family:Anek Bangla,sans-serif")}>
                      {"3"}
                    </span>
                    {"Words to know"}
                  </h2>
                  <dl className={"fz-terms"}>
                    {(v.s.terms || []).map((t, tI) => (<div key={tI}>
                      <dt>{t.term}</dt>
                      <dd>{t.meaning}</dd>
                    </div>))}
                  </dl>
                </section>
              </>) : null}
              {v.isSample ? (<>
              <section className={"ak-mi"} style={{ ...css("border-top:3px solid var(--ink);padding-top:18px;margin-bottom:34px"), '--i': 3 }} aria-labelledby={"l3"}>
                <h2 id={"l3"} className={"pg-disp"} style={css("display:flex;align-items:center;gap:12px;font-weight:800;font-size:34px;margin:0 0 20px")}>
                  <span aria-hidden={"true"} style={css("width:44px;height:44px;border-radius:50%;background:#D21F14;color:#FFF;display:inline-flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;font-family:Anek Bangla,sans-serif")}>
                    {"3"}
                  </span>
                  {"The full story"}
                </h2>
                <h3 style={css("font-size:20px;margin:0 0 12px")}>
                  {"How we got here"}
                </h3>
                <ol style={css("list-style:none;margin:0 0 30px;padding:0;border-left:3px solid var(--line)")}>
                  {(v.s.timeline || []).map((t, tI) => (<React.Fragment key={tI}>
                    <li style={css("position:relative;padding:0 0 18px 26px")}>
                      <span aria-hidden={"true"} style={css("position:absolute;left:-9px;top:6px;width:15px;height:15px;border-radius:50%;background:#D21F14;border:3px solid var(--bg)")} />
                      <p style={css("margin:0 0 2px;font-weight:700;font-size:19px")}>
                        {t.t}
                      </p>
                      <p style={css("margin:0;font-size:18px;line-height:1.5;color:var(--muted)")}>
                        {t.d}
                      </p>
                    </li>
                  </React.Fragment>))}
                </ol>
                <div className={"pg-two"} style={css("margin-bottom:30px")}>
                  <div style={css("background:var(--panel);border:2px solid var(--line);border-radius:16px;padding:20px")}>
                    <h3 style={css("font-size:19px;margin:0 0 10px;color:#00924A")}>
                      {"What we know"}
                    </h3>
                    <ul style={css("margin:0;padding-left:20px;display:flex;flex-direction:column;gap:8px;font-size:18px;line-height:1.45")}>
                      {(v.s.known || []).map((k, kI) => (<React.Fragment key={kI}>
                        <li>
                          {k}
                        </li>
                      </React.Fragment>))}
                    </ul>
                  </div>
                  <div style={css("background:var(--panel);border:2px dashed var(--line);border-radius:16px;padding:20px")}>
                    <h3 style={css("font-size:19px;margin:0 0 10px;color:var(--accent2)")}>
                      {"Still developing"}
                    </h3>
                    <ul style={css("margin:0;padding-left:20px;display:flex;flex-direction:column;gap:8px;font-size:18px;line-height:1.45")}>
                      {(v.s.developing || []).map((d, dI) => (<React.Fragment key={dI}>
                        <li>
                          {d}
                        </li>
                      </React.Fragment>))}
                    </ul>
                  </div>
                </div>
                <h3 style={css("font-size:20px;margin:0 0 10px")}>
                  {"Sources"}
                </h3>
                <p style={css("margin:0;font-size:17px;line-height:1.5;color:var(--muted)")}>
                  {"This is a sample explainer, written to show the format. Reviewed explainers will list and link every original report here. For real, sourced reporting right now, see "}
                  <a href={"/"} onClick={v.goLive}>
                    {"Live headlines"}
                  </a>
                  {"."}
                </p>
              </section>
              </>) : null}
                  </div>
                </div>
              </section>) : null}
              <section aria-labelledby={"rel-h"} style={css("margin-bottom:34px")}>
                <h2 id={"rel-h"} className={"pg-disp"} style={css("font-weight:800;font-size:32px;margin:0 0 14px")}>
                  {"Keep exploring"}
                </h2>
                <div className={"fz-rel"}>
                  {(v.related || []).map((r, rI) => (<React.Fragment key={rI}>
                    <a className={"fz-relc"} href={r.href} onClick={r.open} style={css(`border-top:6px solid ${r.color}`)}>
                      <img src={r.img} alt={""} width={"400"} height={"260"} loading={"lazy"} />
                      <span style={css("font-weight:600;font-size:14px;color:var(--muted)")}>
                        {`${r.cat}, ${r.time}`}
                      </span>
                      <span className={"pg-disp"} style={css("font-weight:800;font-size:22px;line-height:1.1")}>
                        {r.title}
                      </span>
                    </a>
                  </React.Fragment>))}
                </div>
              </section>
              <button type={"button"} className={"pg-btn"} onClick={v.next} style={css("width:100%;text-align:left;font-family:inherit;color:var(--ink);background:var(--panel);border:2px solid var(--ink);border-radius:20px;padding:22px 24px;cursor:pointer")}>
                <span style={css("display:block;font-weight:600;font-size:16px;color:var(--muted)")}>
                  {v.nextLabel}
                </span>
                <span className={"pg-disp"} style={css("display:block;font-weight:800;font-size:32px;line-height:1.05")}>
                  {v.nextTitle}
                </span>
              </button>
            </div>
          </>) : null}
          {v.vAll ? (<>
            <div className={v.pageClass} style={css("max-width:1000px;margin:0 auto;padding:20px 32px 90px")}>
              <h1 className={"pg-h1 pg-disp"} style={css("font-weight:800;font-size:96px;line-height:.95;margin:0 0 10px")}>
                {"All stories"}
              </h1>
              <p style={css("margin:0 0 30px;font-size:20px;color:var(--muted);max-width:620px;line-height:1.5")}>
                {v.allIntro}
              </p>
              {v.gone ? <p role={"status"} className={"fz-gone"}>{"That headline has rolled off the live list. Here is everything that is live now."}</p> : null}
              <div style={css("display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:30px")}>
                <label htmlFor={"pg-search"} style={css("position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)")}>
                  {"Search stories"}
                </label>
                <input id={"pg-search"} type={"search"} placeholder={"Search stories"} value={v.q} onChange={v.onSearch} style={css("flex:1 1 260px;min-width:0;font-family:inherit;font-size:18px;padding:12px 16px;border-radius:12px;border:2px solid var(--line);background:var(--panel);color:var(--ink)")} />
                <div role={"group"} aria-label={"Filter by section"} style={css("display:flex;gap:8px;flex-wrap:wrap")}>
                  {(v.chips || []).map((c, cI) => (<React.Fragment key={cI}>
                    <button type={"button"} className={"pg-btn"} onClick={c.go} aria-pressed={c.on} style={css(c.style)}>
                      {c.name}
                    </button>
                  </React.Fragment>))}
                </div>
              </div>
              {(v.groups || []).map((gr, grI) => (<React.Fragment key={grI}>
                <section style={css("margin-bottom:36px")}>
                  <h2 className={"pg-disp"} style={css("font-weight:800;font-size:34px;margin:0 0 6px;border-top:3px solid var(--ink);padding-top:14px")}>
                    {gr.day}
                  </h2>
                  <ul style={css("list-style:none;margin:0;padding:0")}>
                    {(gr.items || []).map((it, itI) => (<React.Fragment key={itI}>
                      <li style={css("border-bottom:1px solid var(--line)")}>
                        <a href={it.href} onClick={it.open} style={css("display:flex;gap:16px;align-items:flex-start;padding:18px 0;text-decoration:none")}>
                          <img className={"fz-thumb"} src={it.img} alt={""} width={"400"} height={"260"} loading={"lazy"} style={css(`border-left:5px solid ${it.color}`)} />
                          <span style={css("flex:1;min-width:0")}>
                            <span style={css("display:block;font-weight:600;font-size:15px;color:var(--muted)")}>
                              {`${it.cat}, ${it.time}`}
                            </span>
                            <span className={"pg-disp"} style={css("display:block;font-weight:800;font-size:28px;line-height:1.08;margin:2px 0 4px")}>
                              {it.title}
                            </span>
                            <span style={css("display:block;font-size:18px;line-height:1.45;color:var(--muted)")}>
                              {it.brief}
                            </span>
                          </span>
                        </a>
                      </li>
                    </React.Fragment>))}
                  </ul>
                </section>
              </React.Fragment>))}
              {v.none ? (<>
                <div role={"status"} style={css("border:2px dashed var(--line);border-radius:18px;padding:34px;text-align:center")}>
                  <p style={css("margin:0 0 12px;font-size:20px")}>
                    {`No stories match "${v.q}" in ${v.filterName}.`}
                  </p>
                  <button type={"button"} className={"pg-btn"} onClick={v.clear} style={css("font-family:inherit;font-weight:700;font-size:17px;padding:11px 18px;border-radius:12px;border:0;background:var(--ink);color:var(--bg);cursor:pointer")}>
                    {"Clear search and filters"}
                  </button>
                </div>
              </>) : null}
              <p style={css("margin:10px 0 0;font-size:15px;color:var(--muted)")}>
                {"Sample stories for this design preview."}
              </p>
            </div>
          </>) : null}
          {v.vAbout ? (<>
            <div className={v.pageClass} style={css("max-width:1000px;margin:0 auto;padding:20px 32px 90px")}>
              <h1 className={"pg-h1 pg-disp"} style={css("font-weight:800;font-size:96px;line-height:.95;margin:0 0 14px")}>
                {"How we work"}
              </h1>
              <p style={css("margin:0 0 44px;font-size:22px;line-height:1.5;max-width:680px")}>
                {"AJKER "}
                <span lang={"bn"}>
                  {"খবর"}
                </span>
                {" KI? explains the news for people who skip the newspaper. We don't do our own reporting. We read what trusted publishers report, explain it in plain words, and always send you back to them."}
              </p>
              <section aria-labelledby={"pick-h"} style={css("border-top:3px solid var(--ink);padding-top:16px;margin-bottom:44px")}>
                <h2 id={"pick-h"} className={"pg-disp"} style={css("font-weight:800;font-size:40px;margin:0 0 14px")}>
                  {"How we pick five stories"}
                </h2>
                <p style={css("margin:0;font-size:20px;line-height:1.55;max-width:760px")}>
                  {"Every morning editors read the day's headlines from Bangladesh and around the world, then pick the five that matter most to your life here. Not the loudest five, and not an endless feed."}
                </p>
              </section>
              <section aria-labelledby={"layers-h"} style={css("border-top:3px solid var(--ink);padding-top:16px;margin-bottom:44px")}>
                <h2 id={"layers-h"} className={"pg-disp"} style={css("font-weight:800;font-size:40px;margin:0 0 18px")}>
                  {"Every story has three layers"}
                </h2>
                <ol className={"pg-three"} style={css("list-style:none;margin:0;padding:0")}>
                  <li style={css("background:var(--panel);border:2px solid var(--line);border-radius:18px;padding:22px")}>
                    <span aria-hidden={"true"} lang={"bn"} style={css("width:44px;height:44px;margin-bottom:12px;border-radius:50%;background:#FFD400;color:#000;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:24px")}>
                      {"১"}
                    </span>
                    <h3 className={"pg-disp"} style={css("font-weight:800;font-size:26px;margin:0 0 6px")}>
                      {"The quick read"}
                    </h3>
                    <p style={css("margin:0;font-size:18px;line-height:1.5;color:var(--muted)")}>
                      {"What happened and who is involved, in about a minute."}
                    </p>
                  </li>
                  <li style={css("background:var(--panel);border:2px solid var(--line);border-radius:18px;padding:22px")}>
                    <span aria-hidden={"true"} lang={"bn"} style={css("width:44px;height:44px;margin-bottom:12px;border-radius:50%;background:#1A1714;color:#FFF;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:24px")}>
                      {"২"}
                    </span>
                    <h3 className={"pg-disp"} style={css("font-weight:800;font-size:26px;margin:0 0 6px")}>
                      {"Why should I care?"}
                    </h3>
                    <p style={css("margin:0;font-size:18px;line-height:1.5;color:var(--muted)")}>
                      {"How it touches your money, studies, commute or family."}
                    </p>
                  </li>
                  <li style={css("background:var(--panel);border:2px solid var(--line);border-radius:18px;padding:22px")}>
                    <span aria-hidden={"true"} lang={"bn"} style={css("width:44px;height:44px;margin-bottom:12px;border-radius:50%;background:#D21F14;color:#FFF;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:24px")}>
                      {"৩"}
                    </span>
                    <h3 className={"pg-disp"} style={css("font-weight:800;font-size:26px;margin:0 0 6px")}>
                      {"The full story"}
                    </h3>
                    <p style={css("margin:0;font-size:18px;line-height:1.5;color:var(--muted)")}>
                      {"Timeline, what we know, what's still developing, and every source."}
                    </p>
                  </li>
                </ol>
              </section>
              <section aria-labelledby={"std-h"} style={css("border-top:3px solid var(--ink);padding-top:16px;margin-bottom:44px")}>
                <h2 id={"std-h"} className={"pg-disp"} style={css("font-weight:800;font-size:40px;margin:0 0 16px")}>
                  {"Our standards"}
                </h2>
                <ul style={css("list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px;font-size:20px;line-height:1.45")}>
                  {(v.standards || []).map((t, tI) => (<React.Fragment key={tI}>
                    <li style={css("display:flex;gap:14px;align-items:flex-start;border-bottom:1px solid var(--line);padding-bottom:12px")}>
                      <svg viewBox={"0 0 24 24"} width={"24"} height={"24"} aria-hidden={"true"} style={css("flex:none;margin-top:3px")}>
                        <path d={"M4 12.5l5 5L20 6.5"} fill={"none"} strokeWidth={"3"} strokeLinecap={"round"} strokeLinejoin={"round"} style={css("stroke:var(--accent2)")} />
                      </svg>
                      <span>
                        {t}
                      </span>
                    </li>
                  </React.Fragment>))}
                </ul>
              </section>
              <section aria-labelledby={"fix-h"} style={css("background:var(--panel);border:2px solid var(--line);border-radius:20px;padding:26px;margin-bottom:44px")}>
                <h2 id={"fix-h"} className={"pg-disp"} style={css("font-weight:800;font-size:34px;margin:0 0 8px")}>
                  {"Spotted a mistake?"}
                </h2>
                <p style={css("margin:0 0 14px;font-size:19px;line-height:1.5")}>
                  {"Tap the button and tell us what looks wrong. When we correct a story, the correction is written on the story itself, with the date, so you can see what changed."}
                </p>
                <button type={"button"} className={"fz-dykbtn"} onClick={v.reportSite}>{"Report a mistake"}</button>
              </section>
              <section aria-labelledby={"faq-h"} style={css("border-top:3px solid var(--ink);padding-top:16px")}>
                <h2 id={"faq-h"} className={"pg-disp"} style={css("font-weight:800;font-size:40px;margin:0 0 10px")}>
                  {"Questions"}
                </h2>
                {(v.faq || []).map((f, fI) => (<React.Fragment key={fI}>
                  <div style={css("border-bottom:1px solid var(--line)")}>
                    <h3 style={css("margin:0")}>
                      <button type={"button"} onClick={f.toggle} aria-expanded={f.exp} style={css("width:100%;display:flex;justify-content:space-between;align-items:center;gap:16px;text-align:left;font-family:inherit;font-weight:700;font-size:21px;padding:18px 0;border:0;background:transparent;color:var(--ink);cursor:pointer")}>
                        <span>
                          {f.q}
                        </span>
                        <span aria-hidden={"true"} style={css(`font-size:26px;line-height:1;transition:transform 220ms ease;transform:rotate(${f.rot}deg)`)}>
                          {"+"}
                        </span>
                      </button>
                    </h3>
                    {f.open ? (<>
                      <p className={"pg-faq-a"} style={css("margin:0 0 18px;font-size:19px;line-height:1.55;color:var(--muted);max-width:760px")}>
                        {f.a}
                      </p>
                    </>) : null}
                  </div>
                </React.Fragment>))}
              </section>
            </div>
          </>) : null}
          <div className={"fz-strip"} aria-hidden={"true"}>
            <svg viewBox={"0 0 1440 110"} preserveAspectRatio={"none"} style={css("position:absolute;inset:0;width:100%;height:100%")}>
              <path d={"M0 38 Q720 76 1440 52"} fill={"none"} strokeWidth={"2"} style={css("stroke:var(--ink)")} opacity={".35"} />
              <path d={"M0 50 Q620 90 1440 48"} fill={"none"} strokeWidth={"1.5"} style={css("stroke:var(--ink)")} opacity={".22"} />
              <path d={"M0 58 Q820 66 1440 54"} fill={"none"} strokeWidth={"1.5"} style={css("stroke:var(--ink)")} opacity={".2"} />
            </svg>
            <div style={css("position:absolute;left:14.0%;top:21px;transform:scaleX(-1);opacity:.7")}>
              <svg className={"np3-crow"} viewBox={"0 0 34 26"} width={"34"} height={"26"} style={css("animation-delay:-2s")}>
                <path d={"M4 16 Q8 8 18 8 Q22 3 27 5 L33 7 L28 9 Q27 14 22 17 L14 19 L9 25 L9 19 Q5 19 4 16 Z"} style={css("fill:var(--ink)")} />
                <path d={"M16 18 L16 26 M20 17 L20 26"} strokeWidth={"1.5"} style={css("stroke:var(--ink)")} />
              </svg>
            </div>
            <div style={css("position:absolute;left:33.0%;top:30px;transform:scaleX(1);opacity:.7")}>
              <svg className={"np3-crow"} viewBox={"0 0 34 26"} width={"34"} height={"26"} style={css("animation-delay:-5s")}>
                <path d={"M4 16 Q8 8 18 8 Q22 3 27 5 L33 7 L28 9 Q27 14 22 17 L14 19 L9 25 L9 19 Q5 19 4 16 Z"} style={css("fill:var(--ink)")} />
                <path d={"M16 18 L16 26 M20 17 L20 26"} strokeWidth={"1.5"} style={css("stroke:var(--ink)")} />
              </svg>
            </div>
            <div style={css("position:absolute;left:58.0%;top:35px;transform:scaleX(-1);opacity:.7")}>
              <svg className={"np3-crow"} viewBox={"0 0 34 26"} width={"34"} height={"26"} style={css("animation-delay:-8s")}>
                <path d={"M4 16 Q8 8 18 8 Q22 3 27 5 L33 7 L28 9 Q27 14 22 17 L14 19 L9 25 L9 19 Q5 19 4 16 Z"} style={css("fill:var(--ink)")} />
                <path d={"M16 18 L16 26 M20 17 L20 26"} strokeWidth={"1.5"} style={css("stroke:var(--ink)")} />
              </svg>
            </div>
            <div style={css("position:absolute;left:80.0%;top:33px;transform:scaleX(1);opacity:.7")}>
              <svg className={"np3-crow"} viewBox={"0 0 34 26"} width={"34"} height={"26"} style={css("animation-delay:-2s")}>
                <path d={"M4 16 Q8 8 18 8 Q22 3 27 5 L33 7 L28 9 Q27 14 22 17 L14 19 L9 25 L9 19 Q5 19 4 16 Z"} style={css("fill:var(--ink)")} />
                <path d={"M16 18 L16 26 M20 17 L20 26"} strokeWidth={"1.5"} style={css("stroke:var(--ink)")} />
              </svg>
            </div>
          </div>
        </main>
        <footer style={css("border-top:1px solid var(--line)")}>
          <div style={css("max-width:1240px;margin:0 auto;padding:24px 32px;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-size:16px;color:var(--muted)")}>
            <span>
              {"AJKER "}
              <span lang={"bn"}>
                {"খবর"}
              </span>
              {" KI? News explained for people who skip the newspaper."}
            </span>
            <span className={"ak-foot"}>
              <a href={"/about"} onClick={v.goFaq}>{"FAQ"}</a>
              <button type={"button"} className={"ak-link"} onClick={v.reportSite}>{"Report a mistake"}</button>
              <span>{"Picked up and dropped off in Dhaka"}</span>
            </span>
          </div>
        </footer>
      </div>
      {v.rep.open ? (<div className={"ak-sheet-wrap"}>
        <div className={"ak-scrim"} onClick={v.rep.close} aria-hidden={"true"} />
        <form className={"ak-sheet"} role={"dialog"} aria-modal={"true"} aria-labelledby={"rep-h"} onSubmit={v.rep.send}>
          {v.rep.done ? (<div className={"ak-sent"} role={"status"}>
            <svg viewBox={"0 0 48 48"} width={"64"} height={"64"} aria-hidden={"true"}><circle cx={"24"} cy={"24"} r={"21"} fill={"none"} strokeWidth={"3"} style={css("stroke:#00924A")} className={"ak-ring"} /><path d={"M14 25l7 7 13-15"} fill={"none"} strokeWidth={"4"} strokeLinecap={"round"} strokeLinejoin={"round"} style={css("stroke:#00924A")} className={"ak-tick"} /></svg>
            <p className={"np3-disp"}>{"Thanks. We will check it."}</p>
          </div>) : (<>
            <h2 id={"rep-h"} className={"np3-disp"}>{"Report a mistake"}</h2>
            {v.rep.title ? <p className={"ak-rt"}>{v.rep.title}</p> : null}
            <div role={"group"} aria-label={"What is wrong"} className={"ak-kinds"}>
              {(v.rep.kinds || []).map((k, kI) => (<button key={kI} type={"button"} className={"pg-btn ak-kind"} aria-pressed={k.on} onClick={k.go}>{k.label}</button>))}
            </div>
            <label htmlFor={"rep-note"}>{"What looks wrong? (optional)"}</label>
            <textarea id={"rep-note"} autoFocus rows={3} maxLength={600} value={v.rep.note} onChange={v.rep.onNote} placeholder={"For example: the number is different in the original report."} />
            {v.rep.error ? <p role={"alert"} className={"ak-err"}>{"Could not send. Check your connection and try again."}</p> : null}
            <div className={"ak-sheet-btns"}>
              <button type={"button"} className={"fz-dykbtn fz-dykbtn2"} onClick={v.rep.close}>{"Cancel"}</button>
              <button type={"submit"} className={"fz-dykbtn"} disabled={v.rep.sending || !v.rep.canSend}>{v.rep.sending ? "Sending" : "Send report"}</button>
            </div>
          </>)}
        </form>
      </div>) : null}
      <Extras d={v.extras} />
      <div className={"ak-toast" + (v.toastOn ? " on" : "")} role={"status"} aria-live={"polite"}>{v.toast}</div>
    </div>
  </>);
}
