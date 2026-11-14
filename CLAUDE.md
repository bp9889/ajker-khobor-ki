# AJKER খবর KI?

News site for young people (about 10 to 40). Bangladesh and world news, explained in about 60 seconds. The name is always written exactly `AJKER খবর KI?`.

## How the code is laid out

- `components/SiteView.jsx`: the whole layout (header, home, story, all stories, about, footer). Converted from the approved Claude Design board "B. Rickshaw ride", so styles are inline text passed through `css()`.
- `components/Site.jsx`: all behaviour. `list()` is the story list (live headlines, today's five first), `renderVals()` builds what the view shows. Also holds the rickshaw game, dark mode, the kite page transition and the quiz.
- `lib/news.js`: reads the RSS feeds in `data/feeds.json` (cached 30 minutes) and picks a picture tag for each headline using `data/art-tags.json`.
- `lib/digest.js`: reads each main article's public text (`lib/article.js`) and asks an AI model (Gemini through `GEMINI_API_KEY`; other keys or Vercel AI Gateway are fallbacks, see `provider()`) to retell it in its own words: one 5 to 7 sentence overview, a one-line teaser, key points, "why care" and tricky words. **Each story's overview is saved on its own** (`overviewOf`, cache key `akk-ov-v1`, 3 days), so a story that appears an hour from now gets its overview at the next page refresh (10 to 40 minutes), not at the next 6-hour slot. A small batcher spreads the calls out and rests 5 minutes after a rate-limit failure. The 8-question quiz and the "Did you know?" facts are written once per 6-hour slot (`extrasOf`, key `akk-extras-v1`). `getSimpler(id)` writes the "Explain it simpler" version on first tap and saves it (`akk-simple-v1`). The Vercel data cache is shared by deployments, so **bump the cache key whenever a prompt or the saved shape changes**.
- `lib/today.js`: "Today in Dhaka" (weather and air quality from open-meteo, exchange rates for about 20 currencies from open.er-api.com, which updates once a day; readers pick any two currencies and an amount in the money converter, `lib/currencies.js`). No keys. Any part that fails is left out. `AKK_TODAY` serves fixed values offline.
- `app/api/simpler` (writes the easier retelling), `app/api/report` ("Report a mistake": readers' reports are written to the Vercel runtime log as `[report] {...}`, nothing else is stored), `app/api/health` (feed status), `app/api/news`.
- `components/Extras.jsx` + `app/extras.css`: the cha cup that fills as you read (every page) and the open sky (kites, clouds, birds, stars at night) beside the content on wide screens (shown when the window leaves at least 96px each side). The word of the day is brushed in by CSS in `globals.css` (`.ak-flap`).
- `data/facts.js`: hand-written Did you know facts, used to fill in or replace the AI ones when they are missing.
- `lib/dedupe.js`: drops headlines about the same event (used by `lib/news.js`). The dropped copies from other publishers are kept on the story as `also`, which the story page shows as "Also reported by".
- `lib/article.js`: fetches an article page and pulls out its paragraphs (not stored, not shown to readers).
- `data/stories.js`: built-in sample explainers, used only when no live news can be loaded.
- `lib/route.js`: web addresses (`/`, `/news/<id>`, `/story/<slug>`, `/stories`, `/about`).
- `app/[[...path]]/page.jsx`: one page component serves every address, so page changes animate without a reload. Pages refresh every 10 minutes.
- Pictures are in `public/art/<tag>.svg` (day) and `<tag>-n.svg` (night). Share images are in `public/og`.
- To work offline: `AKK_FIXTURE=path/to/digest.json npm run dev` serves a saved copy of `/api/news`.

## Today's five

`pickFive()` in `lib/digest.js` chooses them with a fixed recipe from the live feeds (not by editors): the first 2 Bangladesh stories, the first World story, the first Sport story (else Tech), the first Tech story (else a second World story), then anything to reach five. Feeds are read in turns so no publisher fills the list, stories older than 3 days are dropped, and repeats of the same event are merged. On the home page the five are shown only in the "Today's five" section, which the game unlocks one passenger at a time, or "Open all five now" opens at once (remembered for the day in `akk-open`). "Live headlines" lists the stories after the five. "All stories" and search still list everything.

## Rules

- Keep the look: Anek Bangla font, the colour variables in `app/globals.css`, kite swoop transition, pictures switch with dark mode.
- Saved on the reader's own phone only: dark mode `akk-theme`, read stories `akk-read`, saved stories `akk-saved`, last visit `akk-visit` (and `akk-prev` in sessionStorage) for the "new since your last visit" count.
- Motion: shared curves are `--ak-out`, `--ak-io`, `--ak-drawer` in `app/globals.css` (section "Reader features and motion"). One-shot scroll-into-view moments use `data-io` on an element (`Site.arm()` adds `ak-armed` then `io-in`). Every animation has a gentler `prefers-reduced-motion` version.
- Summaries must be in our own words. Always name and link the original publisher. Never copy article text or publishers' photos. The overview must retell in new words, with no quotation marks.
- Never draw real, recognisable people, not even as cartoons, and never an avatar made for one named person. Stories about people get an invented toy-brick character chosen by role: `batter`, `striker`, `minister`, `leader`, `founder`, `scientist`, `performer` (drawn by `scripts/make-cast-bricks.py`, which writes every variant into `public/art`; keywords in `data/art-tags.json`).
- `tagFor()` in lib/news.js adds the variant: `-f` for a female character (from words like she/her/woman in the headline, otherwise a fixed pick per story), a country flag for politicians (`leader-us`, `minister-bd`...), and team colours for sport (`striker-arg`, `batter-bd`...).
- A story that names a political figure (a name on the NAMES list, or a title followed by a name such as "President Lastname") gets a symbol picture (`government` or `diplomacy`), never a character. Keep that list up to date.
- `government` and `diplomacy` show the Bangladesh flag, so `tagFor()` switches stories from World, Tech and Sport to the `-w` copies (plain blue banner). Edit both copies if you change one.
- The four "Explore by topic" cards carry a flag / world map / chip / sports picture (`TopicArt` in components/SiteView.jsx).
- Respect `prefers-reduced-motion`. Must work on a 360px-wide phone.

## Not done yet

- Overviews are AI-written from the article text, and a person does not check them. Some sites block our fetch, then the overview falls back to the headline and short description (`deep` is false and the page says so).
- A live story's page disappears once the headline leaves the feeds (old links then show the all-stories page). Saving stories to a database would fix that.
- "Join the waitlist" only shows a thank-you. It does not save the email anywhere yet.
- Bangla edition.
- "Report a mistake" reports only appear in the Vercel runtime logs (search for `[report]`). Email or a database would make them easier to act on.
- "Published N min ago" is the publisher's time. "News checked N min ago" is when the page was last built.
- `SiteView.jsx` is one big file. Splitting it into smaller components is a good first clean-up.
