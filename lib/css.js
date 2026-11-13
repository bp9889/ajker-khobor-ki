// Turns a CSS text string ("color:red;font-size:12px") into the style object React wants.
const cache = new Map();
export function css(text) {
  let o = cache.get(text);
  if (o) return o;
  o = {};
  for (const part of text.split(';')) {
    const i = part.indexOf(':');
    if (i < 0) continue;
    let k = part.slice(0, i).trim();
    const val = part.slice(i + 1).trim();
    if (!k || !val) continue;
    if (!k.startsWith('--')) k = k.replace(/^-ms-/, 'ms-').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    o[k] = val;
  }
  cache.set(text, o);
  return o;
}
