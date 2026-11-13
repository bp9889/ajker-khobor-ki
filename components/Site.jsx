"use client";
// All the behaviour of the site: pages, dark mode, the rickshaw game, quiz and live headlines.
// The layout itself is in SiteView.jsx. This file works out the values it shows.
import React from 'react';
import view from './SiteView';
import { STORIES } from '../data/stories';
import { pathFor, parsePath, titleFor, artFor } from '../lib/route';

class DCLogic extends React.Component {
  render() { return view(this.renderVals()); }
}

export default class Site extends DCLogic {
  constructor(props){
    super(props);
    this.state = { view: 'home', si: 0, f: 'all', q: '', liveF: 'all', gone: false, now: 0, faqOpen: 0, trN: 0, tr: 'none', dir: 1, read: [], dark: false, trDone: true, word: 0, phase: 'ambient', invite: true, answers: {}, onboard: -1, picked: [], flash: 0, best: 0, crashMsg: '', all: false, score: 0, rushBest: 0, overMsg: '', joined: false };
    // Open the story named in the address. If it is no longer on the live list, show all stories instead.
    const at = props.view === 'story' ? this.list().findIndex((s) => s.id === props.sid) : -1;
    this.state.view = props.view === 'story' && at < 0 ? 'all' : (props.view || 'home');
    this.state.si = Math.max(0, at); this.state.gone = props.view === 'story' && at < 0;
    this.RX = 190; this.GY = 300;
    this.g = this.fresh(); this.g.speed = 4;
    this.setCanvas = (el) => { if (el && el !== this.cv) { this.cv = el; this.loop(); } };
  }
  // The story list: live headlines (today's five first) when we have them, otherwise the built-in samples.
  list(){
    const D = this.props.digest;
    if (this._L) return this._L;
    const SC = { Bangladesh: '#00924A', World: '#D21F14', Tech: '#2F5BEA', Sport: '#F28C00' };
    let L;
    if (D && D.items && D.items.length >= 5) {
      L = D.items.map((x, i) => ({ id: x.id, live: true, hasAI: !!x.summary, cat: x.section, color: SC[x.section] || '#1A1714', title: x.headline || x.title, orig: x.title, time: '60 sec',
        summary: x.summary || '', quick: x.points && x.points.length ? x.points : (x.desc ? [x.desc] : []), quickTitle: x.summary ? 'The quick read' : "From the publisher's feed", why: x.why || '', terms: x.terms || [],
        link: x.link, source: x.source, date: x.date, art: x.tag, alt: 'Illustration for this story', brief: x.brief || (x.summary ? x.summary.split(/(?<=[.!?])\s/)[0] : '') || x.desc || '', deep: !!x.deep, ask: x.ask || '', day: i < 5 ? "Today's five" : 'More live headlines' }));
      const pin = STORIES.find((s) => s.slug === this.props.sid);
      if (pin) L.push(Object.assign({ id: pin.slug, quickTitle: 'The quick read' }, pin, { day: 'Sample explainers' }));
    } else L = STORIES.map((s) => Object.assign({ id: s.slug, quickTitle: 'The quick read' }, s));
    this._L = L; return L;
  }
  // The five passengers in the game are today's five stories.
  riders(){
    if (this._R) return this._R;
    const L = this.list();
    if (!L[0].live) { this._R = this.sampleRiders(); return this._R; }
    const two = (t) => { const w = String(t || 'What is this story about?').split(' '); let a = ''; while (w.length > 1 && (a + ' ' + w[0]).trim().length <= Math.max(10, Math.ceil(String(t).length / 2))) a = (a + ' ' + w.shift()).trim(); if (!a) a = w.shift(); return [a.slice(0, 20), w.join(' ').slice(0, 20)]; };
    this._R = L.slice(0, 5).map((s) => ({ ask: two(s.ask || s.title), cat: s.cat, color: s.color, title: s.title, brief: s.brief, why: s.why || 'Tap through for the simple version and the original report.', time: s.time }));
    return this._R;
  }
  sampleRiders(){ return [
    { ask:['Why are onions','so pricey again?'], cat:'Bangladesh', color:'#00924A', title:'Why are onion prices jumping again?', brief:'Imports, weather and hoarding all play a part. Here is how a kitchen staple ends up costing more.', why:'Onions are in almost every meal, so your family budget feels it within a week.', time:'60 sec', sources:'3 sources' },
    { ask:['Why does everyone','fight over chips?'], cat:'Tech', color:'#2F5BEA', title:'Why is everyone fighting over computer chips?', brief:'The tiny parts inside your phone now shape trade deals between superpowers.', why:'Chip supply decides what your next phone or laptop costs, and when it arrives.', time:'60 sec', sources:'3 sources' },
    { ask:['Will the ceasefire','actually hold?'], cat:'World', color:'#D21F14', title:'What does a ceasefire need to actually hold?', brief:'Signing is the easy part. Monitoring, aid and trust decide what happens next.', why:'Wars far away move fuel and food prices here, and many Bangladeshi workers live in the region.', time:'90 sec', sources:'4 sources' },
    { ask:['What does AQI','180 even mean?'], cat:'Bangladesh', color:'#00924A', title:"What does Dhaka's AQI number actually mean?", brief:'A score of 180 sounds abstract. Here is what it does to your lungs, and when to wear a mask.', why:'Above 150, a long ride through traffic does real damage. A good mask helps.', time:'60 sec', sources:'2 sources' },
    { ask:['How do football','transfers work?'], cat:'Sport', color:'#F28C00', title:'How does football transfer money work?', brief:'Fees, wages and add-ons: why a 100 million deal is never really 100 million.', why:'It explains why your club suddenly cannot afford anyone.', time:'60 sec', sources:'2 sources' }
  ]; }
  componentDidMount(){
    this.syncTheme();
    // Saved choices are read after the first paint so the server and browser render the same page.
    const dark = this.initDark(), read = this.initRead();
    if (dark !== this.state.dark || read.length) this.setState({ dark: dark, read: read });
    this.onPop = () => { const r = parsePath(window.location.pathname); if (!r) return; const at = r.view === 'story' ? this.list().findIndex((s) => s.id === r.sid) : 0; if (at < 0) this.go('all', { gone: true }, true); else this.go(r.view, r.view === 'story' ? { si: at } : {}, true); };
    window.addEventListener('popstate', this.onPop);
    this.setState({ now: Date.now() }); this.nowT = setInterval(() => this.setState({ now: Date.now() }), 60000);
    if (this.state.view === 'story') this.markRead(this.list()[this.state.si].id);
    this.reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!this.reduce) this.iv = setInterval(() => this.setState({ word: (this.state.word + 1) % 4 }), 2300);
    if (!this.cv && typeof document !== 'undefined') { const el = document.getElementById('np3-canvas'); if (el) { this.cv = el; this.loop(); } }
  }
  componentWillUnmount(){ this.unsyncTheme(); try { window.removeEventListener('popstate', this.onPop); } catch (e) {} this.dead = true; clearInterval(this.iv); clearInterval(this.nowT); clearTimeout(this.wt); if (this.raf) cancelAnimationFrame(this.raf); }
  rnd(a, b){ const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); }
  stopWx(k){ return 900 + k * 1300; }
  obstacles(x0, x1){
    const out = [], D = { pothole:[72,8], cone:[28,42], bricks:[52,32], dog:[64,28] }, T = ['pothole','cone','bricks','dog'];
    const k0 = Math.max(0, Math.floor((x0 - 900) / 1300) - 1), k1 = Math.floor((x1 - 900) / 1300) + 1;
    for (let k = k0; k <= k1; k++) for (let j = 0; j < 1; j++) {
      const wx = this.stopWx(k) + 480 + this.rnd(k, j) * 260, type = T[Math.floor(this.rnd(k, j + 5) * 4)];
      if (wx > x0 - 200 && wx < x1) out.push({ id: k + '-' + j, wx: wx, type: type, w: D[type][0], h: D[type][1] });
    }
    return out;
  }
  focusGame(){ if (this.cv && this.cv.parentNode && this.cv.parentNode.focus) { try { this.cv.parentNode.focus({ preventScroll: true }); } catch (e) {} } }
  fresh(){ return { x: 0, speed: 0, y: 0, vy: 0, pedal: false, brake: false, crashT: 0, last: 0, boarded: {}, gone: {}, board: null, bellT: -9999, mode: 'story', lightOn: true, lightNext: 0 }; }
  toAmbient(){ const x = this.g.x; this.g = this.fresh(); this.g.x = x; this.g.speed = 3; this.g.last = performance.now(); this.setState({ phase: 'ambient', invite: false }); }
  blocked(){ const p = this.state.phase; return p === 'crashed' || p === 'won' || p === 'over'; }
  start(){ if (this.state.phase === 'ambient') { this.g = this.fresh(); this.g.last = performance.now(); this.setState({ phase: 'playing', invite: false }); } this.focusGame(); }
  again(){
    const g = this.g, k = Math.floor((g.x + this.RX - 900) / 1300);
    g.x = k >= 0 ? this.stopWx(k) - this.RX - 160 : 0; g.speed = 0; g.y = 0; g.vy = 0; g.pedal = false; g.brake = false;
    this.setState({ phase: 'playing' }); this.focusGame();
  }
  jump(){ if (this.blocked()) return; this.start(); if (this.g.y <= 0.01) this.g.vy = this.g.mode === 'rush' ? 15.5 : 16.5; }
  startRush(){
    const g = this.g;
    Object.assign(g, { mode: 'rush', rushStart: g.x, speed: 6, y: 0, vy: 0, robs: [], nextObs: g.x + 700, cleared: 0, idc: 0, pedal: false, brake: false, rushT: performance.now(), last: performance.now() });
    this.setState({ phase: 'playing', score: 0 }); this.focusGame();
  }
  rushScore(){ const g = this.g; return Math.max(0, Math.floor((g.x - g.rushStart) / 10)) + g.cleared * 15; }
  ring(){
    if (this.blocked()) return; this.start();
    const g = this.g; g.bellT = performance.now();
    for (const o of (g.mode === 'rush' ? g.robs : this.obstacles(g.x, g.x + 900))) { const sx = o.wx - g.x; if (o.type === 'dog' && sx > this.RX && sx < this.RX + 600 && !g.gone[o.id]) g.gone[o.id] = performance.now(); }
    try {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      this.ac = this.ac || new AC(); const t0 = this.ac.currentTime;
      [0, 0.16].forEach((d) => { const o = this.ac.createOscillator(), gn = this.ac.createGain(); o.type = 'triangle'; o.frequency.value = 2100; gn.gain.setValueAtTime(0.0001, t0 + d); gn.gain.exponentialRampToValueAtTime(0.18, t0 + d + 0.01); gn.gain.exponentialRampToValueAtTime(0.0001, t0 + d + 0.14); o.connect(gn); gn.connect(this.ac.destination); o.start(t0 + d); o.stop(t0 + d + 0.16); });
    } catch (e) {}
  }
  crash(type){
    const g = this.g, m = Math.floor(g.x / 10), names = { pothole:'a pothole', cone:'a traffic cone', bricks:'a pile of bricks', dog:'a sleeping dog (try the bell next time)' };
    g.crashT = performance.now(); g.pedal = false;
    if (g.mode === 'rush') { const sc = this.rushScore(), best = Math.max(this.state.rushBest, sc); this.setState({ phase: 'over', score: sc, rushBest: best, overMsg: 'You hit ' + names[type].replace(' (try the bell next time)', '') + ' after clearing ' + g.cleared + ' obstacles. ' + (sc >= best && sc > 0 ? 'New best!' : 'Best: ' + best + ' points.') }); return; }
    this.setState({ phase: 'crashed', best: Math.max(this.state.best, m), crashMsg: 'You hit ' + names[type] + '. Your passengers are fine.' });
  }
  board(k){
    const g = this.g, r = k % 5; g.boarded[k] = true; g.board = { k: k, t: performance.now() };
    const picked = this.state.picked.indexOf(r) >= 0 ? this.state.picked : this.state.picked.concat([r]);
    this.setState({ onboard: r, picked: picked, flash: this.state.flash + 1 });
    if (Object.keys(g.boarded).length >= 5 && !g.wonShown) { g.wonShown = true; clearTimeout(this.wt); this.wt = setTimeout(() => { if (this.state.phase === 'playing') { g.pedal = false; this.setState({ phase: 'won' }); } }, 900); }
  }
  loop(){
    if (this.running) return; this.running = true;
    this.P = { hood: new Path2D('M122 86 Q118 22 172 18 Q202 20 204 86 Z'), s1: new Path2D('M131 86 Q130 34 172 30 Q194 32 195 86'), s2: new Path2D('M140 86 Q140 46 172 42 Q186 44 187 86'), frame: new Path2D('M42 136 L80 108 L160 108 L166 134'), bar: new Path2D('M80 108 L72 72 M60 72 L84 72'), torso: new Path2D('M78 46 L96 46 L100 84 L76 84 Z'), lungi: new Path2D('M76 84 L104 84 L106 100 L80 104 Z') };
    const frame = (now) => { if (this.dead) return; this.tick(now); this.raf = requestAnimationFrame(frame); };
    this.raf = requestAnimationFrame(frame);
  }
  pal(){ const cs = getComputedStyle(this.cv), v = (n, f) => cs.getPropertyValue(n).trim() || f; return { bg: v('--canvas','#FBF8F2'), ink: v('--ink','#1A1714'), muted: v('--muted','#5F574E'), bld: v('--bld','#E6DFD3'), win: v('--win','#FFD400'), road: v('--road','#2B2826'), panel: v('--panel','#FFFFFF') }; }
  drawRick(ctx, x, y, ang, wr){
    const P = this.P; ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(-0.62, 0.62); ctx.translate(-120, -160);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.fillStyle = '#000'; ctx.fill(P.hood); ctx.lineWidth = 5; ctx.strokeStyle = '#D21F14'; ctx.stroke(P.s1); ctx.strokeStyle = '#FFD400'; ctx.stroke(P.s2);
    ctx.fillStyle = '#D21F14'; ctx.fillRect(118, 84, 86, 28); ctx.lineWidth = 4; ctx.strokeStyle = '#000'; ctx.strokeRect(118, 84, 86, 28);
    ctx.fillStyle = '#FFD400'; ctx.fillRect(196, 74, 18, 44); ctx.strokeRect(196, 74, 18, 44);
    ctx.lineWidth = 6; ctx.stroke(P.frame); ctx.stroke(P.bar);
    ctx.fillStyle = '#F3EFE7'; ctx.fill(P.torso); ctx.lineWidth = 3.5; ctx.stroke(P.torso);
    ctx.fillStyle = '#00924A'; ctx.fill(P.lungi); ctx.stroke(P.lungi);
    ctx.fillStyle = '#8D5524'; ctx.beginPath(); ctx.arc(88, 34, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    const wheel = (cx, cy, r) => { ctx.lineWidth = 6; ctx.strokeStyle = '#000'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); ctx.lineWidth = 2.5; ctx.strokeStyle = '#9C958C'; for (let q = 0; q < 4; q++) { const a = wr + q * Math.PI / 4; ctx.beginPath(); ctx.moveTo(cx - Math.cos(a) * r, cy - Math.sin(a) * r); ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); ctx.stroke(); } };
    wheel(166, 134, 27); wheel(42, 138, 22); ctx.restore();
  }
  drawObs(ctx, o, sx, GY, ink){
    if (o.type === 'pothole') { ctx.fillStyle = '#0B0B0B'; ctx.beginPath(); ctx.ellipse(sx + o.w / 2, GY + 2, o.w / 2, 9, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#6B6259'; ctx.lineWidth = 2; ctx.stroke(); }
    if (o.type === 'cone') { ctx.fillStyle = '#F28C00'; ctx.beginPath(); ctx.moveTo(sx, GY); ctx.lineTo(sx + o.w / 2, GY - o.h); ctx.lineTo(sx + o.w, GY); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#000'; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = '#FFF'; ctx.fillRect(sx + 7, GY - 22, o.w - 14, 6); }
    if (o.type === 'bricks') { for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) { const bx = sx + c * 26 + (r % 2) * 6, by = GY - (r + 1) * 11; ctx.fillStyle = '#B23A1E'; ctx.fillRect(bx, by, 22, 10); ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.strokeRect(bx, by, 22, 10); } }
    if (o.type === 'dog') { ctx.fillStyle = '#B07A45'; ctx.strokeStyle = '#000'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(sx + 30, GY - 12, 28, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(sx + 56, GY - 16, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = ink; ctx.font = "700 18px 'Anek Bangla', sans-serif"; ctx.fillText('z', sx + 62, GY - 34); ctx.font = "700 13px 'Anek Bangla', sans-serif"; ctx.fillText('z', sx + 74, GY - 46); }
  }
  drawBack(ctx, P, dark, g, W, H, GY){
    ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = dark ? '#FFF6C2' : '#FFD400'; ctx.beginPath(); ctx.arc(880, 70, 36, 0, Math.PI * 2); ctx.fill();
    if (dark) { ctx.fillStyle = P.bg; ctx.beginPath(); ctx.arc(866, 62, 32, 0, Math.PI * 2); ctx.fill(); }
    const off = (g.x * 0.3) % 1200;
    for (let kk = -1; kk < 3; kk++) for (let b = 0; b < 12; b++) {
      const bx = Math.round(kk * 1200 + b * 100 - off), bh = 50 + ((b * 37) % 80);
      ctx.fillStyle = P.bld; ctx.fillRect(bx, GY - 40 - bh, 92, bh); ctx.strokeStyle = P.ink; ctx.globalAlpha = 0.5; ctx.lineWidth = 2; ctx.strokeRect(bx, GY - 40 - bh, 92, bh); ctx.globalAlpha = 1;
      ctx.fillStyle = P.win; for (let wy = GY - 30 - bh, wr = 0; wy < GY - 50; wy += 20, wr++) for (let wx = bx + 12, wc = 0; wx < bx + 84; wx += 22, wc++) if ((b * 7 + wr * 3 + wc * 5) % 3 === 0) ctx.fillRect(wx, wy, 8, 8);
    }
    ctx.fillStyle = P.road; ctx.fillRect(0, GY - 40, W, H - GY + 40);
    ctx.fillStyle = '#FFFFFF'; const lo = g.x % 80; for (let lx = -lo; lx < W; lx += 80) ctx.fillRect(lx, GY + 34, 44, 5);
  }
  tick(now){
    const cv = this.cv; if (!cv || !cv.getContext) return;
    const ctx = cv.getContext('2d'), W = 1000, H = 380, RX = this.RX, GY = this.GY;
    const cw = cv.clientWidth || 1000, dpr = window.devicePixelRatio || 1;
    if (cv.width !== Math.round(cw * dpr)) { cv.width = Math.round(cw * dpr); cv.height = Math.round(cw * dpr * H / W); }
    ctx.setTransform(cv.width / W, 0, 0, cv.width / W, 0, 0);
    const g = this.g, playing = this.state.phase === 'playing', crashed = this.state.phase === 'crashed';
    const dt = Math.min(50, now - (g.last || now)); g.last = now; const f = dt / 16.67;
    const rush = g.mode === 'rush', obs = rush ? g.robs : this.obstacles(g.x - 100, g.x + 1200), riders = this.riders();
    if (now > g.lightNext) { g.lightOn = !g.lightOn; g.lightNext = now + (g.lightOn ? 1600 + Math.random() * 2600 : 500 + Math.random() * 1400); }
    if (this.state.phase === 'ambient') {
      g.speed += (4.2 - g.speed) * 0.05 * f; g.x += g.speed * f;
      g.y += g.vy * f; g.vy -= 0.68 * f; if (g.y < 0) { g.y = 0; g.vy = 0; }
      for (const o of obs) { const d = (o.wx - g.x) - (RX + 44); if (d > 0 && d < 28 && g.y <= 0.01) { g.vy = 16.5; break; } }
    }
    if (playing && rush) {
      const base = Math.min(12.5, 6 + (g.x - g.rushStart) / 2200);
      if (g.pedal) g.speed = Math.min(base + 4, g.speed + 0.22 * f); else g.speed += (base - g.speed) * 0.05 * f;
      g.x += g.speed * f;
      g.y += g.vy * f; g.vy -= 0.8 * f; if (g.y < 0) { g.y = 0; g.vy = 0; }
      if (g.x > g.nextObs) {
        const T = ['pothole','cone','bricks','dog','dog'], D = { pothole:[72,8], cone:[28,42], bricks:[52,32], dog:[64,28] };
        const type = T[Math.floor(Math.random() * T.length)];
        g.robs.push({ id: 'r' + (g.idc++), type: type, wx: g.x + 1100, w: D[type][0], h: D[type][1] });
        if (g.speed < 10 && Math.random() < 0.22) g.robs.push({ id: 'r' + (g.idc++), type: 'cone', wx: g.x + 1100 + D[type][0] + 40, w: 28, h: 42 });
        g.nextObs = g.x + Math.max(g.speed * 36, 260 + Math.random() * 360);
      }
      for (const o of g.robs) if (!o.counted && (o.wx - g.x) + o.w < RX - 52) { o.counted = true; g.cleared++; }
      g.robs = g.robs.filter((o) => o.wx - g.x > -150);
      for (const o of g.robs) { if (o.type === 'dog' && g.gone[o.id]) continue; const sx = o.wx - g.x; if (sx < RX + 48 && sx + o.w > RX - 46 && g.y < o.h - 5) { this.crash(o.type); break; } }
    } else if (playing) {
      if (g.pedal) g.speed = Math.min(7.5, g.speed + 0.18 * f); else g.speed = Math.max(0, g.speed - (g.y > 0 ? 0.02 : (g.brake ? 0.4 : 0.14)) * f);
      g.x += g.speed * f;
      g.y += g.vy * f; g.vy -= 0.68 * f; if (g.y < 0) { g.y = 0; g.vy = 0; }
      for (const o of obs) { if (o.type === 'dog' && g.gone[o.id]) continue; const sx = o.wx - g.x; if (sx + 10 < RX + 40 && sx + o.w - 10 > RX - 36 && g.y < o.h - 10) { this.crash(o.type); break; } }
      const k = Math.round((g.x + RX - 900) / 1300);
      if (k >= 0 && !g.boarded[k] && Math.abs(this.stopWx(k) - (g.x + RX)) < 140 && g.speed < 1.4 && g.y <= 0.01) this.board(k);
    }
    const P = this.pal(), dark = this.state.dark;
    this.drawBack(ctx, P, dark, g, W, H, GY);
    const ks = Math.max(0, Math.floor((g.x - 400) / 1300)), ke = Math.floor((g.x + 1200) / 1300) + 1;
    for (let k = ks; k <= ke && !rush; k++) {
      const sx = this.stopWx(k) - g.x; if (sx < -260 || sx > 1260) continue;
      ctx.fillStyle = '#FFD400'; ctx.globalAlpha = 0.85; ctx.fillRect(sx - 90, GY - 4, 180, 6); ctx.globalAlpha = 1;
      ctx.fillStyle = '#FFFFFF'; ctx.font = "800 15px 'Anek Bangla', sans-serif"; ctx.textAlign = 'center'; ctx.fillText('BUS STAND', sx, GY + 22); ctx.textAlign = 'left';
      ctx.strokeStyle = '#7A5A2E'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(sx - 60, GY - 40); ctx.lineTo(sx - 60, GY - 170); ctx.moveTo(sx + 60, GY - 40); ctx.lineTo(sx + 60, GY - 170); ctx.stroke();
      ctx.fillStyle = '#9AA3AD'; ctx.beginPath(); ctx.moveTo(sx - 82, GY - 166); ctx.lineTo(sx + 82, GY - 178); ctx.lineTo(sx + 82, GY - 166); ctx.lineTo(sx - 82, GY - 154); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#000'; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.strokeStyle = '#6B7480'; ctx.lineWidth = 1.5; for (let q = -70; q <= 70; q += 14) { ctx.beginPath(); ctx.moveTo(sx + q, GY - 165 - q * 0.07); ctx.lineTo(sx + q, GY - 155 - q * 0.07); ctx.stroke(); }
      const r = riders[k % 5], boarded = g.boarded[k];
      let px = sx + 20, py = GY - 40, alpha = 1;
      if (boarded) { const bt = g.board && g.board.k === k ? Math.min(1, (now - g.board.t) / 500) : 1; px = sx + 20 + (RX - sx - 10) * bt; py = GY - 40 - Math.sin(bt * Math.PI) * 40; alpha = 1 - bt; }
      if (alpha > 0) {
        ctx.globalAlpha = alpha;
        ctx.fillStyle = r.color; ctx.strokeStyle = '#000'; ctx.lineWidth = 3;
        ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(px - 11, py - 52, 22, 36, 6); else ctx.rect(px - 11, py - 52, 22, 36); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px - 6, py - 16); ctx.lineTo(px - 6, py); ctx.moveTo(px + 6, py - 16); ctx.lineTo(px + 6, py); ctx.stroke();
        ctx.fillStyle = '#8D5524'; ctx.beginPath(); ctx.arc(px, py - 62, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        if (!boarded) {
          const bx = sx - 20, by = GY - 262;
          ctx.fillStyle = P.panel; ctx.strokeStyle = P.ink; ctx.lineWidth = 2.5;
          ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(bx - 90, by, 200, 58, 12); else ctx.rect(bx - 90, by, 200, 58); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(bx + 30, by + 58); ctx.lineTo(bx + 42, by + 72); ctx.lineTo(bx + 46, by + 58); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.fillStyle = P.ink; ctx.font = "700 17px 'Anek Bangla', sans-serif"; ctx.textAlign = 'center';
          ctx.fillText(r.ask[0], bx + 10, by + 24); ctx.fillText(r.ask[1], bx + 10, by + 45); ctx.textAlign = 'left';
        }
        ctx.globalAlpha = 1;
      }
    }
    for (const o of obs) {
      let sx = o.wx - g.x;
      if (o.type === 'dog' && g.gone[o.id]) { const t = Math.min(1, (now - g.gone[o.id]) / 700); if (t >= 1) continue; ctx.globalAlpha = 1 - t; ctx.save(); ctx.translate(t * 160, -t * 60); this.drawObs(ctx, o, sx, GY, P.ink); ctx.restore(); ctx.globalAlpha = 1; continue; }
      this.drawObs(ctx, o, sx, GY, P.ink);
    }
    let ang = 0, dx = 0; if (crashed) { const kq = Math.min(1, (now - g.crashT) / 520); ang = -1.15 * (1 - Math.pow(1 - kq, 3)); dx = 26 * kq; }
    if (g.lightOn && !crashed) {
      const lx = RX + 38, ly = GY - g.y - 56, cone = ctx.createLinearGradient(lx, ly, lx + 300, ly);
      cone.addColorStop(0, 'rgba(255,224,102,0.55)'); cone.addColorStop(1, 'rgba(255,224,102,0)');
      ctx.fillStyle = cone; ctx.beginPath(); ctx.moveTo(lx, ly - 4); ctx.lineTo(lx + 300, ly - 46); ctx.lineTo(lx + 300, ly + 58); ctx.lineTo(lx, ly + 6); ctx.closePath(); ctx.fill();
    }
    this.drawRick(ctx, RX + dx, GY - g.y, ang, g.x / 24);
    { const lx = RX + 38, ly = GY - g.y - 56; ctx.fillStyle = g.lightOn && !crashed ? '#FFE066' : '#6B6259'; ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(lx, ly, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); if (g.lightOn && !crashed) { ctx.globalAlpha = 0.35; ctx.fillStyle = '#FFE066'; ctx.beginPath(); ctx.arc(lx, ly, 14, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; } }
    if (now - g.bellT < 800) { ctx.globalAlpha = 1 - (now - g.bellT) / 800; ctx.fillStyle = '#D21F14'; ctx.font = "800 22px 'Anek Bangla', sans-serif"; ctx.fillText('Kring kring!', RX + 30, GY - g.y - 130 - (now - g.bellT) / 30); ctx.globalAlpha = 1; }
    if (crashed) { const t = now / 300; ctx.fillStyle = '#FFD400'; ctx.font = "800 24px 'Anek Bangla', sans-serif"; for (let i = 0; i < 3; i++) { const a = t + i * 2.1; ctx.fillText('*', RX + 40 + Math.cos(a) * 26, GY - 120 + Math.sin(a) * 8); } }
    if (rush) {
      const sc = this.state.phase === 'over' ? this.state.score : this.rushScore();
      ctx.fillStyle = P.ink; ctx.font = "800 30px 'Anek Bangla', sans-serif"; ctx.fillText(sc + ' pts', 24, 44);
      ctx.font = "600 15px 'Anek Bangla', sans-serif"; ctx.fillStyle = P.muted; ctx.fillText('Rush hour, ' + g.cleared + ' cleared, best ' + this.state.rushBest, 24, 68);
      const it = now - g.rushT; if (it < 1800) { ctx.globalAlpha = Math.max(0, 1 - it / 1800); ctx.fillStyle = '#D21F14'; ctx.font = "800 64px 'Anek Bangla', sans-serif"; ctx.textAlign = 'center'; ctx.fillText('Rush hour!', W / 2, 150); ctx.textAlign = 'left'; ctx.globalAlpha = 1; }
      return;
    }
    if (this.state.phase === 'ambient') return;
    ctx.fillStyle = P.ink; ctx.font = "800 24px 'Anek Bangla', sans-serif"; ctx.fillText(Math.floor(g.x / 10) + ' m', 24, 40);
    const kn = Math.round((g.x + RX - 900) / 1300), near = kn >= 0 && !g.boarded[kn] && Math.abs(this.stopWx(kn) - (g.x + RX)) < 320;
    ctx.font = "600 15px 'Anek Bangla', sans-serif"; ctx.fillStyle = near ? '#D21F14' : P.muted;
    ctx.fillText(near ? 'Bus stand ahead: stop pedalling to pick up' : (g.pedal ? 'Pedalling' : (g.speed > 0.2 ? 'Coasting' : 'Stopped')), 24, 64);
  }
  initTr(){ try { const v = window.localStorage.getItem('akk-tr'); if (['shutter','rickshaw','halftone','unfold','ticket'].indexOf(v) >= 0) return v; } catch (e) {} return 'shutter'; }
  initRead(){ try { const v = JSON.parse(window.localStorage.getItem('akk-read') || '[]'); if (Array.isArray(v)) return v.filter((n) => typeof n === 'string'); } catch (e) {} return []; }
  initDark(){
    try { const v = window.localStorage.getItem('akk-theme'); if (v === 'dark' || v === 'light') return v === 'dark'; } catch (e) {}
    try { return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches); } catch (e) { return false; }
  }
  syncTheme(){
    this.onStore = (e) => { if (e.key === 'akk-theme') this.setState({ dark: e.newValue === 'dark' }); };
    try { window.addEventListener('storage', this.onStore); } catch (e) {}
  }
  unsyncTheme(){ clearTimeout(this.trT); try { window.removeEventListener('storage', this.onStore); } catch (e) {} }
  explainers(){ return this.list(); }
  allStories(){ return this.list().map((x) => ({ day: x.day, cat: x.cat, title: x.title, brief: x.brief, time: x.time, color: x.color })); }
  markRead(id){ if (this.state.read.indexOf(id) >= 0) return; const read = this.state.read.concat([id]).slice(-200); this.setState({ read: read }); try { window.localStorage.setItem('akk-read', JSON.stringify(read)); } catch (e) {} }
  go(v, extra, noPush){
    if (v !== 'home' && this.state.phase !== 'ambient') this.toAmbient();
    clearTimeout(this.trT);
    const E = this.list(), O = { home: 0, story: 1, all: 2, about: 3 }, cur = this.state.si;
    let fwd = (O[v] || 0) >= (O[this.state.view] || 0);
    if (v === 'story' && this.state.view === 'story' && extra && extra.si !== undefined) fwd = extra.si > cur || (extra.si === 0 && cur > 1);
    const upd = Object.assign({ view: v, trN: this.state.trN + 1, trDone: false, dir: fwd ? 1 : -1, gone: false }, extra || {});
    const si = upd.si !== undefined ? upd.si : cur;
    this.setState(upd);
    if (v === 'story') this.markRead(E[si].id);
    this.trT = setTimeout(() => this.setState({ trDone: true }), 2000);
    try {
      const u = pathFor(v, E[si]);
      if (!noPush && window.location.pathname !== u) window.history.pushState({}, '', u);
      document.title = titleFor(v, E[si]);
      window.scrollTo(0, 0);
    } catch (e) {}
  }
  renderVals() {
    const R = this.riders(), isDark = this.state.dark, on = this.state.onboard, fl = this.state.flash;
    const wire = (a, b, c, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
    const bands = [ { y: 2, a: 30, b: 95, c: 40 }, { y: 31, a: 20, b: 90, c: 55 }, { y: 61, a: 45, b: 100, c: 25 }, { y: 88, a: 25, b: 85, c: 50 } ];
    const crows = [];
    bands.forEach((w, i) => { [0.025 + (i % 2) * 0.01, 0.955 - (i % 2) * 0.01].forEach((t, j) => { if (true) crows.push({ band: i, x: (t * 100).toFixed(2), y: (wire(w.a, w.b, w.c, t) - 26).toFixed(1), d: (i * 3 + j * 5) % 11, flip: (i + j) % 2 ? -1 : 1 }); }); });
    const TR = this.state.tr, V = this.state.view;
    const pic = (i) => artFor(E[i] ? E[i].art : 'market', isDark);
    // Plain clicks change the page in place. Ctrl/Cmd-click still opens a new tab.
    const nav = (fn) => (e) => { if (e && (e.metaKey || e.ctrlKey || e.shiftKey)) return; if (e && e.preventDefault) e.preventDefault(); fn(); };
    const E = this.explainers(), si = this.state.si, es = E[si];
    const AS = this.allStories(), fq = this.state.f, qq = this.state.q.trim().toLowerCase();
    const listed = AS.filter((x) => (fq === 'all' || x.cat === fq) && (!qq || (x.title + ' ' + x.brief).toLowerCase().indexOf(qq) >= 0));
    const groups = E.map((e) => e.day).filter((d, i, a) => a.indexOf(d) === i).map((day) => ({ day: day, items: listed.filter((x) => x.day === day).map((x) => { const ix = E.findIndex((e) => e.title === x.title); const k = ix >= 0 ? ix : 0; return Object.assign({ img: pic(k), href: pathFor('story', E[k]), open: nav(() => this.go('story', { si: k })) }, x); }) })).filter((g) => g.items.length);
    const N = E.length, isLive = !!es.live, D = this.props.digest || {}, now = this.state.now;
    // Stories are browsed in two groups: today's five, then everything else.
    const base = si < 5 ? 0 : 5, size = si < 5 ? Math.min(5, N) : Math.max(1, N - 5);
    const step = (k) => base + (si - base + k + size) % size;
    const SC = { Bangladesh: '#00924A', World: 'var(--accent2)', Tech: '#2F5BEA', Sport: '#F28C00' };
    const lf = this.state.liveF;
    const ago = (d) => { if (!now || !d) return ''; const m = Math.max(1, Math.round((now - new Date(d).getTime()) / 60000)); return m < 60 ? m + ' min ago' : m < 1440 ? Math.round(m / 60) + ' hr ago' : Math.round(m / 1440) + ' d ago'; };
    const from = (s) => s.source + (ago(s.date) ? ', ' + ago(s.date) : '');
    const liveAll = E.map((x, i) => ({ x: x, i: i })).filter((o) => o.x.live);
    const liveShown = liveAll.filter((o) => lf === 'all' || o.x.cat === lf).slice(0, 18).map((o) => ({ title: o.x.title, section: o.x.cat, color: SC[o.x.cat] || 'var(--ink)', from: from(o.x), img: pic(o.i), href: pathFor('story', o.x), open: nav(() => this.go('story', { si: o.i })), read: this.state.read.indexOf(o.x.id) >= 0 ? 'Read' : '' }));
    const liveChips = ['all', 'Bangladesh', 'World', 'Tech', 'Sport'].filter((c) => c === 'all' || liveAll.some((o) => o.x.cat === c)).map((c) => { const on = lf === c; return { name: c === 'all' ? 'All' : c, on: on ? 'true' : 'false', go: () => this.setState({ liveF: c }), style: 'font-family:inherit;font-weight:700;font-size:16px;padding:9px 14px;border-radius:999px;cursor:pointer;border:2px solid ' + (on ? 'var(--ink)' : 'var(--line)') + ';background:' + (on ? 'var(--ink)' : 'transparent') + ';color:' + (on ? 'var(--bg)' : 'var(--ink)') }; });
    const until = (t) => { if (!now || !t) return ''; const m = Math.max(1, Math.round((t - now) / 60000)); return m >= 60 ? Math.floor(m / 60) + ' hr ' + (m % 60) + ' min' : m + ' min'; };
    const QUIZ = D.quiz && D.quiz.length >= 3 ? D.quiz : [
      { topic: 'Health', q: 'Above which AQI number is the air unhealthy for everyone?', opts: ['50', '100', '150', '300'], a: 2, why: 'From 151 up, the air is classed as unhealthy for everyone, not just sensitive groups.' },
      { topic: 'Sport', q: 'Who receives a football transfer fee?', opts: ['The player', 'The selling club', 'The league'], a: 1, why: 'The buying club pays the selling club. The player is paid through wages and bonuses.' },
      { topic: 'Money', q: 'What fills the onion supply between local harvests?', opts: ['Imports', 'Nothing, prices just rise', 'Government farms'], a: 0, why: 'Imports cover the gaps, so changes abroad show up in shop prices here.' }
    ];
    const faq = [
      ['Is it free?', 'Yes. Every story and quiz is free to read.'],
      ['Who writes the summaries?', 'An AI model reads the public text of each article and retells what happened in one short paragraph of simple words, adding nothing of its own. It can still leave things out or make mistakes, so every story links to the original report. Overviews and the quiz refresh every 6 hours.'],
      ['Will there be a Bangla edition?', 'Yes. A full Bangla edition is planned, so you can read every story in the language you prefer.'],
      ['Why is there a rickshaw game?', 'Because news should be something you want to open. Ride, pick up passengers and their stories, or skip the game and read all five straight away.']
    ];
    return {
      vHome: V === 'home',
      related: [1, 2, 3].map((k) => { const j = step(k), e = E[j]; return { title: e.title, cat: e.cat, color: e.color, time: e.time, img: pic(j), href: pathFor('story', e), open: nav(() => this.go('story', { si: j })) }; }),
      pics: E.slice(0, 5).map((e, j) => ({ title: e.title, brief: e.brief, cat: e.cat, color: e.color, time: e.time, from: e.live ? from(e) : 'Sample', img: pic(j), href: pathFor('story', e), open: nav(() => this.go('story', { si: j })) })),
      heroImg: pic(si), heroAlt: es.alt, rideImg: pic(on >= 0 ? on : 0), rideHref: pathFor('story', E[on >= 0 ? on : 0]),
      crumb: es.cat, posText: si < 5 ? 'Story ' + (si + 1) + ' of ' + Math.min(5, N) : (isLive ? 'Headline ' : 'Story ') + (si - 4) + ' of ' + (N - 5),
      nextLabel: si < 5 ? "Next in today's five" : 'Next headline',
      hasLive: liveAll.length > 0, live: liveShown, liveChips: liveChips, isLive: isLive, isSample: !isLive, gone: this.state.gone,
      picsNote: E[0].live ? 'The five to know right now. Tap one to read it in simple words.' : 'Tap a picture to read the story',
      allIntro: E[0].live ? 'Every story on the site right now, each explained in simple words. New ones arrive through the day.' : 'Sample explainers that show how a story reads here.',
      storyMeta: isLive ? (es.hasAI ? es.time + ' read, from ' : 'From ') + from(es) : es.time + ' quick read, sample explainer',
      hasWhy: !!es.why, hasTerms: !!(es.terms && es.terms.length), hasSummary: !!es.summary, noAI: isLive && !es.hasAI,
      goLive: nav(() => { if (this.state.view !== 'home') this.go('home'); setTimeout(() => { try { const el = document.getElementById('live-h'); if (el) el.scrollIntoView({ behavior: 'smooth' }); } catch (x) {} }, this.state.view !== 'home' ? 700 : 0); }),
      topics: [['Bangladesh', '#00924A', '#FFFFFF', 'Prices, power, air and everyday life at home.'], ['World', '#D21F14', '#FFFFFF', 'Big stories abroad, and why they reach us.'], ['Tech', '#2F5BEA', '#FFFFFF', 'Phones, chips, apps and AI, explained.'], ['Sport', '#F28C00', '#1A1714', 'Cricket, football and the money behind them.']].map((t) => { const n = AS.filter((x) => x.cat === t[0]).length; return { name: t[0], color: t[1], fg: t[2], blurb: t[3], count: n + (n === 1 ? ' story' : ' stories'), go: () => this.go('all', { f: t[0] }) }; }), pageClass: 'tr-page p' + (this.state.trN % 2), vStory: V === 'story', vAll: V === 'all', vAbout: V === 'about',
      navItems: [['home', "Today's five"], ['all', 'All stories'], ['about', 'How we work']].map((n) => { const cur = V === n[0] || (n[0] === 'home' && V === 'story'); return { label: n[1], cur: cur ? 'page' : 'false', line: cur ? 'underline' : 'none', go: () => this.go(n[0]) }; }),
      goHome: (e) => { if (e && e.preventDefault) e.preventDefault(); this.go('home'); },
      goJoin: (e) => { if (e && e.preventDefault) e.preventDefault(); if (this.state.view !== 'home') this.go('home'); setTimeout(() => { try { const el = document.getElementById('join'); if (el) el.scrollIntoView({ behavior: 'smooth' }); } catch (x) {} }, this.state.view !== 'home' ? 700 : 0); },
      openRide: (e) => { if (e && e.preventDefault) e.preventDefault(); this.go('story', { si: this.state.onboard >= 0 ? this.state.onboard : 0 }); },
      s: es, even: si % 2 === 0, odd: si % 2 === 1, nextTitle: E[step(1)].title,
      next: () => this.go('story', { si: step(1) }), prev: () => this.go('story', { si: step(-1) }),
      q: this.state.q, onSearch: (e) => this.setState({ q: e.target.value }),
      chips: [['all','All'],['Bangladesh','Bangladesh'],['World','World'],['Tech','Tech'],['Sport','Sport']].map((c) => { const on = fq === c[0]; return { name: c[1], on: on ? 'true' : 'false', go: () => { if (this.state.f !== c[0]) this.go('all', { f: c[0] }); }, style: 'font-family:inherit;font-weight:700;font-size:16px;padding:9px 14px;border-radius:999px;cursor:pointer;border:2px solid ' + (on ? 'var(--ink)' : 'var(--line)') + ';background:' + (on ? 'var(--ink)' : 'transparent') + ';color:' + (on ? 'var(--bg)' : 'var(--ink)') }; }),
      groups: groups, none: groups.length === 0, filterName: fq === 'all' ? 'any section' : fq,
      clear: () => this.setState({ f: 'all', q: '' }),
      standards: ['Every story names the original publisher and links their report', 'Summaries use only what the publisher reported: no added names, numbers or guesses', 'AI-written summaries are labelled, and can be wrong, so the source is always one tap away', 'We stay neutral on politics and never present speculation as fact', "We never copy whole articles or publishers' photos. All pictures are our own drawings"],
      faq: faq.map((x, i) => { const open = this.state.faqOpen === i; return { q: x[0], a: x[1], open: open, exp: open ? 'true' : 'false', rot: open ? 45 : 0, toggle: () => this.setState({ faqOpen: open ? -1 : i }) }; }),
      tr: TR,
      onTr: (e) => { const v = e.target.value; try { window.localStorage.setItem('akk-tr', v); } catch (x) {} this.setState({ tr: v }, () => this.go(this.state.view)); },
      tryTr: () => this.go(this.state.view),
      trLiveA: !this.state.trDone && this.state.trN % 2 === 0, trLiveB: !this.state.trDone && this.state.trN % 2 === 1,
      trShutter: TR === 'shutter', trRickshaw: TR === 'rickshaw', trHalftone: TR === 'halftone', trUnfold: TR === 'unfold', trTicket: TR === 'ticket', trRoot: TR === 'unfold' && !this.state.trDone ? 'tr-unfold' : '', trLive: !this.state.trDone, trName: V === 'story' ? 'the explainer' : (V === 'all' ? 'All stories' : (V === 'about' ? 'How we work' : "Today's five")),
      theme: isDark ? 'np3-dark' : 'np3-light', rootClass: (isDark ? 'np3-dark' : 'np3-light') + (!this.state.trDone ? ' fz-go' : '') + ' fz-t-kite', isDark: isDark, isLight: !isDark,
      themeLabel: isDark ? 'Switch to light mode' : 'Switch to dark mode',
      toggleTheme: () => { const d = !this.state.dark; this.setState({ dark: d }); try { document.documentElement.dataset.akk = d ? 'dark' : 'light'; } catch (e) {} try { window.localStorage.setItem('akk-theme', d ? 'dark' : 'light'); } catch (e) {} },
      wires: bands.map((w, i) => ({ y: w.y, d1: 'M0 ' + w.a + ' Q720 ' + w.b + ' 1440 ' + w.c, d2: 'M0 ' + (w.a + 14) + ' Q620 ' + (w.b + 22) + ' 1440 ' + (w.c - 6), d3: 'M0 ' + (w.c + 4) + ' Q820 ' + (w.b - 8) + ' 1440 ' + (w.a + 20), crows: crows.filter((c) => c.band === i) })),
      kites: [ { x: 94.4, y: 3, s: .75 }, { x: .6, y: 17, s: .7 }, { x: 94.6, y: 36, s: .7 }, { x: .5, y: 55, s: .65 }, { x: 94.5, y: 73, s: .75 }, { x: .6, y: 89, s: .6 } ].map((k, i) => { const kc = [['#D21F14','#FFD400'],['#00924A','#F3EFE7'],['#2F5BEA','#FFD400'],['#F28C00','#1A1714'],['#D21F14','#F3EFE7'],['#FFD400','#00924A']][i]; return { x: k.x, y: k.y, w: Math.round(90 * k.s), h: Math.round(195 * k.s), c1: kc[0], c2: kc[1], o: isDark ? .45 : .6, d: 5 + i, dl: i * 1.3 }; }),
      wordOffset: (this.state.word * 1.05).toFixed(2),
      setCanvas: this.setCanvas,
      won: this.state.phase === 'won', over: this.state.phase === 'over', score: this.state.score, rushBest: this.state.rushBest, overMsg: this.state.overMsg,
      startRush: () => this.startRush(),
      ready: this.state.phase === 'ready', crashed: this.state.phase === 'crashed', crashMsg: this.state.crashMsg, best: this.state.best,
      start: () => this.start(), again: () => this.again(),
      tapJump: (e) => { if (this.state.phase === 'ambient') return; if (e && e.preventDefault) e.preventDefault(); this.jump(); },
      inviteOn: this.state.phase === 'ambient' && this.state.invite, playPill: this.state.phase === 'ambient' && !this.state.invite,
      gameActive: this.state.phase !== 'ambient',
      closeInvite: () => this.setState({ invite: false }), toAmbient: () => this.toAmbient(),
      ringBell: (e) => { if (e && e.preventDefault) e.preventDefault(); this.ring(); },
      pedalOn: (e) => { if (e && e.preventDefault) e.preventDefault(); if (this.blocked()) return; this.start(); this.g.pedal = true; },
      pedalOff: () => { this.g.pedal = false; },
      keyDown: (e) => {
        const k = e.key; if (this.state.phase === 'ambient') return;
        if (k === ' ' || k === 'ArrowUp') { e.preventDefault(); this.jump(); }
        if (k === 'ArrowRight') { e.preventDefault(); if (!this.blocked()) { this.start(); this.g.pedal = true; } }
        if (k === 'ArrowLeft') { e.preventDefault(); this.g.brake = true; }
        if (k === 'b' || k === 'B') { this.ring(); }
        if (k === 'Enter' && this.state.phase === 'crashed') this.again();
        if (k === 'Enter' && this.state.phase === 'over') this.startRush();
      },
      keyUp: (e) => { if (e.key === 'ArrowRight') this.g.pedal = false; if (e.key === 'ArrowLeft') this.g.brake = false; },
      showAll: () => { const on0 = this.state.onboard >= 0 ? this.state.onboard : 0; this.setState({ picked: [0,1,2,3,4], onboard: on0, flash: this.state.flash + 1, invite: false }); if (typeof document !== 'undefined') { const el = document.getElementById('ride-h'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: this.reduce ? 'auto' : 'smooth', block: 'start' }); } },
      quiz: (() => {
        const Q = QUIZ;
        return Q.map((x, i) => {
          const ans = this.state.answers[i], done = ans !== undefined;
          return { q: x.q, topic: x.topic || 'News', done: done, why: x.why, verdict: done && ans === x.a ? 'Right.' : 'Not quite. The answer is ' + x.opts[x.a] + '.', verdictColor: done && ans === x.a ? '#00924A' : 'var(--accent2)',
            opts: x.opts.map((t, j) => {
              const picked = ans === j, right = j === x.a;
              let st = 'width:100%;text-align:left;font-family:inherit;font-weight:600;font-size:17px;padding:11px 14px;border-radius:12px;color:var(--ink);cursor:' + (done ? 'default' : 'pointer') + ';border:2px solid var(--line);background:transparent';
              if (done && right) st += ';border-color:#00924A;background:rgba(0,146,74,.12)';
              if (done && picked && !right) st += ';border-color:var(--accent2);background:rgba(210,31,20,.10)';
              return { t: t, picked: picked ? 'true' : 'false', locked: done, style: st, pick: () => { if (this.state.answers[i] !== undefined) return; this.setState({ answers: Object.assign({}, this.state.answers, { [i]: j }) }); } };
            }) };
        });
      })(),
      quizMeta: (() => { const A = this.state.answers, n = Object.keys(A).length, T = QUIZ.length, right = QUIZ.filter((x, i) => A[i] === x.a).length, next = until(D.nextAt); return (n === T ? 'You got ' + right + ' of ' + T + '.' : T + ' questions from the news. Tap an answer.') + (next ? ' New quiz in ' + next + '.' : ' A new quiz every 6 hours.'); })(),
      pickedCount: this.state.picked.length,
      empty: on < 0, evenFlash: on >= 0 && fl % 2 === 0, oddFlash: on >= 0 && fl % 2 === 1,
      ride: on >= 0 ? R[on] : R[0],
      hasPicked: this.state.picked.length > 1,
      picked: this.state.picked.map((r) => ({ title: R[r].title, on: r === on ? 'true' : 'false', show: () => this.setState({ onboard: r, flash: this.state.flash + 1 }),
        style: 'font-family:inherit;font-weight:600;font-size:15px;padding:8px 14px;border-radius:999px;cursor:pointer;text-align:left;border:2px solid ' + (r === on ? R[r].color : 'var(--line)') + ';background:' + (r === on ? R[r].color : 'transparent') + ';color:' + (r === on ? '#FFFFFF' : 'inherit') })),
      steps: [
        { num:'১', color:'#FFD400', fg:'#000000', title:'The quick read', text:'What happened and who is involved, in about 60 seconds.' },
        { num:'২', color:'#1A1714', fg:'#FFFFFF', title:'Why should I care?', text:'How it touches your bills, studies, commute or family.' },
        { num:'৩', color:'#D21F14', fg:'#FFFFFF', title:'Words, then the source', text:'Tricky words explained, and a link to the publisher\'s full report.' }
      ],
      trust: [
        'The original publisher and a link to their report, on every story',
        'How long ago it was published, on every story',
        'Summaries that stick to what the publisher reported, with nothing added',
        'A clear label wherever a summary was written by AI'
      ],
      notJoined: !this.state.joined, joined: this.state.joined,
      join: (e) => { if (e && e.preventDefault) e.preventDefault(); this.setState({ joined: true }); }
    };
  }
}
