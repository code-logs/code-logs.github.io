import blogConfig from '../../config/blog.config'

// Dynamic copyright year. The footer renders in _app (global), so there's no
// getStaticProps to pin the year through (the standard static-export fix). Instead
// the year is a module-scope build constant baked into the static HTML — crawlers
// see the build year, and the site redeploys far more often than yearly, so it
// stays current. `suppressHydrationWarning` covers the one edge: a cached HTML
// loaded after Jan 1 before the next deploy, where the client recomputes a newer
// year. Harmless for a copyright line, and it self-corrects on hydration.
const currentYear = new Date().getFullYear()

const FooterBottomBar = () => (
  <div className="mt-12 border-t border-border pt-6 text-center text-xs text-text-muted md:text-left">
    <span suppressHydrationWarning>&copy; {currentYear}</span> {blogConfig.author}{' '}
    <span className="text-divider">·</span> all rights reserved
  </div>
)

export default FooterBottomBar
