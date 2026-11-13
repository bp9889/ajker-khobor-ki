// Every 6 hours: picks the main headlines, reads each article's public text, and asks an AI model to
// retell what happened in one simple paragraph (in its own words), then writes a fresh quiz.
// The result is cached, so the model is called a handful of times a day, not once per visitor.
import { unstable_cache } from 'next/cache';
import { getVercelOidcToken } from '@vercel/oidc';
import { getNews } from './news';
import { getMany } from './article';
import { FACTS, FACT_SECTIONS, factsForSlot } from '../data/facts';
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

// ---- Quiz: general knowledge people should know, different topics every 6 hours, plus a few about today's news ----
const QUIZ_TOPICS = [
  ['Sports', 'cricket, football, the Olympics, rules, famous records and history (avoid anything that changes often)'],
  ['Health', 'the body, food and nutrition, sleep, hygiene, first aid, common health myths'],
  ['Sex ed', 'puberty, consent, healthy relationships, contraception basics, preventing infections, common myths. Be accurate, calm, respectful and non-explicit, suitable for readers aged 13 and up. No slang and no graphic detail'],
  ['Mind', 'stress, sleep, screen time, asking for help, how emotions work'],
  ['Politics', 'how governments, elections, parliaments, courts, the constitution and the United Nations work; citizens\' rights. Nothing about current parties, leaders or disputes'],
  ['Bangladesh', 'history, geography, culture, nature, language, everyday law'],
  ['World', 'geography, countries, organisations, cultures'],
  ['Science', 'everyday physics, chemistry, biology and space'],
  ['Tech', 'how the internet, phones and AI work; passwords, scams, online safety'],
  ['Money', 'saving, interest, inflation, budgets, scams, consumer and worker rights'],
  ['Climate', 'weather, floods, rising seas, energy, pollution'],
  ['History', 'big events and inventions everyone should know']
];

