// Draws story pictures in the house style (sunburst or dot background, sun or moon, a bold outlined object, dashed frame)
// and writes a day and a night copy of each: public/art/<name>.svg and <name>-n.svg.
// Run: node scripts/make-art.mjs            (all scenes below)
//      node scripts/make-art.mjs game farm  (just these)
// Rules: no people and no faces, only objects. Keep the subject inside x 40..360, y 56..230 so the sticker and flags fit.
import fs from 'fs';

const INK = '#1A1714';
const S = (w = 4) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const NIGHT = { bg: '#4A5D90', alt: '#5A6FA3', dot: '#5C6D9C', ground: '#2A3550' };

function rays(base, alt) {
  let out = '';
  for (let i = 0; i < 24; i++) {
    const a = Math.PI + (i * Math.PI) / 24, b = Math.PI + ((i + 1) * Math.PI) / 24;
    const p = (t) => (200 + 520 * Math.cos(t)).toFixed(1) + ' ' + (250 + 520 * Math.sin(t)).toFixed(1);
    out += `<path d="M200 250 L${p(a)} L${p(b)} Z" fill="${i % 2 ? alt : base}"/>`;
  }
  return out;
}
function dots(color) {
  let out = '';
  for (let x = 14; x < 400; x += 28) for (let y = 14; y < 232; y += 28) out += `<circle cx="${x}" cy="${y}" r="5" fill="${color}"/>`;
  return out;
}
const STARS = [[40, 30], [90, 58], [150, 24], [250, 40], [300, 70], [210, 18]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#F3EFE7" opacity=".7"/>`).join('');

function frame(sc, night) {
  const bg = night ? NIGHT.bg : sc.bg;
  const back = sc.style === 'dots' ? dots(night ? NIGHT.dot : sc.alt) : rays(bg, night ? NIGHT.alt : sc.alt);
  const sky = night
    ? STARS + `<circle cx="352" cy="44" r="20" fill="#F3EFE7" stroke="${INK}" stroke-width="3"/><circle cx="362" cy="38" r="17" fill="${bg}"/>`
    : `<circle cx="352" cy="44" r="20" fill="#FFD400" stroke="${INK}" stroke-width="3"/>`;
  const ground = `<rect y="232" width="400" height="28" fill="${night ? NIGHT.ground : sc.ground || '#E9DFC9'}"/>`;
  const shadow = `<ellipse cx="200" cy="230" rx="${sc.shadow || 110}" ry="9" fill="${INK}" opacity=".18"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" role="img" aria-label="${sc.label} illustration"><defs><clipPath id="c"><rect width="400" height="260" rx="14"/></clipPath>${sc.defs || ''}</defs><g clip-path="url(#c)"><rect width="400" height="260" fill="${bg}"/>${back}${sky}${ground}${shadow}${sc.draw}</g><rect x="2" y="2" width="396" height="256" rx="13" fill="none" stroke="${INK}" stroke-width="4"/><rect x="11" y="11" width="378" height="238" rx="8" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round"/></svg>`;
}

// ---- small parts ----
const coin = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFD400" ${S(3)}/><path d="M${x} ${y - r * .5} V${y + r * .5}" fill="none" ${S(3)}/>`;
// A rice sheaf: a bundle of stalks tied in the middle, flaring at the foot, with grain heads drooping over the top.
const sheaf = (cx) => {
  const heads = [[-30, 96, -1], [-16, 82, -1], [0, 76, 1], [16, 82, 1], [30, 96, 1]].map(([dx, y, d]) =>
    `<path d="M${cx + dx * .3} 140 C${cx + dx * .5} ${y + 10} ${cx + dx} ${y} ${cx + dx + d * 14} ${y + 26}" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>` +
    `<ellipse cx="${cx + dx + d * 12}" cy="${y + 20}" rx="6" ry="11" transform="rotate(${d * 24} ${cx + dx + d * 12} ${y + 20})" fill="#F2B33D" ${S(2.5)}/>`).join('');
  return heads +
    `<path d="M${cx - 30} 216 L${cx - 10} 170 L${cx - 14} 140 H${cx + 14} L${cx + 10} 170 L${cx + 30} 216 Z" fill="#E8C98A" ${S()}/>` +
    `<path d="M${cx - 6} 146 V210 M${cx + 6} 146 V210 M${cx - 18} 212 L${cx - 8} 180 M${cx + 18} 212 L${cx + 8} 180" fill="none" stroke="#B08A4A" stroke-width="2" stroke-linecap="round"/>` +
    `<rect x="${cx - 16}" y="164" width="32" height="12" rx="3" fill="#D21F14" ${S(3)}/>`;
};
const paw = (cx, cy, s, fill) => `<g transform="translate(${cx} ${cy}) scale(${s})">` +
  `<path d="M-32 26 C-40 2 -18 -14 0 -14 C18 -14 40 2 32 26 C26 44 -26 44 -32 26 Z" fill="${fill}" ${S(4 / s)}/>` +
  [[-38, -28, -20], [-13, -48, -6], [13, -48, 6], [38, -28, 20]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="12" ry="17" transform="rotate(${r} ${x} ${y})" fill="${fill}" ${S(4 / s)}/>`).join('') + '</g>';
const leaf = (x, y, rot, s) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0 0 C20 -30 60 -30 80 0 C60 30 20 30 0 0 Z" fill="#00924A" ${S(3 / s)}/><path d="M4 0 H72" fill="none" ${S(2 / s)}/></g>`;

const SCENES = {
  game: {
    label: 'Video game', bg: '#7C4DDB', alt: '#9A72E6', draw:
      `<path d="M84 62h12v6h6v-6h12v6h6v12h-6v6h-6v6h-6v6h-6v-6h-6v-6h-6v-6h-6v-12h6Z" fill="#D21F14" ${S(2.5)}/>` +
      coin(290, 84, 12) + coin(318, 110, 10) +
      `<path d="M118 150 C116 118 146 104 178 108 H222 C254 104 284 118 282 150 C284 186 276 214 254 212 C238 211 230 196 222 184 H178 C170 196 162 211 146 212 C124 214 116 186 118 150 Z" fill="#F3EFE7" ${S(5)}/>` +
      `<path d="M150 134 h14 v14 h14 v14 h-14 v14 h-14 v-14 h-14 v-14 h14 Z" fill="${INK}"/>` +
      `<circle cx="244" cy="136" r="9" fill="#D21F14" ${S(3)}/><circle cx="262" cy="154" r="9" fill="#FFD400" ${S(3)}/><circle cx="244" cy="172" r="9" fill="#00924A" ${S(3)}/><circle cx="226" cy="154" r="9" fill="#2F5BEA" ${S(3)}/>` +
      `<rect x="184" y="132" width="12" height="6" rx="3" fill="${INK}"/><rect x="204" y="132" width="12" height="6" rx="3" fill="${INK}"/>`,
  },
  social: {
    label: 'Social media', bg: '#2F5BEA', alt: '#5B7FF0', shadow: 70, draw:
      `<path d="M110 150 C78 126 76 100 96 96 C104 94 110 102 110 108 C110 102 116 94 124 96 C144 100 142 126 110 150 Z" fill="#D21F14" ${S()}/>` +
      `<rect x="158" y="58" width="84" height="166" rx="16" fill="${INK}" ${S()}/><rect x="166" y="76" width="68" height="128" rx="6" fill="#FFFFFF"/>` +
      `<rect x="188" y="65" width="24" height="4" rx="2" fill="#5A5A66"/>` +
      `<rect x="172" y="86" width="44" height="16" rx="8" fill="#E9DFC9" ${S(2)}/><rect x="184" y="108" width="44" height="16" rx="8" fill="#7FD3A0" ${S(2)}/>` +
      `<rect x="172" y="130" width="36" height="16" rx="8" fill="#E9DFC9" ${S(2)}/><rect x="188" y="152" width="40" height="16" rx="8" fill="#7FD3A0" ${S(2)}/>` +
      `<rect x="172" y="174" width="30" height="16" rx="8" fill="#E9DFC9" ${S(2)}/>` +
      `<circle cx="240" cy="62" r="11" fill="#D21F14" ${S(3)}/>` +
      `<path d="M266 94 h58 a10 10 0 0 1 10 10 v28 a10 10 0 0 1 -10 10 h-32 l-14 14 v-14 h-12 a10 10 0 0 1 -10 -10 v-28 a10 10 0 0 1 10 -10 Z" fill="#FFD400" ${S()}/>` +
      `<circle cx="282" cy="118" r="4" fill="${INK}"/><circle cx="296" cy="118" r="4" fill="${INK}"/><circle cx="310" cy="118" r="4" fill="${INK}"/>`,
  },
  farm: {
    label: 'Farm and harvest', bg: '#F2C14E', alt: '#F7D57A', ground: '#8DBF5A', shadow: 150, draw:
      Array.from({ length: 11 }, (_, i) => { const x = 32 + i * 34; return `<path d="M${x} 228 l-7 -24 M${x} 228 v-28 M${x} 228 l7 -24" fill="none" stroke="#00924A" stroke-width="3.5" stroke-linecap="round"/>`; }).join('') +
      sheaf(130) + sheaf(200) + sheaf(270),
  },
  science: {
    label: 'Science', bg: '#00A38C', alt: '#3CC4AE', draw:
      `<g fill="none" stroke="${INK}" stroke-width="3"><ellipse cx="96" cy="118" rx="40" ry="14"/><ellipse cx="96" cy="118" rx="40" ry="14" transform="rotate(60 96 118)"/><ellipse cx="96" cy="118" rx="40" ry="14" transform="rotate(120 96 118)"/></g><circle cx="96" cy="118" r="8" fill="#D21F14" ${S(3)}/>` +
      `<path d="M186 72 V116 L148 200 Q144 214 158 214 H242 Q256 214 252 200 L214 116 V72 Z" fill="#FFFFFF" ${S(5)}/>` +
      `<path d="M169 156 H231 L252 200 Q256 214 242 214 H158 Q144 214 148 200 Z" fill="#7FD3A0" ${S(3)}/>` +
      `<rect x="176" y="62" width="48" height="12" rx="4" fill="#FFFFFF" ${S(4)}/>` +
      `<circle cx="194" cy="186" r="6" fill="#FFFFFF" ${S(2.5)}/><circle cx="214" cy="172" r="4" fill="#FFFFFF" ${S(2.5)}/><circle cx="204" cy="140" r="5" fill="#FFFFFF" ${S(2.5)}/><circle cx="212" cy="98" r="4" fill="#FFFFFF" ${S(2.5)}/>` +
      `<g transform="rotate(18 292 150)"><rect x="280" y="86" width="24" height="104" rx="12" fill="#FFFFFF" ${S()}/><path d="M282 140 H302 V178 A10 10 0 0 1 282 178 Z" fill="#D21F14"/><rect x="276" y="80" width="32" height="10" rx="4" fill="#FFFFFF" ${S(3)}/></g>`,
  },
  wildlife: {
    label: 'Wildlife', bg: '#2E8B57', alt: '#4FA874', ground: '#C9A66B', shadow: 90, draw:
      leaf(30, 84, -30, 1) + leaf(40, 150, 10, .8) + leaf(370, 120, 200, .9) + leaf(352, 186, 160, .7) +
      paw(110, 196, .45, '#F28C00') + paw(300, 106, .4, '#F28C00') + paw(200, 156, 1, '#F28C00'),
  },
  stocks: {
    label: 'Share market', style: 'dots', bg: '#4FB477', alt: '#7ACB97', shadow: 130, draw:
      `<rect x="120" y="212" width="12" height="20" fill="${INK}"/><rect x="268" y="212" width="12" height="20" fill="${INK}"/>` +
      `<rect x="78" y="58" width="244" height="158" rx="12" fill="#FFFFFF" ${S(5)}/>` +
      `<path d="M92 100 H308 M92 140 H308 M92 180 H308" fill="none" stroke="#E9DFC9" stroke-width="2"/>` +
      [[106, 150, 34, '#D21F14'], [140, 132, 40, '#00924A'], [174, 142, 30, '#D21F14'], [208, 112, 44, '#00924A'], [242, 120, 36, '#00924A'], [276, 88, 48, '#00924A']]
        .map(([x, y, h, c]) => `<path d="M${x + 7} ${y - 10} V${y + h + 10}" fill="none" ${S(2.5)}/><rect x="${x}" y="${y}" width="14" height="${h}" rx="2" fill="${c}" ${S(3)}/>`).join('') +
      `<path d="M98 196 L140 174 L176 182 L214 146 L250 156 L292 104" fill="none" stroke="#2F5BEA" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M304 88 L280 96 L298 114 Z" fill="#2F5BEA" ${S(3)}/>`,
  },
  tennis: {
    label: 'Tennis', bg: '#3FA06B', alt: '#5FBA86', shadow: 160, defs: '<clipPath id="tr"><ellipse cx="170" cy="96" rx="36" ry="48"/></clipPath>', draw:
      `<rect x="30" y="164" width="10" height="68" fill="#FFFFFF" ${S(3)}/><rect x="360" y="164" width="10" height="68" fill="#FFFFFF" ${S(3)}/>` +
      `<g stroke="${INK}" stroke-width="1.5" opacity=".55">` + Array.from({ length: 20 }, (_, i) => `<path d="M${46 + i * 16} 180 V230"/>`).join('') + Array.from({ length: 4 }, (_, i) => `<path d="M40 ${190 + i * 12} H360"/>`).join('') + '</g>' +
      `<rect x="36" y="170" width="328" height="10" rx="3" fill="#FFFFFF" ${S(3)}/>` +
      `<g transform="rotate(-28 170 130)"><g clip-path="url(#tr)" stroke="#FFFFFF" stroke-width="2" opacity=".9">` + Array.from({ length: 9 }, (_, i) => `<path d="M${134 + i * 9} 40 V150"/><path d="M120 ${52 + i * 11} H220"/>`).join('') + '</g>' +
      `<ellipse cx="170" cy="96" rx="40" ry="52" fill="none" stroke="#D21F14" stroke-width="9"/><ellipse cx="170" cy="96" rx="44" ry="56" fill="none" ${S(3)}/>` +
      `<path d="M162 150 L170 146 L178 150 V158 H162 Z" fill="#D21F14" ${S(3)}/><rect x="163" y="156" width="14" height="58" rx="5" fill="${INK}"/></g>` +
      `<circle cx="276" cy="96" r="20" fill="#D7E84A" ${S()}/><path d="M258 88 C270 96 270 108 262 114 M294 80 C282 90 282 104 290 112" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>`,
  },
  'football-2': {
    label: 'Football', bg: '#5CC086', alt: '#7FD3A0', shadow: 150, draw:
      `<rect x="56" y="72" width="288" height="152" rx="6" fill="#3FA06B" ${S(5)}/>` +
      Array.from({ length: 4 }, (_, i) => `<rect x="${92 + i * 72}" y="74" width="36" height="148" fill="#4BB077"/>`).join('') +
      `<g fill="none" stroke="#FFFFFF" stroke-width="3"><rect x="66" y="82" width="268" height="132"/><path d="M200 82 V214"/><circle cx="200" cy="148" r="26"/><rect x="66" y="114" width="40" height="68"/><rect x="294" y="114" width="40" height="68"/></g>` +
      `<rect x="56" y="130" width="10" height="36" fill="#FFFFFF" ${S(3)}/><rect x="334" y="130" width="10" height="36" fill="#FFFFFF" ${S(3)}/>` +
      `<circle cx="236" cy="168" r="14" fill="#FFFFFF" ${S(3)}/><path d="M236 160 l7 5 l-3 8 h-8 l-3 -8 Z" fill="${INK}"/>`,
  },
  'cricket-2': {
    label: 'Cricket', bg: '#5CC086', alt: '#7FD3A0', draw:
      [72, 92, 112].map((x) => `<rect x="${x}" y="140" width="10" height="84" rx="3" fill="#FFFFFF" ${S(3)}/>`).join('') +
      `<rect x="70" y="110" width="26" height="7" rx="3" fill="#FFD400" transform="rotate(-24 83 113)" ${S(3)}/><rect x="104" y="96" width="26" height="7" rx="3" fill="#FFD400" transform="rotate(32 117 99)" ${S(3)}/>` +
      `<path d="M150 136 q8 -6 14 -2 M146 150 q10 -4 16 2" fill="none" ${S(3)}/>` +
      `<circle cx="244" cy="140" r="58" fill="#D21F14" ${S(5)}/>` +
      `<path d="M200 104 C228 128 260 152 286 178 M196 116 C224 140 256 164 280 188" fill="none" stroke="#F3EFE7" stroke-width="3" stroke-dasharray="4 6" stroke-linecap="round"/>` +
      `<path d="M206 98 C234 124 266 148 292 172" fill="none" stroke="${INK}" stroke-width="2" opacity=".35"/>`,
  },
  'trophy-2': {
    label: 'Winners podium', bg: '#5CC086', alt: '#7FD3A0', shadow: 140, draw:
      [[100, 62, '#D21F14'], [130, 50, '#2F5BEA'], [292, 70, '#FFD400'], [318, 96, '#D21F14'], [84, 120, '#FFD400'], [306, 140, '#2F5BEA']]
        .map(([x, y, c], i) => `<rect x="${x}" y="${y}" width="10" height="6" rx="1" fill="${c}" transform="rotate(${i * 37} ${x + 5} ${y + 3})" ${S(1.5)}/>`).join('') +
      `<rect x="80" y="174" width="80" height="54" rx="3" fill="#CFD6E0" ${S()}/><rect x="160" y="144" width="80" height="84" rx="3" fill="#FFD400" ${S()}/><rect x="240" y="190" width="80" height="38" rx="3" fill="#E8A060" ${S()}/>` +
      `<g font-family="Liberation Sans,Arial,Helvetica,sans-serif" font-weight="700" text-anchor="middle" fill="${INK}"><text x="120" y="210" font-size="26">2</text><text x="200" y="196" font-size="34">1</text><text x="280" y="218" font-size="22">3</text></g>` +
      `<path d="M182 60 L200 96 L218 60" fill="none" stroke="#2F5BEA" stroke-width="8" stroke-linejoin="round"/><path d="M182 60 L200 96 L218 60" fill="none" ${S(2)}/>` +
      `<circle cx="200" cy="112" r="20" fill="#FFD400" ${S()}/><path d="M200 101 l3.5 7 l7.5 1 l-5.5 5 l1.5 7.5 l-7 -4 l-7 4 l1.5 -7.5 l-5.5 -5 l7.5 -1 Z" fill="${INK}"/>`,
  },
  // No flag on these two, so the same drawing also serves the foreign-news copies (<tag>-2-w.svg, see "alsoW").
  'government-2': {
    label: 'Government papers', bg: '#FFB000', alt: '#FFD400', alsoW: true, draw:
      `<rect x="112" y="80" width="150" height="140" rx="4" fill="#F3EFE7" transform="rotate(-6 187 150)" ${S()}/>` +
      `<rect x="132" y="70" width="150" height="148" rx="4" fill="#FFFFFF" ${S()}/>` +
      `<path d="M150 96 H262 M150 112 H262 M150 128 H240 M150 144 H256 M150 160 H222" fill="none" stroke="#B8B0A0" stroke-width="4" stroke-linecap="round"/>` +
      `<circle cx="236" cy="182" r="26" fill="none" stroke="#D21F14" stroke-width="5"/><circle cx="236" cy="182" r="17" fill="none" stroke="#D21F14" stroke-width="3"/><path d="M236 171 l3.5 7 l7.5 1 l-5.5 5 l1.5 7.5 l-7 -4 l-7 4 l1.5 -7.5 l-5.5 -5 l7.5 -1 Z" fill="#D21F14"/>` +
      `<g transform="rotate(38 300 140)"><rect x="292" y="80" width="16" height="96" rx="6" fill="#2F5BEA" ${S()}/><path d="M292 176 H308 L300 200 Z" fill="#E8C98A" ${S(3)}/><path d="M300 192 V200" fill="none" ${S(3)}/><rect x="290" y="96" width="20" height="8" rx="2" fill="#FFD400" ${S(2.5)}/></g>`,
  },
  'diplomacy-2': {
    label: 'Visit and talks', bg: '#FFB000', alt: '#FFD400', alsoW: true, shadow: 90, draw:
      `<circle cx="200" cy="146" r="72" fill="#5BB8E8" ${S(5)}/>` +
      `<path d="M150 104 C166 96 182 104 186 118 C190 132 176 138 168 150 C160 162 150 160 142 150 C134 138 138 112 150 104 Z M214 92 C232 88 254 100 258 118 C262 136 244 140 236 132 C226 122 210 112 214 92 Z M206 166 C222 158 246 164 250 182 C252 196 232 206 218 200 C204 194 196 176 206 166 Z" fill="#7FD3A0" ${S(3)}/>` +
      `<path d="M146 92 C170 34 250 34 270 96" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-dasharray="2 9" stroke-linecap="round"/>` +
      `<g transform="translate(212 50) rotate(18)"><path d="M-20 0 L18 -3 Q26 0 18 3 L-20 0 Z M-2 -1 L-10 -16 H-4 L8 -2 Z M-2 1 L-10 16 H-4 L8 2 Z M-18 0 L-24 -8 H-20 L-14 -1 Z M-18 0 L-24 8 H-20 L-14 1 Z" fill="#FFFFFF" ${S(2.5)}/></g>` +
      `<path d="M146 92 c-12 0 -18 -10 -18 -18 a18 18 0 0 1 36 0 c0 8 -6 18 -18 18 Z" fill="#D21F14" transform="translate(0 4)" ${S(3)}/><circle cx="146" cy="78" r="6" fill="#FFFFFF" ${S(2)}/>` +
      `<path d="M270 96 c-12 0 -18 -10 -18 -18 a18 18 0 0 1 36 0 c0 8 -6 18 -18 18 Z" fill="#2F5BEA" transform="translate(0 4)" ${S(3)}/><circle cx="270" cy="78" r="6" fill="#FFFFFF" ${S(2)}/>`,
  },
  'tech-2': {
    label: 'Computer', style: 'dots', bg: '#A99EE8', alt: '#C9C2F2', shadow: 130, draw:
      `<rect x="112" y="66" width="176" height="120" rx="10" fill="${INK}" ${S()}/><rect x="124" y="78" width="152" height="96" rx="4" fill="#2F5BEA"/>` +
      `<path d="M180 108 l-18 18 l18 18 M220 108 l18 18 l-18 18 M210 100 l-20 52" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M84 190 H316 L300 210 H100 Z" fill="#CFD6E0" ${S()}/><rect x="180" y="190" width="40" height="6" rx="3" fill="${INK}" opacity=".5"/>`,
  },
};

const only = process.argv.slice(2);
for (const [name, sc] of Object.entries(SCENES)) {
  if (only.length && !only.includes(name)) continue;
  for (const n of sc.alsoW ? [name, name + '-w'] : [name]) {
    fs.writeFileSync(`public/art/${n}.svg`, frame(sc, false));
    fs.writeFileSync(`public/art/${n}-n.svg`, frame(sc, true));
    console.log('wrote', n);
  }
}
