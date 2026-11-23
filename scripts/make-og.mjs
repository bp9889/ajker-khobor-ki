// Link-preview images (WhatsApp, Facebook): one 1200x780 PNG in public/og for every day picture in public/art.
// A story's preview is /og/<its picture name>.png (app/[[...path]]/page.jsx), so every picture needs one.
// Run after adding pictures: node scripts/make-og.mjs        (only the missing ones)
//                            node scripts/make-og.mjs --all  (redraw all)
import fs from 'fs';
import sharp from 'sharp';

const all = process.argv.includes('--all');
const names = fs.readdirSync('public/art').filter((f) => f.endsWith('.svg') && !f.endsWith('-n.svg')).map((f) => f.slice(0, -4));
let made = 0;
for (const name of names) {
  const out = `public/og/${name}.png`;
  if (!all && fs.existsSync(out)) continue;
  await sharp(fs.readFileSync(`public/art/${name}.svg`), { density: 216 }).resize(1200, 780).png({ compressionLevel: 9 }).toFile(out);
  console.log('made', out); made++;
}
console.log(made ? made + ' preview image(s) made' : 'all pictures already have a preview image');
