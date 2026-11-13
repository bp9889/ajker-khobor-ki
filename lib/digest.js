// Every 6 hours: picks the main headlines, reads each article's public text, and asks an AI model to
// retell what happened in one simple paragraph (in its own words), then writes a fresh quiz.
// The result is cached, so the model is called a handful of times a day, not once per visitor.
import { unstable_cache } from 'next/cache';
import { getVercelOidcToken } from '@vercel/oidc';
import { getNews } from './news';
import { getMany } from './article';
import fs from 'fs';

const SIX_HOURS = 6 * 60 * 60 * 1000;
const MODEL = 'anthropic/claude-haiku-5.5';
const WANT = { Bangladesh: 7, World: 5, Tech: 3, Sport: 3 };
const BATCH = 6;

const STORY_PROMPT = `You write for "AJKER খবর KI?", a news site for young readers in Bangladesh (age 12 and up).
Its one job: let a reader understand what happened in about a minute, so they only open the original article if they want the details.
You get a JSON list of news items. Each has an id, section, source, title, desc (the publisher's short blurb) and text (the opening of the article; it may be empty).

Return ONE JSON object and nothing else, in this shape:
{"stories":[{"id":"...","headline":"...","brief":"...","summary":"...","points":["...","...","..."],"why":"...","terms":[{"term":"...","meaning":"..."}],"ask":"..."}]}

Rules for stories (one for EVERY item, same ids):
- Use ONLY facts found in text, title and desc. Never add names, numbers, dates, causes or outcomes that are not there. Never guess.
- summary: THE OVERVIEW. One paragraph of 5 to 7 short sentences (about 90 to 140 words) that tells the reader what happened: who, what, where, when, and the reason or result if the text gives one. Follow the order of events and put the most important fact first. Use plain words a 12-year-old knows and explain any hard idea inside the sentence. Re-tell it in your own words. Do not copy sentences from the text and do not use quotation marks. If text is empty or very short, write only what title and desc support (2 sentences) and never pad.
- headline: the news in plain words, at most 75 characters. No clickbait.
- brief: ONE sentence, at most 130 characters, that says the main fact. It is the teaser on a small card.
- points: 3 one-sentence key facts from the text (2 if there is little).
- why: 1 or 2 sentences on why this could matter to a young person in Bangladesh. Say "could" or "may" when it is not certain. Do not invent effects.
- terms: 0 to 3 hard words, places or organisations from the item, each with a one-sentence general meaning that is well-established knowledge.
- ask: the story as a short curious question, at most 30 characters, e.g. "Why are onions so pricey?".
- Stay neutral. No opinions on politics, parties or people. Where the text gives only one side's claim, say whose claim it is ("police say", "he said"). For deaths, crime or disasters, be calm and respectful, with no graphic detail. Do not name suspects or victims unless the title does.`;

const QUIZ_PROMPT = `You write quiz questions for "AJKER খবর KI?", a news site for young readers in Bangladesh (age 12 and up).
You get a JSON list of today's news items (id, section, source, title, desc).

Return ONE JSON object and nothing else, in this shape:
{"quiz":[{"topic":"...","q":"...","options":["...","...","..."],"answer":0,"why":"..."}]}

Rules: exactly 5 questions, each on a different topic label chosen from: Politics, Bangladesh, World, Sport, Health, Tech, Money, Science, Climate.
- Base each question on one of the items, or on basic, well-established general knowledge about that item's topic.
- 3 or 4 options, exactly one clearly correct. "answer" is its index starting at 0. Vary the position of the right answer.
- why: one or two sentences explaining the right answer in simple words.
- Never ask about anything the items do not settle (no predictions, no disputed claims, nothing about individual victims or suspects).`;

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

// One AI call. Tries the next model if one is busy or retired. Returns the parsed JSON object.
async function ask(pv, system, payload, maxTokens) {
  const body = (model) => JSON.stringify(Object.assign({ model: model, max_tokens: maxTokens, temperature: 0.4, messages: [{ role: 'system', content: system }, { role: 'user', content: JSON.stringify(payload) }] }, pv.effort ? { reasoning_effort: pv.effort } : {}));
  let res, lastErr;
  for (const model of [pv.model].concat(pv.fallbacks || [])) {
    try {
      res = await fetch(pv.url, { method: 'POST', headers: { authorization: 'Bearer ' + pv.key, 'content-type': 'application/json' }, body: body(model), signal: AbortSignal.timeout(80000) });
    } catch (err) { lastErr = err; res = null; continue; }
    if (res.ok || ![404, 429, 500, 503].includes(res.status)) break;
  }
  if (!res) throw lastErr || new Error('AI request failed');
  if (!res.ok) throw new Error('AI ' + pv.name + ' ' + res.status + ': ' + (await res.text()).slice(0, 300));
  const text = (await res.json()).choices[0].message.content || '';
  return JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));
}

