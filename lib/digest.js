// Every 6 hours: picks the main headlines, asks an AI model to explain each one in simple words
// (using only the publisher's headline and short description), and writes a fresh quiz.
// The result is cached, so the model is called about four times a day, not once per visitor.
import { unstable_cache } from 'next/cache';
import { getVercelOidcToken } from '@vercel/oidc';
import { getNews } from './news';
import fs from 'fs';

const SIX_HOURS = 6 * 60 * 60 * 1000;
const MODEL = 'anthropic/claude-haiku-5.5';
const WANT = { Bangladesh: 7, World: 5, Tech: 3, Sport: 3 };

const PROMPT = `You write for "AJKER খবর KI?", a news site for young readers in Bangladesh (age 12 and up).
You get a JSON list of news items. Each has an id, section, source, title and desc (the publisher's short description; it may be empty).

Return ONE JSON object and nothing else, in this shape:
{"stories":[{"id":"...","headline":"...","summary":"...","points":["...","...","..."],"why":"...","terms":[{"term":"...","meaning":"..."}],"ask":"..."}],
 "five":["id","id","id","id","id"],
 "quiz":[{"topic":"...","q":"...","options":["...","...","..."],"answer":0,"why":"..."}]}

Rules for stories (one for EVERY item, same ids):
- Use ONLY what the title and desc say. Never add names, numbers, dates, causes or outcomes that are not there. If the desc is thin, write less.
- headline: the news in plain words, at most 75 characters. No clickbait.
- summary: 2 short sentences a 12-year-old can follow. Short common words. No jargon.
- points: 2 or 3 one-sentence facts taken from the title/desc.
- why: 1 or 2 sentences on why this could matter to a young person in Bangladesh. Say "could" or "may" when it is not certain. Do not invent effects.
- terms: 0 to 3 hard words, places or organisations from the item, each with a one-sentence general meaning that is well-established knowledge.
- ask: the story as a short curious question, at most 30 characters, e.g. "Why are onions so pricey?".
- Stay neutral. No opinions on politics, parties or people. For deaths, crime or disasters, be calm and respectful, with no graphic detail.

Rules for five: the 5 ids a young reader in Bangladesh most needs today. At least 2 from Bangladesh, and at least 3 different sections.

Rules for quiz: exactly 5 questions, each on a different topic label chosen from: Politics, Bangladesh, World, Sport, Health, Tech, Money, Science, Climate.
- Base each question on one of the items, or on basic, well-established general knowledge about that item's topic.
- 3 or 4 options, exactly one clearly correct. "answer" is its index starting at 0. Vary the position of the right answer.
- why: one or two sentences explaining the right answer in simple words.
- Never ask about anything the items do not settle (no predictions, no disputed claims).`;

function pick(news) {
  const out = [];
  for (const sec of Object.keys(WANT)) out.push(...news.filter((x) => x.section === sec).slice(0, WANT[sec]));
  return out;
}

const str = (v, max) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : '');

