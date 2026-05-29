import { Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import SearchResult from './SearchResult'

export interface SearchIndexEntry {
  title: string
  slug: string
  category: string
  description: string
  tags: string[]
  publishedAt: string
}

export interface SearchPaletteProps {
  open: boolean
  onClose: () => void
}

const MAX_RESULTS = 8
// Field weights: a title hit ranks above a tag hit above a description hit.
const WEIGHT = { title: 3, tags: 2, description: 1 }
const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'

const scoreEntry = (entry: SearchIndexEntry, query: string): number => {
  let score = 0
  if (entry.title.toLowerCase().includes(query)) score += WEIGHT.title
  if (entry.tags.some((tag) => tag.toLowerCase().includes(query))) score += WEIGHT.tags
  if (entry.description.toLowerCase().includes(query)) score += WEIGHT.description
  return score
}

const SearchPalette = ({ open, onClose }: SearchPaletteProps) => {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  // Lazy-loaded once and cached for the session — the manifest never changes at
  // runtime (static export), so a single fetch on first open is enough. Held in
  // state (not a ref) so results recompute when it arrives.
  const [index, setIndex] = useState<SearchIndexEntry[] | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // First open: fetch the manifest. Same-origin absolute path, so it is
  // independent of NEXT_PUBLIC_BASE_URL.
  useEffect(() => {
    if (!open || index) return
    fetch('/search-index.json')
      .then((res) => res.json())
      .then((data: SearchIndexEntry[]) => setIndex(data))
      .catch(() => setIndex([]))
  }, [open, index])

  // On open: reset query, lock body scroll, focus the input. On close (cleanup):
  // unlock scroll and restore focus to whatever was focused before (the trigger
  // button when opened by click; the prior element when opened via Cmd+K).
  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    setQuery('')
    setActiveIndex(0)
    document.body.style.overflow = 'hidden'
    inputRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
      previouslyFocused?.focus?.()
    }
  }, [open])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q || !index) return []
    return index
      .map((entry) => ({ entry, score: scoreEntry(entry, q) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RESULTS)
      .map(({ entry }) => entry)
  }, [query, index])

  // Reset selection to the top whenever the query changes.
  useEffect(() => setActiveIndex(0), [query])

  // Keep the active row visible as arrow navigation moves it past the scroll edge.
  useEffect(() => {
    if (!open) return
    document.getElementById(`search-result-${activeIndex}`)?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  if (!open) return null

  // slug is already PostUtil.normalizeTitle output ([a-z0-9-]), so the path needs
  // no further encoding — matches how getStaticPaths/sitemap build post URLs.
  const hrefFor = (entry: SearchIndexEntry) => `/${entry.slug}`

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      // Own Escape exclusively while open so the window-level handler in _app
      // doesn't also fire on the same event.
      e.preventDefault()
      e.stopPropagation()
      onClose()
    } else if (e.key === 'Tab') {
      // Focus trap: cycle Tab/Shift+Tab within the dialog (mirrors MobileSheet).
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (!focusables || focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0))
    } else if (e.key === 'Enter') {
      const target = results[activeIndex]
      if (target) {
        e.preventDefault()
        window.location.assign(hrefFor(target))
      }
    }
  }

  const trimmed = query.trim()

  return (
    // Backdrop: click outside the panel closes. The panel stops propagation so
    // inner clicks don't bubble to the backdrop handler.
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-bg-page/60 px-4 pt-[15vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search posts"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-bg-page shadow-lg"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-5 w-5 shrink-0 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search..."
            role="combobox"
            aria-label="Search query"
            aria-controls="search-results"
            aria-expanded={results.length > 0}
            aria-activedescendant={results.length ? `search-result-${activeIndex}` : undefined}
            spellCheck={false}
            // The panel's overflow-hidden would clip the global :focus-visible
            // glow ring, so suppress it — the auto-focused input's cursor already
            // signals focus (standard command-palette behavior).
            // Explicit 16px so the reduced mobile root font-size cannot trigger
            // iOS Safari's focus auto-zoom; md:text-sm restores desktop size.
            className="flex-1 bg-transparent py-3.5 text-[16px] text-text-body outline-none focus-visible:shadow-none md:text-sm"
          />
        </div>

        {trimmed && (
          <ul id="search-results" role="listbox" className="max-h-[60vh] overflow-y-auto p-2">
            {results.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-text-muted">No results for &quot;{trimmed}&quot;</li>
            ) : (
              results.map((entry, idx) => (
                <SearchResult
                  key={entry.slug}
                  entry={entry}
                  query={query}
                  href={hrefFor(entry)}
                  active={idx === activeIndex}
                  optionId={`search-result-${idx}`}
                  onActivate={() => setActiveIndex(idx)}
                  onSelect={onClose}
                />
              ))
            )}
          </ul>
        )}

        <div className="flex items-center gap-3 border-t border-border px-4 py-2 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <kbd className="kbd">↑</kbd>
            <kbd className="kbd">↓</kbd>
            이동
          </span>
          <span className="flex items-center gap-1">
            <kbd className="kbd">Enter</kbd>
            선택
          </span>
          <span className="flex items-center gap-1">
            <kbd className="kbd">Esc</kbd>
            닫기
          </span>
        </div>
      </div>
    </div>
  )
}

export default SearchPalette
