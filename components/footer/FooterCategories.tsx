import footerConfig from '../../config/footer.config'
import postsDatabase from '../../database/post-database'

// Categories column: top 5 categories by post count. postsDatabase is a build-time
// singleton, so deriving the list in the component body is deterministic and safe
// under output:'export' (no date/random). post.category already holds the display
// string (e.g. 'react native'); CSS `capitalize` titlecases it (codebase convention
// — CategoryIndexer/PostCard do the same, no JS capitalize helper). Counts use
// tabular-nums for column alignment.
const topCategories = Array.from(new Set(postsDatabase.find().map((post) => post.category)))
  .map((category) => ({ category, count: postsDatabase.countByCategory(category) }))
  .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category))
  .slice(0, 5)

const FooterCategories = () => (
  <nav aria-labelledby="footer-categories-heading">
    <h2 id="footer-categories-heading" className="text-xs uppercase tracking-wide text-text-muted">
      Categories
    </h2>
    <ul className="mt-4 flex flex-col gap-2">
      {topCategories.map(({ category, count }) => (
        <li key={category}>
          <a
            href={`/categories/${encodeURIComponent(category)}/1`}
            className="flex items-center gap-1.5 text-sm text-text-body transition-colors hover:text-text-heading"
          >
            <span className="min-w-0 truncate capitalize">{category}</span>
            <span className="text-divider">·</span>
            <span className="text-text-muted tabular-nums">{count}</span>
          </a>
        </li>
      ))}
      {footerConfig.categoriesViewAllHref && (
        <li>
          <a
            href={footerConfig.categoriesViewAllHref}
            className="text-sm text-text-muted transition-colors hover:text-text-heading"
          >
            View all &rarr;
          </a>
        </li>
      )}
    </ul>
  </nav>
)

export default FooterCategories
