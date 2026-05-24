// Wordmark logo (issue #150): the type itself is the mark — no SVG glyph. Geist
// Mono via `font-mono`, tight tracking, with the trailing slash in the brand
// accent (`text-accent` → accent-600 light / accent-400 dark, see globals.css).
const Logo = () => (
  // Native <a> for consistency: the whole site navigates with plain anchors (full
  // reload), not next/link. The lint rule only fires here because the href is a
  // static page path; MarkedAnchor dodges it via a dynamic href.
  // eslint-disable-next-line @next/next/no-html-link-for-pages
  <a href="/" aria-label="code-logs home" className="inline-flex items-center shrink-0">
    <span className="font-mono text-lg font-medium tracking-tight text-text-heading whitespace-nowrap">
      code-logs
      <span className="text-accent">/</span>
    </span>
  </a>
)

export default Logo
