// This module is substituted for all *.dev.tsx / *.dev.ts files during
// production builds (see next.config.js webpack NormalModuleReplacementPlugin).
// It exports a minimal Next.js page that returns notFound so that even if
// Next.js somehow resolves the route, no HTML is emitted.
module.exports = {
  default: function EmptyDevPage() { return null },
  getStaticProps: async function() { return { notFound: true } },
}