function pickFive(stories) {
  const by = (sec) => stories.filter((x) => x.section === sec);
  const out = [];
  const add = (x) => { if (x && out.indexOf(x.id) < 0) out.push(x.id); };
  by('Bangladesh').slice(0, 2).forEach(add);
  add(by('World')[0]);
  add(by('Sport')[0] || by('Tech')[0]);
  add(by('Tech')[0] || by('World')[1]);
  stories.forEach((x) => { if (out.length < 5) add(x); });
  return out.slice(0, 5);
}

async function build(pv) {
  const news = await getNews();
  const chosen = pick(news);
  if (chosen.length < 5) throw new Error('not enough headlines');
  // Read each article so the overview has real content to retell (falls back to the short blurb).
  const texts = await getMany(chosen);
  const items = chosen.map((x, i) => ({ id: x.id, section: x.section, source: x.source, title: x.title, desc: x.desc, text: texts[i] }));
  const batches = [];
  for (let i = 0; i < items.length; i += BATCH) batches.push(items.slice(i, i + BATCH));
  const quizIn = chosen.map((x) => ({ id: x.id, section: x.section, source: x.source, title: x.title, desc: x.desc }));
  const [parts, quizRes] = await Promise.all([
    Promise.allSettled(batches.map((b) => ask(pv, STORY_PROMPT, b, 9000))),
    ask(pv, QUIZ_PROMPT, quizIn, 5000),
  ]);
  const byId = new Map(chosen.map((x) => [x.id, x]));
  const deep = new Map(items.map((x) => [x.id, x.text.length > 400]));
  const stories = [];
  for (const part of parts) {
    if (part.status !== 'fulfilled') { console.error('[digest] one batch failed:', String(part.reason && part.reason.message || part.reason)); continue; }
    for (const s of part.value.stories || []) {
      const src = byId.get(s && s.id);
      if (!src || !str(s.summary, 1300)) continue;
      const summary = str(s.summary, 1300);
      stories.push(Object.assign({}, src, {
        headline: str(s.headline, 110) || src.title, summary: summary,
        brief: str(s.brief, 150) || summary.split(/(?<=[.!?])\s/)[0].slice(0, 150),
        deep: !!deep.get(s.id),
        points: (Array.isArray(s.points) ? s.points : []).map((p) => str(p, 260)).filter(Boolean).slice(0, 3),
        why: str(s.why, 400), ask: str(s.ask, 40),
        terms: (Array.isArray(s.terms) ? s.terms : []).map((t) => ({ term: str(t && t.term, 60), meaning: str(t && t.meaning, 260) })).filter((t) => t.term && t.meaning).slice(0, 3),
      }));
      byId.delete(s.id);
    }
  }
  if (stories.length < 8) throw new Error('AI returned too few stories (' + stories.length + ')');
  const quiz = (Array.isArray(quizRes.quiz) ? quizRes.quiz : []).map((q) => ({ topic: str(q && q.topic, 24), q: str(q && q.q, 240), opts: (Array.isArray(q && q.options) ? q.options : []).map((o) => str(String(o), 90)).filter(Boolean).slice(0, 4), a: Number(q && q.answer), why: str(q && q.why, 400) }))
    .filter((q) => q.q && q.opts.length >= 3 && Number.isInteger(q.a) && q.a >= 0 && q.a < q.opts.length && q.why).slice(0, 5);
  if (quiz.length < 3) throw new Error('AI returned too few quiz questions');
  return { stories: stories, five: pickFive(stories), quiz: quiz, madeAt: new Date().toISOString() };
}

let current = null;
let lastFail = 0;
const cached = unstable_cache(async (slot) => build(current), ['akk-digest-v3'], { revalidate: 6 * 60 * 60 });

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
