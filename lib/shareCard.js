// "Share as image": draws a story as a 1080x1350 picture (portrait, the shape WhatsApp and Facebook show best) in the
// reader's browser: the site's name, the story's own picture, the section, headline, short version, source and link.
// Loaded only when someone taps the button (Site.shareImage), so it adds nothing to the page. Never draws a person.
const W = 1080, H = 1350, PAD = 56, INK = '#1A1714';
const font = (weight, size) => weight + ' ' + size + "px 'Anek Bangla', system-ui, sans-serif";

function roundRect(x, l, t, w, h, r) {
  x.beginPath(); x.moveTo(l + r, t); x.arcTo(l + w, t, l + w, t + h, r); x.arcTo(l + w, t + h, l, t + h, r); x.arcTo(l, t + h, l, t, r); x.arcTo(l, t, l + w, t, r); x.closePath();
}

// Breaks text into at most maxLines lines that fit maxW, ending with "…" when it had to cut.
function wrap(x, text, maxW, maxLines) {
  const words = String(text || '').split(/\s+/).filter(Boolean), lines = [];
  let cur = '', i = 0;
  for (; i < words.length; i++) {
    const t = cur ? cur + ' ' + words[i] : words[i];
    if (x.measureText(t).width <= maxW || !cur) { cur = t; continue; }
    lines.push(cur); cur = words[i];
    if (lines.length === maxLines) break;
  }
  if (lines.length < maxLines && cur) { lines.push(cur); i = words.length; }
  if (i < words.length && lines.length) {
    let last = lines[lines.length - 1];
    while (last.length > 1 && x.measureText(last + '…').width > maxW) last = last.replace(/\s*\S+$/, '') || last.slice(0, -1);
    lines[lines.length - 1] = last + '…';
  }
  return lines;
}

const loadImage = (src) => new Promise((resolve, reject) => { const im = new Image(); im.onload = () => resolve(im); im.onerror = reject; im.src = src; });

export async function drawCard({ title, brief, picture, section, color, source, link, footer }) {
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  try { await Promise.all([document.fonts.load(font(800, 60), title), document.fonts.load(font(500, 38), brief || 'a')]); } catch (e) { /* draw with what we have */ }

  x.fillStyle = '#F7F3EA'; x.fillRect(0, 0, W, H);
  // Name bar.
  x.fillStyle = '#D21F14'; x.fillRect(0, 0, W, 118);
  x.fillStyle = '#FFFFFF'; x.font = font(800, 56); x.textBaseline = 'middle'; x.fillText('AJKER খবর KI?', PAD, 62);

  // The story's picture (same drawing as on the site), framed.
  const pw = 880, ph = Math.round(pw * 260 / 400), pl = (W - pw) / 2, pt = 158;
  try { const im = await loadImage(picture); x.save(); roundRect(x, pl, pt, pw, ph, 26); x.clip(); x.drawImage(im, pl, pt, pw, ph); x.restore(); } catch (e) { x.fillStyle = color; roundRect(x, pl, pt, pw, ph, 26); x.fill(); }

  // Section pill.
  let y = pt + ph + 40;
  x.font = font(800, 30); x.textBaseline = 'middle';
  const lw = x.measureText(section).width + 44;
  x.fillStyle = color; roundRect(x, PAD, y, lw, 54, 27); x.fill();
  x.fillStyle = '#FFFFFF'; x.fillText(section, PAD + 22, y + 28);
  y += 54 + 26;

  // Headline, then the short version in whatever room is left above the footer.
  x.textBaseline = 'alphabetic'; x.fillStyle = INK; x.font = font(800, 60);
  const hl = wrap(x, title, W - PAD * 2, 3);
  hl.forEach((l, i) => x.fillText(l, PAD, y + 56 + i * 68)); y += hl.length * 68 + 30;
  const room = Math.floor((H - 130 - y) / 50);
  if (brief && room > 0) {
    x.fillStyle = '#5A5248'; x.font = font(500, 38);
    wrap(x, brief, W - PAD * 2, room).forEach((l, i) => x.fillText(l, PAD, y + 38 + i * 50));
  }

  // Footer: what the site does, where to read it, and who reported it.
  x.fillStyle = INK; x.fillRect(0, H - 114, W, 114);
  x.textBaseline = 'middle'; x.fillStyle = '#FFD400'; x.font = font(800, 34); x.fillText(footer, PAD, H - 76);
  x.fillStyle = '#FFFFFF'; x.font = font(500, 27);
  const shortLink = String(link).replace(/^https?:\/\//, '');
  x.fillText(shortLink, PAD, H - 34);
  if (source) {
    x.textAlign = 'right'; x.fillStyle = '#CFC6B6';
    const room2 = W - PAD * 2 - x.measureText(shortLink).width - 40;
    if (room2 > 120) x.fillText(wrap(x, source, room2, 1)[0] || '', W - PAD, H - 34);
    x.textAlign = 'left';
  }
  return c;
}
