import { getDigest } from '../../../lib/digest';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

// The same data the pages use. Handy for checking what is live right now.
export async function GET() {
  return Response.json(await getDigest());
}
