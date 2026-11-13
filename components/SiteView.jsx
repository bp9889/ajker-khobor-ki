// The whole page layout. `v` holds the values and handlers from Site.jsx (renderVals).
import React from 'react';
import { css } from '../lib/css';

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
                        {"from Dhaka."}
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
                  {"People are waiting at the bus stands with questions about the news. Stop and pick them up, and each passenger brings a story explained. Not in the mood to ride? Close the game and just read."}
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
              <section aria-labelledby={"pics-h"} style={css("max-width:1240px;margin:0 auto;padding:56px 32px 0")}>
                <div style={css("display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap;border-top:3px solid var(--ink);padding-top:16px;margin-bottom:26px")}>
                  <h2 id={"pics-h"} className={"np3-disp"} style={css("font-weight:800;font-size:56px;line-height:1;margin:0")}>
                    {"Today in pictures"}
                  </h2>
                  <span style={css("font-weight:600;font-size:17px;color:var(--muted)")}>
                    {v.picsNote}
                  </span>
                </div>
                <div className={"fz-pics"}>
                  {(v.pics || []).map((pc, pcI) => (<React.Fragment key={pcI}>
                    <a className={"fz-pic"} href={pc.href} onClick={pc.open}>
                      <img src={pc.img} alt={""} width={"400"} height={"260"} />
                      <span style={css(`display:flex;flex-direction:column;gap:6px;padding:16px 18px 20px;border-top:6px solid ${pc.color}`)}>
                        <span style={css("font-weight:600;font-size:15px;color:var(--muted)")}>
                          {`${pc.cat}, ${pc.from}`}
                        </span>
                        <span className={"np3-disp"} style={css("font-weight:800;font-size:26px;line-height:1.06")}>
                          {pc.title}
                        </span>
                        <span style={css("font-size:17px;line-height:1.45;color:var(--muted)")}>
                          {pc.brief}
                        </span>
                      </span>
                    </a>
                  </React.Fragment>))}
                </div>
              </section>
              {v.hasLive ? (<>
                <section aria-labelledby={"live-h"} style={css("max-width:1240px;margin:0 auto;padding:56px 32px 0")}>
                  <div style={css("display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap;border-top:3px solid var(--ink);padding-top:16px;margin-bottom:14px")}>
                    <h2 id={"live-h"} className={"np3-disp"} style={css("font-weight:800;font-size:56px;line-height:1;margin:0")}>
                      <span className={"fz-livedot"} aria-hidden={"true"} />
                      {"Live headlines"}
                    </h2>
                    <span style={css("font-weight:600;font-size:17px;color:var(--muted)")}>
                      {"Tap a headline for the simple version. The original report is linked at the end."}
                    </span>
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
                            {h.read ? <span className={"fz-readtag"}>{h.read}</span> : null}
                          </span>
                        </span>
                      </a>
                    </React.Fragment>))}
                  </div>
                </section>
              </>) : null}
              <section aria-labelledby={"ride-h"} aria-live={"polite"} style={css("max-width:1240px;margin:0 auto;padding:56px 32px 70px")}>
                <div style={css("display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap;border-top:3px solid var(--ink);padding-top:16px;margin-bottom:26px")}>
                  <h2 id={"ride-h"} className={"np3-disp"} style={css("font-weight:800;font-size:56px;line-height:1;margin:0")}>
                    {"On board"}
                  </h2>
                  <span style={css("font-weight:600;font-size:17px;color:var(--muted)")}>
                    {`${v.pickedCount} passengers picked up today`}
                  </span>
                </div>
                {v.empty ? (<>
                  <p style={css("margin:0;padding:36px;border:2px dashed var(--line);border-radius:20px;font-size:22px;text-align:center;color:var(--muted)")}>
                    {"No one on board yet. Stop at the first bus stand and someone with a question will hop on."}
                  </p>
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
                      {"Earlier passengers"}
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
                <p style={css("margin:30px 0 0;font-size:15px;color:var(--muted)")}>
                  {"The five explainers are samples that show the format. Live headlines come straight from publishers' feeds."}
                </p>
              </section>
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
                    <button type={"button"} className={"fz-topic"} onClick={t.go} style={css(`background:${t.color};color:${t.fg}`)}>
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
              <section aria-labelledby={"quiz-h"} style={css("max-width:1240px;margin:0 auto;padding:10px 32px 70px")}>
                <div style={css("display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap;border-top:3px solid var(--ink);padding-top:16px;margin-bottom:22px")}>
                  <h2 id={"quiz-h"} className={"np3-disp"} style={css("font-weight:800;font-size:56px;line-height:1;margin:0")}>
                    {"Quick check"}
                  </h2>
                  <span style={css("font-weight:600;font-size:17px;color:var(--muted)")}>
                    {v.quizMeta}
                  </span>
                </div>
                <div className={"np3-quiz"}>
                  {(v.quiz || []).map((qz, qzI) => (<React.Fragment key={qzI}>
                    <fieldset style={css("margin:0;background:var(--panel);border:2px solid var(--line);border-radius:18px;padding:20px 22px;min-width:0")}>
                      <legend style={css("float:left;width:100%;padding:0;margin:0 0 14px;font-weight:700;font-size:20px;line-height:1.35")}>
                        <span className={"fz-topicchip"}>{qz.topic}</span>
                        {qz.q}
                      </legend>
                      <div style={css("display:flex;flex-direction:column;gap:8px;clear:both")}>
                        {(qz.opts || []).map((op, opI) => (<React.Fragment key={opI}>
                          <button type={"button"} className={"np3-chip"} onClick={op.pick} aria-pressed={op.picked} disabled={op.locked} style={css(op.style)}>
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
                    </fieldset>
                  </React.Fragment>))}
                </div>
              </section>
              <section aria-labelledby={"how-h"} style={css("max-width:1240px;margin:0 auto;padding:30px 32px 70px")}>
                <h2 id={"how-h"} className={"np3-disp"} style={css("font-weight:800;font-size:56px;line-height:1;margin:0 0 30px;border-top:3px solid var(--ink);padding-top:16px")}>
                  {"How one story plays"}
                </h2>
                <ol className={"np3-steps"} style={css("list-style:none;margin:0;padding:0")}>
                  {(v.steps || []).map((st, stI) => (<React.Fragment key={stI}>
                    <li style={css("background:var(--panel);border:2px solid var(--line);border-radius:18px;padding:24px")}>
                      <span aria-hidden={"true"} lang={"bn"} style={css(`width:54px;height:54px;margin-bottom:14px;border-radius:50%;background:${st.color};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:28px;color:${st.fg};line-height:1`)}>
                        {st.num}
                      </span>
                      <h3 className={"np3-disp"} style={css("font-weight:800;font-size:28px;margin:0 0 6px")}>
                        {st.title}
                      </h3>
                      <p style={css("margin:0;font-size:18px;line-height:1.5;color:var(--muted)")}>
                        {st.text}
                      </p>
                    </li>
                  </React.Fragment>))}
                </ol>
              </section>
              <section aria-labelledby={"trust-h"} style={css("max-width:1240px;margin:0 auto;padding:30px 32px 70px")}>
                <h2 id={"trust-h"} className={"np3-disp"} style={css("font-weight:800;font-size:44px;line-height:1.05;margin:0 0 20px;border-top:3px solid var(--ink);padding-top:16px")}>
                  {"You can always see where it came from"}
                </h2>
                <ul style={css("list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px;font-size:20px;line-height:1.45")}>
                  {(v.trust || []).map((t, tI) => (<React.Fragment key={tI}>
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
              {v.even ? (<>
                <div className={"pg-in"}>
                  <img className={"fz-hero"} src={v.heroImg} alt={v.heroAlt} width={"400"} height={"260"} />
                  <p style={css("margin:0 0 12px")}>
                    <span style={css(`display:inline-block;background:${v.s.color};color:#FFFFFF;font-weight:700;font-size:15px;border-radius:999px;padding:4px 12px`)}>
                      {v.s.cat}
                    </span>
                  </p>
                  <h1 className={"pg-h1 pg-disp"} style={css("font-weight:800;font-size:84px;line-height:.95;margin:0 0 16px")}>
                    {v.s.title}
                  </h1>
                  <p style={css("margin:0 0 36px;font-size:17px;color:var(--muted)")}>
                    {v.storyMeta}
                  </p>
                  {v.hasSummary ? <p className={"fz-lead"}>{v.s.summary}</p> : null}
                </div>
              </>) : null}
              {v.odd ? (<>
                <div className={"pg-in"}>
                  <img className={"fz-hero"} src={v.heroImg} alt={v.heroAlt} width={"400"} height={"260"} />
                  <p style={css("margin:0 0 12px")}>
                    <span style={css(`display:inline-block;background:${v.s.color};color:#FFFFFF;font-weight:700;font-size:15px;border-radius:999px;padding:4px 12px`)}>
                      {v.s.cat}
                    </span>
                  </p>
                  <h1 className={"pg-h1 pg-disp"} style={css("font-weight:800;font-size:84px;line-height:.95;margin:0 0 16px")}>
                    {v.s.title}
                  </h1>
                  <p style={css("margin:0 0 36px;font-size:17px;color:var(--muted)")}>
                    {v.storyMeta}
                  </p>
                  {v.hasSummary ? <p className={"fz-lead"}>{v.s.summary}</p> : null}
                </div>
              </>) : null}
              <section aria-labelledby={"l1"} style={css("border-top:3px solid var(--ink);padding-top:18px;margin-bottom:40px")}>
                <h2 id={"l1"} className={"pg-disp"} style={css("display:flex;align-items:center;gap:12px;font-weight:800;font-size:34px;margin:0 0 16px")}>
                  <span aria-hidden={"true"} lang={"bn"} style={css("width:44px;height:44px;border-radius:50%;background:#FFD400;color:#000;display:inline-flex;align-items:center;justify-content:center;font-size:24px")}>
                    {"১"}
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
              <section aria-labelledby={"l2"} style={css("border-top:3px solid var(--ink);padding-top:18px;margin-bottom:40px")}>
                <h2 id={"l2"} className={"pg-disp"} style={css("display:flex;align-items:center;gap:12px;font-weight:800;font-size:34px;margin:0 0 16px")}>
                  <span aria-hidden={"true"} lang={"bn"} style={css("width:44px;height:44px;border-radius:50%;background:#1A1714;color:#FFF;display:inline-flex;align-items:center;justify-content:center;font-size:24px")}>
                    {"২"}
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
                <section aria-labelledby={"l4"} style={css("border-top:3px solid var(--ink);padding-top:18px;margin-bottom:40px")}>
                  <h2 id={"l4"} className={"pg-disp"} style={css("display:flex;align-items:center;gap:12px;font-weight:800;font-size:34px;margin:0 0 16px")}>
                    <span aria-hidden={"true"} lang={"bn"} style={css("width:44px;height:44px;border-radius:50%;background:#D21F14;color:#FFF;display:inline-flex;align-items:center;justify-content:center;font-size:24px")}>
                      {"৩"}
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
              <section aria-labelledby={"l3"} style={css("border-top:3px solid var(--ink);padding-top:18px;margin-bottom:40px")}>
                <h2 id={"l3"} className={"pg-disp"} style={css("display:flex;align-items:center;gap:12px;font-weight:800;font-size:34px;margin:0 0 20px")}>
                  <span aria-hidden={"true"} lang={"bn"} style={css("width:44px;height:44px;border-radius:50%;background:#D21F14;color:#FFF;display:inline-flex;align-items:center;justify-content:center;font-size:24px")}>
                    {"৩"}
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
              {v.isLive ? (<>
                <section aria-labelledby={"src-h"} className={"fz-src"}>
                  <h2 id={"src-h"} className={"pg-disp"} style={css("font-weight:800;font-size:30px;margin:0 0 8px")}>
                    {"Read the full story"}
                  </h2>
                  <p style={css("margin:0 0 16px;font-size:17px;line-height:1.5;color:var(--muted)")}>
                    {v.noAI ? "The simple version of this one arrives with the next update. Until then, here is the publisher's own report." : "This simple version was written by AI from the publisher's headline and short description, so it covers only the basics and can contain mistakes. The full details are in the original report."}
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
                </section>
              </>) : null}
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
                <p style={css("margin:0 0 6px;font-size:19px;line-height:1.5")}>
                  {"Tell us at "}
                  <a href={"#fix-h"}>
                    {"[your contact email]"}
                  </a>
                  {". When we correct a story, the correction is written on the story itself, with the date, so you can see what changed."}
                </p>
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
            <span>
              {"Picked up and dropped off in Dhaka"}
            </span>
          </div>
        </footer>
      </div>
    </div>
  </>);
}
