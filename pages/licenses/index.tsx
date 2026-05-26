import { ExternalLink, Search } from 'lucide-react'
import { useState } from 'react'
import CommonMeta from '../../components/common-meta/CommonMeta'
import PageHeader from '../../components/page-header/PageHeader'
import blogConfig from '../../config/blog.config'
import { META_CONTENTS } from '../../config/meta-contents'
import TitleUtil from '../../utils/TitleUtil'
import licenses from '../../public/licenses.json'

interface LicenseEntry {
  licenses: string
  repository?: string
}

interface PackageItem {
  name: string
  version: string
  license: string
  repository?: string
}

// Split a license-checker key into name + version. The key joins them with the
// last "@" (e.g. `caniuse-lite@1.0.0`); scoped packages keep their leading "@"
// (`@next/env@15.5.18`), so we split on lastIndexOf and guard `<= 0` to treat a
// key whose only "@" is the scope prefix as version-less.
function parsePackageKey(key: string): { name: string; version: string } {
  const lastAt = key.lastIndexOf('@')
  if (lastAt <= 0) {
    return { name: key, version: '' }
  }
  return { name: key.slice(0, lastAt), version: key.slice(lastAt + 1) }
}

// Computed once at module scope — the license set is static build-time data.
const items: PackageItem[] = Object.entries(licenses as Record<string, LicenseEntry>)
  .map(([key, value]) => ({
    ...parsePackageKey(key),
    license: value.licenses,
    repository: value.repository,
  }))
  .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))

const Licenses = () => {
  const [filter, setFilter] = useState('')

  const filteredItems = filter
    ? items.filter((item) => item.name.toLowerCase().includes(filter.toLowerCase()))
    : items

  return (
    <div className="container-reading py-12">
      <CommonMeta
        title={TitleUtil.buildPageTitle(META_CONTENTS.LICENSES.TITLE)}
        description={META_CONTENTS.LICENSES.DESCRIPTION}
        url={`${blogConfig.baseURL}/licenses`}
        imageURL={'/icons/icon-512x512.png'}
      />

      <PageHeader
        title="Licenses"
        subtitle={`Third-party packages used in this site. ${items.length} packages.`}
        breadcrumb={[{ label: 'About', href: '/about' }, { label: 'Licenses' }]}
      />

      {/* Inline filter — URL state is overkill here (resets on reload, per #159).
          SearchInput is not reused because its clear button hard-navigates to
          /posts/1; only its verified focus-ring wrapper pattern is borrowed. */}
      <div className="flex h-10 w-full items-center gap-2 rounded-md border border-border bg-bg-page px-3 transition-[box-shadow,border-color] focus-within:border-accent focus-within:shadow-focus">
        <Search className="shrink-0 text-text-muted" size={18} strokeWidth={1.5} />
        <input
          type="search"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder="Filter by package name…"
          aria-label="Filter by package name"
          spellCheck={false}
          className="flex-1 border-none bg-transparent text-text-body outline-none placeholder:text-text-muted focus-visible:shadow-none [&::-webkit-search-cancel-button]:hidden"
        />
      </div>

      {filteredItems.length === 0 ? (
        <p role="status" className="py-8 text-center text-sm text-text-muted">
          No packages match &quot;{filter}&quot;
        </p>
      ) : (
        <ul role="list" className="mt-6 list-none p-0">
          {filteredItems.map((item) => (
            // Rows reflow to 2 cols below 640px (name+version / chip+repo). This
            // uses max-sm (not the project's usual max-tablet/800px) because the
            // 4-col grid only feels cramped at true phone widths.
            <li
              key={`${item.name}@${item.version}`}
              className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-4 gap-y-2 border-t border-divider py-3 first:border-t-0 max-sm:grid-cols-[1fr_auto]"
            >
              <span className="truncate font-mono text-sm text-text-heading">{item.name}</span>
              <span className="text-xs text-text-muted tabular-nums">{item.version}</span>
              <span className="inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium text-text-body ring-1 ring-border">
                {item.license}
              </span>
              {item.repository ? (
                <a
                  href={item.repository}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${item.name} repository`}
                  className="justify-self-end text-text-muted transition-colors hover:text-accent"
                >
                  <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
                </a>
              ) : (
                <span className="h-4 w-4 justify-self-end" aria-hidden />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Licenses
