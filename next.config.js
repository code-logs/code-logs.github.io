/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production'

// .dev.tsx / .dev.ts files are only resolved as pages in dev mode.
// This is the load-bearing mechanism that keeps dev-only pages and API routes
// (pages/dev/*.dev.tsx, pages/api/dev/*.dev.ts) out of the static export.
//
// How it works:
//   - In dev: pageExtensions starts with 'dev.tsx'/'dev.ts' — Next.js strips
//     the FIRST matching extension, so `authoring.dev.tsx` → route `/dev/authoring`.
//   - In prod: 'dev.tsx'/'dev.ts' are absent from the list, so files ending in
//     `.dev.tsx` fall through to `tsx` and become routes like `/dev/authoring.dev`.
//     The webpack NormalModuleReplacementPlugin then replaces those files with an
//     empty module, effectively making Next.js see empty pages it can't export.
//
// The combination of:
//   1. pageExtensions (dev route naming),
//   2. NormalModuleReplacementPlugin (prod file exclusion), and
//   3. getStaticProps returning notFound:true (belt-and-suspenders)
// ensures .dev files never appear in the static export.
const pageExtensions = isDev
  ? ['dev.tsx', 'dev.ts', 'tsx', 'ts', 'jsx', 'js']
  : ['tsx', 'ts', 'jsx', 'js']

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  pageExtensions,
  webpack(config, { isServer }) {
    if (!isDev) {
      // In production builds, replace any *.dev.tsx / *.dev.ts file with an
      // empty module so Next.js does not attempt to render or export it.
      // This is belt-and-suspenders alongside the pageExtensions filter and
      // the getStaticProps notFound guard inside each dev page.
      const { NormalModuleReplacementPlugin } = require('webpack')
      config.plugins.push(
        new NormalModuleReplacementPlugin(
          /\.dev\.(tsx?|jsx?)$/,
          require.resolve('./utils/dev/_empty-module.js')
        )
      )
    }
    return config
  },
}

module.exports = nextConfig
