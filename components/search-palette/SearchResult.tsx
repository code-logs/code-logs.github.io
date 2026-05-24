import { ReactNode } from 'react'
import type { SearchIndexEntry } from './SearchPalette'

// Splits `text` on case-insensitive occurrences of `query`, wrapping matches in
// <mark>. Built from React nodes (never dangerouslySetInnerHTML) so user-typed
// queries can never inject markup — safe under the static export too.
const highlight = (text: string, query: string): ReactNode => {
  const q = query.trim().toLowerCase()
  if (!q) return text

  const lower = text.toLowerCase()
  const parts: ReactNode[] = []
  let start = 0
  let idx = lower.indexOf(q, start)

  while (idx !== -1) {
    if (idx > start) parts.push(text.slice(start, idx))
    parts.push(<mark key={`${idx}-${start}`}>{text.slice(idx, idx + q.length)}</mark>)
    start = idx + q.length
    idx = lower.indexOf(q, start)
  }
  parts.push(text.slice(start))
  return parts
}

export interface SearchResultProps {
  entry: SearchIndexEntry
  query: string
  href: string
  active: boolean
  optionId: string
  onActivate: () => void
  onSelect: () => void
}

const SearchResult = ({ entry, query, href, active, optionId, onActivate, onSelect }: SearchResultProps) => (
  // id + role="option" sit on the same element so the input's aria-activedescendant
  // resolves to the option (not the inner anchor). mark uses text-link (accent-700
  // light / accent-400 dark) — both pass WCAG AA, unlike accent-600.
  <li id={optionId} role="option" aria-selected={active}>
    <a
      href={href}
      onClick={onSelect}
      onMouseEnter={onActivate}
      className={`block rounded-md px-3 py-2 ${active ? 'bg-bg-subtle' : ''}`}
    >
      <span className="block text-xs uppercase tracking-wide text-text-muted">{entry.category}</span>
      <span className="block font-medium text-text-heading [&_mark]:bg-transparent [&_mark]:text-link [&_mark]:font-semibold">
        {highlight(entry.title, query)}
      </span>
      <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-text-muted">
        {entry.tags.length > 0 && <span className="truncate">{entry.tags.slice(0, 4).join(' · ')}</span>}
        <span className="ml-auto shrink-0">{entry.publishedAt}</span>
      </span>
    </a>
  </li>
)

export default SearchResult
