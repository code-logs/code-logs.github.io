// A single breadcrumb segment. `href` omitted → renders as the current
// (non-link) location, conventionally the last item.
export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface PageHeaderProps {
  title: string
  // Sub-line under the title (e.g. "Total 48 posts"). In search mode the caller
  // typically passes the "Found N posts for ..." copy here instead.
  subtitle?: string
  // When supplied (non-empty), the header switches to search-results mode:
  // the title is overridden to "Search results" and the query is woven into the
  // subtitle. The caller still controls the count via `subtitle`.
  query?: string
  // Optional breadcrumb trail rendered above the title (e.g. Categories / CSS).
  breadcrumb?: BreadcrumbItem[]
}

// Reusable page header for list pages (posts / categories / tags). Owns the
// page <h1>. Replaces the legacy float-right "Total N" with a normal-flow
// title + muted sub-line. An optional breadcrumb renders above the title.
const PageHeader = ({ title, subtitle, query, breadcrumb }: PageHeaderProps) => {
  const isSearch = !!query
  const heading = isSearch ? 'Search results' : title

  return (
    <header className="mb-8">
      {breadcrumb && breadcrumb.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex items-center gap-2 text-sm text-text-muted m-0 list-none p-0">
            {breadcrumb.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                {item.href ? (
                  <a href={item.href} className="hover:text-text-heading transition-colors">
                    {item.label}
                  </a>
                ) : (
                  <span aria-current="page" className="capitalize text-text-heading">
                    {item.label}
                  </span>
                )}
                {idx < breadcrumb.length - 1 && (
                  <span aria-hidden className="text-text-muted/40">
                    /
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <h1 className="text-3xl font-semibold text-text-heading m-0">{heading}</h1>
      {subtitle && <p className="mt-1 text-sm text-text-muted m-0">{subtitle}</p>}
    </header>
  )
}

export default PageHeader
