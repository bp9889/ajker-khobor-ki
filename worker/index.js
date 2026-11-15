// Cloudflare worker for AJKER খবর KI?. Every page and picture is a plain file served by Cloudflare for free;
// only these two small jobs run code (see wrangler.jsonc "run_worker_first"):
//   GET  /api/simpler?id=<story id>  "Explain it simpler", written once per story by the AI and then kept in Cloudflare's cache
//   POST /api/report                 "Report a mistake", written to the worker's log as "[report] {...}"
const KINDS = ['overview', 'quiz', 'fact', 'other'];
const clean = (v, n) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, n) : '');
const json = (o, status = 200, extra = {}) => new Response(JSON.stringify(o), { status, headers: Object.assign({ 'content-type': 'application/json; charset=utf-8' }, extra) });

const SIMPLE_PROMPT = `You retell a short news overview for a 10-year-old reader in Bangladesh.
Rules:
- Use ONLY the facts in the overview you are given. Add no new names, numbers, causes or opinions.
- Write 3 to 5 short sentences in very easy English. Words a child already knows. No jargon.
- If a hard word must stay, explain it in brackets right after it.
- Keep every name and number exactly as given.
Return JSON only: {"text":"..."}`;
const MODELS = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];

async function writeSimpler(env, story) {
  if (!env.GEMINI_API_KEY) throw new Error('no key');
  let last = '';
  for (const model of MODELS) {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
      method: 'POST',
      headers: { authorization: 'Bearer ' + env.GEMINI_API_KEY, 'content-type': 'application/json' },
      body: JSON.stringify({ model, max_tokens: 600, temperature: 0.4, reasoning_effort: 'low', messages: [{ role: 'system', content: SIMPLE_PROMPT }, { role: 'user', content: JSON.stringify({ headline: story.headline, overview: story.summary }) }] }),
    });
    if (!res.ok) { last = model + ' ' + res.status; if ([404, 429, 500, 503].includes(res.status)) continue; break; }
    const t = ((await res.json()).choices[0].message.content || '');
    const text = clean(JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1)).text, 900);
    if (text) return text;
  }
  throw new Error('AI failed ' + last);
}

async function simpler(request, env, ctx) {
  const id = new URL(request.url).searchParams.get('id') || '';
  if (!/^[A-Za-z0-9-]{1,80}$/.test(id)) return json({ error: 'bad id' }, 400);
  const cache = caches.default, key = new Request(new URL('/api/simpler?id=' + id, request.url).toString());
  const hit = await cache.match(key);
  if (hit) return hit;
  const src = await env.ASSETS.fetch(new Request(new URL('/simpler-src/' + id + '.json', request.url)));
  if (!src.ok) return json({ error: 'not found' }, 404);
  const story = await src.json();
  if (!story.summary) return json({ error: 'not found' }, 404);
  try {
    const text = await writeSimpler(env, story);
    const res = json({ text }, 200, { 'cache-control': 'public, max-age=604800' });
    ctx.waitUntil(cache.put(key, res.clone()));
    return res;
  } catch (e) {
    console.error('[simpler] failed', String(e && e.message || e).slice(0, 300));
    return json({ error: 'busy' }, 503);
  }
}

async function report(request) {
  let b = null;
  try { const t = await request.text(); if (t.length > 4000) return json({ error: 'too long' }, 413); b = JSON.parse(t); } catch (e) { return json({ error: 'bad request' }, 400); }
  const kind = KINDS.includes(b && b.kind) ? b.kind : 'other';
  const note = clean(b && b.note, 600), title = clean(b && b.title, 160), id = clean(b && b.id, 80), where = clean(b && b.where, 200);
  if (!title && !note) return json({ error: 'empty' }, 400);
  console.warn('[report] ' + JSON.stringify({ at: new Date().toISOString(), kind, id, title, where, note }));
  return json({ ok: true });
}

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/simpler' && request.method === 'GET') return simpler(request, env, ctx);
    if (pathname === '/api/report' && request.method === 'POST') return report(request);
    if (pathname.startsWith('/api/')) return json({ error: 'not found' }, 404);
    return env.ASSETS.fetch(request);
  },
};
