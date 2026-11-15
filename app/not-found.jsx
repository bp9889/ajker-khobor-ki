// An address that is not on the site, usually an old story that has rolled off the news.
// Readers see every live story instead, with a short note (Site shows it for an unknown story).
import Site from '../components/Site';
import { getDigest } from '../lib/digest';
import { getToday } from '../lib/today';
import { factsForDay } from '../lib/dyk';

export const metadata = { title: 'All stories | AJKER খবর KI?' };

export default async function NotFound() {
  const [digest, today] = await Promise.all([getDigest().catch(() => null), getToday().catch(() => null)]);
  return <Site view="story" sid="gone" digest={digest} today={today} dyk={factsForDay()} />;
}