// Which AI to call. Any one of these keys in the Vercel env vars turns the summaries and quiz on.
// Gemini, Groq and OpenRouter have free tiers with no card; the Vercel AI Gateway needs a card on file.
async function provider() {
  const e = process.env;
  if (e.GEMINI_API_KEY) return { name: 'gemini', url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', key: e.GEMINI_API_KEY, model: e.AKK_MODEL || 'gemini-3.1-flash-lite', fallbacks: ['gemini-3.8-flash', 'gemini-flash-latest'], effort: 'low' };
  if (e.GROQ_API_KEY) return { name: 'groq', url: 'https://api.groq.com/openai/v1/chat/completions', key: e.GROQ_API_KEY, model: e.AKK_MODEL || 'llama-3.3-70b-versatile' };
  if (e.OPENROUTER_API_KEY) return { name: 'openrouter', url: 'https://openrouter.ai/api/v1/chat/completions', key: e.OPENROUTER_API_KEY, model: e.AKK_MODEL || 'google/gemini-2.0-flash-exp:free' };
  const key = e.AI_GATEWAY_API_KEY || (await getVercelOidcToken().catch(() => '')) || e.VERCEL_OIDC_TOKEN || '';
  return key ? { name: 'gateway', url: 'https://ai-gateway.vercel.sh/v1/chat/completions', key: key, model: e.AKK_MODEL || MODEL } : null;
}

async function build(pv) {
  const news = await getNews();
  const chosen = pick(news);
  if (chosen.length < 5) throw new Error('not enough headlines');
  const body = (model) => JSON.stringify(Object.assign({ model: model, max_tokens: 12000, temperature: 0.4, messages: [{ role: 'system', content: PROMPT }, { role: 'user', content: JSON.stringify(chosen.map((x) => ({ id: x.id, section: x.section, source: x.source, title: x.title, desc: x.desc }))) }] }, pv.effort ? { reasoning_effort: pv.effort } : {}));
  let res, lastErr;
  for (const model of [pv.model].concat(pv.fallbacks || [])) {
    try {
      res = await fetch(pv.url, { method: 'POST', headers: { authorization: 'Bearer ' + pv.key, 'content-type': 'application/json' }, body: body(model), signal: AbortSignal.timeout(75000) });
    } catch (err) { lastErr = err; res = null; continue; }
    if (res.ok || ![404, 429, 500, 503].includes(res.status)) break;
  }
  if (!res) throw lastErr || new Error('AI request failed');
  if (!res.ok) throw new Error('AI ' + pv.name + ' ' + res.status + ': ' + (await res.text()).slice(0, 300));
  const text = (await res.json()).choices[0].message.content || '';
  const data = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));
  const byId = new Map(chosen.map((x) => [x.id, x]));
  const stories = [];
  for (const s of data.stories || []) {
    const src = byId.get(s && s.id);
    if (!src || !str(s.summary, 600)) continue;
    stories.push(Object.assign({}, src, {
      headline: str(s.headline, 110) || src.title, summary: str(s.summary, 600),
      points: (Array.isArray(s.points) ? s.points : []).map((p) => str(p, 260)).filter(Boolean).slice(0, 3),
      why: str(s.why, 400), ask: str(s.ask, 40),
      terms: (Array.isArray(s.terms) ? s.terms : []).map((t) => ({ term: str(t && t.term, 60), meaning: str(t && t.meaning, 260) })).filter((t) => t.term && t.meaning).slice(0, 3),
    }));
    byId.delete(s.id);
  }
  if (stories.length < 5) throw new Error('AI returned too few stories');
  const five = (Array.isArray(data.five) ? data.five : []).filter((id, i, a) => a.indexOf(id) === i && stories.some((s) => s.id === id)).slice(0, 5);
  for (const s of stories) if (five.length < 5 && five.indexOf(s.id) < 0) five.push(s.id);
  const quiz = (Array.isArray(data.quiz) ? data.quiz : []).map((q) => ({ topic: str(q && q.topic, 24), q: str(q && q.q, 240), opts: (Array.isArray(q && q.options) ? q.options : []).map((o) => str(String(o), 90)).filter(Boolean).slice(0, 4), a: Number(q && q.answer), why: str(q && q.why, 400) }))
    .filter((q) => q.q && q.opts.length >= 3 && Number.isInteger(q.a) && q.a >= 0 && q.a < q.opts.length && q.why).slice(0, 5);
  return { stories: stories, five: five, quiz: quiz, madeAt: new Date().toISOString() };
}

let current = null;
let lastFail = 0;
const cached = unstable_cache(async (slot) => build(current), ['akk-digest-v2'], { revalidate: 6 * 60 * 60 });

export async function getDigest() {
  // For working offline: AKK_FIXTURE=path/to/digest.json serves a saved digest instead of calling the feeds and AI.
  if (process.env.AKK_FIXTURE) return JSON.parse(fs.readFileSync(process.env.AKK_FIXTURE, 'utf8'));
  const slot = Math.floor(Date.now() / SIX_HOURS);
  const news = await getNews();
  let ai = null;
  if (Date.now() - lastFail > 10 * 60 * 1000) {
    try {
      current = await provider();
      if (!current) throw new Error('no AI key configured');
      ai = await cached(slot);
    } catch (e) { lastFail = Date.now(); console.error('[digest] simple summaries unavailable:', String(e && e.message || e)); }
  }
  let items = news, quiz = [];
  if (ai) {
    const first = ai.five.map((id) => ai.stories.find((s) => s.id === id)).filter(Boolean);
    const rest = ai.stories.filter((s) => ai.five.indexOf(s.id) < 0);
    const have = new Set(ai.stories.map((s) => s.id));
    items = first.concat(rest, news.filter((x) => !have.has(x.id)).slice(0, 12));
    quiz = ai.quiz;
  }
  return { items: items, quiz: quiz, ai: !!ai, slot: slot, nextAt: (slot + 1) * SIX_HOURS, madeAt: ai ? ai.madeAt : null };
}