function rng(seed) { let a = (seed * 2654435761) >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function shuffle(list, seed) { const r = rng(seed), a = list.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

// Which 6 topics this 6-hour slot covers. Sports and sex ed come up on odd slots, politics and health on even ones, the rest rotate.
export function topicsForSlot(slot) {
  const names = QUIZ_TOPICS.map((t) => t[0]);
  const forced = slot % 2 ? ['Sports', 'Sex ed'] : ['Politics', 'Health'];
  const rest = shuffle(names.filter((n) => forced.indexOf(n) < 0), slot);
  return shuffle(forced.concat(rest.slice(0, 4)), slot + 7).map((n) => QUIZ_TOPICS.find((t) => t[0] === n));
}

function quizPrompt(slot) {
  const topics = topicsForSlot(slot);
  return `You write quiz questions for "AJKER খবর KI?", a news site for young readers in Bangladesh (age 12 and up). The quiz should be interesting and teach things every person should know.
You get a JSON list of today's news items (id, section, source, title, desc) for the two news questions.

Return ONE JSON object and nothing else, in this shape:
{"quiz":[{"topic":"...","q":"...","options":["...","...","..."],"answer":0,"why":"..."}]}

Write exactly 8 questions in this order:
${topics.map((t, i) => (i + 1) + '. topic "' + t[0] + '": ' + t[1]).join('\n')}
7. topic "In the news": about one of today's items.
8. topic "In the news": about a different one of today's items.

Rules:
- Make them interesting and a little surprising. Skip the most common quiz questions (capital of France, number of continents, and so on). Variety seed: ${slot}. Mix easy and harder questions.
- Use only facts that are well established and will not change soon. No "currently", "latest" or "most recent". If you are not sure about a number, ask a different question.
- 3 or 4 options, exactly one clearly correct. "answer" is its index starting at 0. Vary the position of the right answer. Keep options short.
- why: one or two sentences that explain the right answer in simple words and teach something. For health and sex ed, add what a person can do about it.
- News questions must be settled by the item's title or desc. No predictions, no disputed claims, nothing about individual victims or suspects.
- Plain words a 12-year-old knows. No trick questions.`;
}

// ---- Did you know? Fresh facts for each section every 6 hours ----
const FACT_THEMES = {
  Sports: ['cricket', 'football', 'the Olympics and athletics', 'odd rules and inventions', 'records from history', 'sport in Bangladesh', 'how sports equipment works'],
  Tech: ['the internet', 'phones', 'AI and robots', 'space and satellites', 'famous inventions', 'video games', 'early computers', 'online safety'],
  Bangladesh: ['nature and animals', 'history and language', 'food and festivals', 'rivers and weather', 'famous firsts', 'cities and places', 'art and music'],
  World: ['animals and nature', 'countries and borders', 'oceans and weather', 'the human body', 'surprising history', 'languages and cultures', 'space and planets']
};

function factsPrompt(slot) {
  const lines = FACT_SECTIONS.map((sec, i) => sec + ': ' + shuffle(FACT_THEMES[sec], slot * 5 + i).slice(0, 3).join('; '));
  return `You write "Did you know?" facts for "AJKER খবর KI?", a news site for young readers in Bangladesh (age 12 and up). The facts should make a reader say "wow, really?".

Return ONE JSON object and nothing else, in this shape:
{"facts":{"Sports":[{"hook":"...","more":"..."}],"Tech":[...],"Bangladesh":[...],"World":[...]}}

Write exactly 3 facts for each of the 4 sections, one per theme listed here (in this order):
${lines.join('\n')}

Rules:
- Every fact must be true, well documented and easy to check. If you are not sure it is true, choose a different fact. Never invent a number: use round numbers or words like "about".
- Facts must not go out of date. No "currently", "latest", "newest" or "the most" for records that change.
- hook: one surprising sentence, at most 150 characters. Do not begin it with "Did you know".
- more: one or two short sentences that explain it, at most 260 characters.
- Plain words a 12-year-old knows. No jargon, no politics, nothing violent or scary. Variety seed: ${slot}.`;
}

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

async function build(pv, slot) {
  const news = await getNews();
  // Look at twice as many headlines as we need, read their articles, and prefer the ones we can read in full.
  // (Some sites, like Dhaka Tribune, block automated readers; their stories are used only to fill free slots.)
  const pool = [];
  for (const sec of Object.keys(WANT)) pool.push(...news.filter((x) => x.section === sec).slice(0, WANT[sec] * 2));
  if (pool.length < 5) throw new Error('not enough headlines');
  const poolTexts = await getMany(pool);
  const rich = pool.map((x, i) => ({ x: x, text: poolTexts[i], ok: poolTexts[i].length > 400 }));
  const items = [];
  for (const sec of Object.keys(WANT)) {
    const inSec = rich.filter((r) => r.x.section === sec);
    inSec.filter((r) => r.ok).concat(inSec.filter((r) => !r.ok)).slice(0, WANT[sec]).forEach((r) => items.push({ id: r.x.id, section: r.x.section, source: r.x.source, title: r.x.title, desc: r.x.desc, text: r.text }));
  }
  const chosen = items.map((it) => pool.find((x) => x.id === it.id));
  const batches = [];
  for (let i = 0; i < items.length; i += BATCH) batches.push(items.slice(i, i + BATCH));
  const quizIn = chosen.map((x) => ({ id: x.id, section: x.section, source: x.source, title: x.title, desc: x.desc }));
  const [parts, quizRes, factsRes] = await Promise.all([
    Promise.allSettled(batches.map((b) => ask(pv, STORY_PROMPT, b, 9000))),
    ask(pv, quizPrompt(slot), quizIn, 7000),
    ask(pv, factsPrompt(slot), { slot: slot }, 4000).catch((e) => { console.error('[digest] facts unavailable:', String(e && e.message || e)); return null; }),
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
    .filter((q) => q.q && q.opts.length >= 3 && Number.isInteger(q.a) && q.a >= 0 && q.a < q.opts.length && q.why).slice(0, 8);
  if (quiz.length < 5) throw new Error('AI returned too few quiz questions');
  // Facts: keep the AI's if they look right, otherwise fill from the hand-written list.
  const bank = factsForSlot(slot), facts = {};
  for (const sec of FACT_SECTIONS) {
    const got = (factsRes && factsRes.facts && Array.isArray(factsRes.facts[sec]) ? factsRes.facts[sec] : [])
      .map((f) => ({ hook: str(f && f.hook, 170), more: str(f && f.more, 300) }))
      .filter((f) => f.hook.length >= 20 && f.more.length >= 20)
      .slice(0, 3);
    facts[sec] = got.concat(bank[sec]).slice(0, 3);
  }
  return { stories: stories, five: pickFive(stories), quiz: quiz, facts: facts, madeAt: new Date().toISOString() };
}

let current = null;
let lastFail = 0;
const cached = unstable_cache(async (slot) => build(current, slot), ['akk-digest-v5'], { revalidate: 6 * 60 * 60 });

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
  let items = news, quiz = [], facts = factsForSlot(slot);
  if (ai) {
    const first = ai.five.map((id) => ai.stories.find((s) => s.id === id)).filter(Boolean);
    const rest = ai.stories.filter((s) => ai.five.indexOf(s.id) < 0);
    const have = new Set(ai.stories.map((s) => s.id));
    items = first.concat(rest, news.filter((x) => !have.has(x.id)).slice(0, 12));
    quiz = ai.quiz;
    facts = ai.facts || facts;
  }
  return { items: items, quiz: quiz, facts: facts, ai: !!ai, slot: slot, nextAt: (slot + 1) * SIX_HOURS, madeAt: ai ? ai.madeAt : null };
}
