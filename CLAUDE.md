# AJKER খবর KI?

News site for young people (about 10 to 40). Bangladesh and world news, explained in about 60 seconds. The name is always written exactly `AJKER খবর KI?`.

## How the code is laid out

- `components/SiteView.jsx`: the whole layout (header, home, story, all stories, about, footer). It was converted from the approved Claude Design board "B. Rickshaw ride", so styles are inline text passed through `css()`.
- `components/Site.jsx`: all behaviour. `renderVals()` builds the values the view shows. Also holds the rickshaw game (canvas), dark mode, the kite page transition and the quiz.
- `data/stories.js`: the ten sample explainers. Index 0-4 are "Today", 5-9 "Yesterday".
- `data/feeds.json`: RSS feeds for Live headlines. `lib/news.js` reads them, `app/api/news/route.js` serves them (cached 30 minutes).
- `data/art-tags.json`: keywords that pick a picture for a headline. Pictures are in `public/art/<tag>.svg` (day) and `<tag>-n.svg` (night).
- `lib/route.js`: web addresses (`/`, `/story/<slug>`, `/stories`, `/about`).
- `app/[[...path]]/page.jsx`: one page component serves every address, so page changes animate without a reload.

## Rules

- Keep the look: Anek Bangla font, the colour variables in `app/globals.css`, kite swoop transition, pictures switch with dark mode.
- Dark mode is saved in `localStorage` key `akk-theme`; read stories in `akk-read`.
- Summaries must be in our own words. Always name and link the original publisher. Never copy article text or publishers' photos.
- Never draw real, recognisable people. Use the `speech` picture for stories about a well-known person.
- Respect `prefers-reduced-motion`. Must work on a 360px-wide phone.

## Not done yet

- The ten explainers are samples. Real daily explainers need an editor (or a Claude API draft that a person checks) and real source links.
- "Join the waitlist" only shows a thank-you. It does not save the email anywhere yet.
- "Ask about this story" is a disabled placeholder.
- Bangla edition.
- `SiteView.jsx` is one big file. Splitting it into smaller components (Header, Game, StoryPage...) is a good first clean-up.
