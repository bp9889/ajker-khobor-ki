// The site is built as plain files (see .github/workflows/deploy.yml) and served by Cloudflare.
// One build process, so the news and AI summaries are fetched once per build, not once per page.
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  staticPageGenerationTimeout: 600,
  experimental: { cpus: 1 },
};
export default nextConfig;
