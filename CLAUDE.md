# AJKER খবর KI?

News site for young people (about 10 to 40). Bangladesh and world news, explained in about 60 seconds. The name is always written exactly `AJKER খবর KI?`.

## How the code is laid out

- `components/SiteView.jsx`: the whole layout (header, home, story, all stories, about, footer). Converted from the approved Claude Design board "B. Rickshaw ride", so styles are inline text passed through `css()`.
- `components/Site.jsx`: all behaviour. `list()` is the story list (live headlines, today's five first), `renderVals()` builds what the view shows. Also holds the rickshaw game, dark mode, the kite page transition and the quiz.
- `lib/news.js`: reads the RSS feeds in `data/feeds.json` (cached 30 minutes) and picks a picture tag for each headline using `data/art-tags.json`.
- `lib/digest.js`: every 6 hours it reads each main article's public text (`lib/article.js`), then asks an AI model (Gemini through `GEMINI_API_KEY`; falls back to other keys or Vercel AI Gateway, see `provider()`) to retell it in its own words as one 5 to 7 sentence overview, plus a one-line teaser, key points, "why care" and tricky words. Stories go in batches of 6 in parallel. Separate calls write an 8-question general-knowledge quiz (6 topics that rotate every 6-hour slot, see `topicsForSlot`, plus 2 about the news) and 12 "Did you know?" facts (3 each for Sports, Tech, Bangladesh, World). If the AI fails, stories fall back to the publisher's own description.
- `data/facts.js`: hand-written Did you know facts, used to fill in or replace the AI ones when they are missing.
- `lib/dedupe.js`: drops headlines about the same event (used by `lib/news.js`).
- `lib/article.js`: fetches an article page and pulls out its paragraphs (not stored, not shown to readers).
- `data/stories.js`: built-in sample explainers, used only when no live news can be loaded.
- `lib/route.js`: web addresses (`/`, `/news/<id>`, `/story/<slug>`, `/stories`, `/about`).
- `app/[[...path]]/page.jsx`: one page component serves every address, so page changes animate without a reload. Pages refresh every 10 minutes.
- Pictures are in `public/art/<tag>.svg` (day) and `<tag>-n.svg` (night). Share images are in `public/og`.
- To work offline: `AKK_FIXTURE=path/to/digest.json npm run dev` serves a saved copy of `/api/news`.

## Rules

- Keep the look: Anek Bangla font, the colour variables in `app/globals.css`, kite swoop transition, pictures switch with dark mode.
- Dark mode is saved in `localStorage` key `akk-theme`; read stories in `akk-read`.
- Summaries must be in our own words. Always name and link the original publisher. Never copy article text or publishers' photos. The overview must retell in new words, with no quotation marks.
- Never draw real, recognisable people. Use the `speech` picture for stories about a well-known person.
- Respect `prefers-reduced-motion`. Must work on a 360px-wide phone.

## Not done yet

- Overviews are AI-written from the article text, and a person does not check them. Some sites block our fetch, then the overview falls back to the headline and short description (`deep` is false and the page says so).
- A live story's page disappears once the headline leaves the feeds (old links then show the all-stories page). Saving stories to a database would fix that.
- "Join the waitlist" only shows a thank-you. It does not save the email anywhere yet.
- Bangla edition.
- `SiteView.jsx` is one big file. Splitting it into smaller components is a good first clean-up.
