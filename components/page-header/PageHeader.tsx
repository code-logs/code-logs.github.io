export interface PageHeaderProps {
  title: string
  // Sub-line under the title (e.g. "Total 48 posts"). In search mode the caller
  // typically passes the "Found N posts for ..." copy here instead.
  subtitle?: string
  // When supplied (non-empty), the header switches to search-results mode:
  // the title is overridden to "Search results" and the query is woven into the
  // subtitle. The caller still controls the count via `subtitle`.
  query?: string
}

// Reusable page header for list pages (posts / categories / tags). Owns the
// page <h1>. Replaces the legacy float-right "Total N" with a normal-flow
// title + muted sub-line.
const PageHeader = ({ title, subtitle, query }: PageHeaderProps) => {
  const isSearch = !!query
  const heading = isSearch ? 'Search results' : title

  return (
    <header className="mb-8">
      <h1 className="text-3xl font-semibold text-text-heading m-0">{heading}</h1>
      {subtitle && <p className="mt-1 text-sm text-text-muted m-0">{subtitle}</p>}
    </header>
  )
}

export default PageHeader
