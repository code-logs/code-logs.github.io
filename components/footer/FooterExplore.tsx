import footerConfig from '../../config/footer.config'

// Explore column: page-level nav. Heading is a semantic <h2> styled small/uppercase
// for accessibility. Internal page paths use native <a> like the rest of the site
// (full reload, not next/link).
const FooterExplore = () => (
  <nav aria-labelledby="footer-explore-heading">
    <h2 id="footer-explore-heading" className="text-xs uppercase tracking-wide text-text-muted">
      Explore
    </h2>
    <ul className="mt-4 flex flex-col gap-2">
      {footerConfig.exploreLinks.map((link, idx) => (
        <li key={idx}>
          <a href={link.href} className="text-sm text-text-body transition-colors hover:text-text-heading">
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
)

export default FooterExplore
