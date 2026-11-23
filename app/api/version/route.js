// Which commit the live site is running (Vercel sets VERCEL_GIT_COMMIT_SHA). Used by .github/workflows/warm.yml to know
// when a new deploy has taken over, so it can open the main pages before readers do.
export const dynamic = 'force-dynamic';
export function GET() {
  return Response.json({ sha: process.env.VERCEL_GIT_COMMIT_SHA || null }, { headers: { 'cache-control': 'no-store' } });
}
