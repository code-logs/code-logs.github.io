import { Search } from 'lucide-react'

export interface SearchTriggerProps {
  onOpen: () => void
}

// Header search affordance (issue #150). On desktop (≥768) it looks like an input
// — search icon + "Search..." + a ⌘K kbd chip — but is a real <button> that opens
// the Cmd+K palette. On mobile it collapses to the icon only. The 768 boundary is
// Tailwind's default `md:`, matching the header's desktop/mobile split.
const SearchTrigger = ({ onOpen }: SearchTriggerProps) => (
  <button
    type="button"
    onClick={onOpen}
    aria-label="Search posts"
    aria-keyshortcuts="Meta+K Control+K"
    className="flex items-center gap-2 rounded-md p-2 text-text-muted hover:text-text-heading
               md:w-72 md:border md:border-border md:bg-bg-subtle md:px-3 md:py-1.5"
  >
    <Search className="w-5 h-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
    <span className="hidden md:inline text-sm">Search...</span>
    <kbd className="kbd ml-auto hidden md:inline-flex" aria-hidden="true">
      ⌘K
    </kbd>
  </button>
)

export default SearchTrigger
