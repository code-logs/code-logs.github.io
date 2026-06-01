import { ChevronRight } from 'lucide-react'
import { TocHeading, TocNode } from '../content-explorer/toc'

export interface MobileTocProps {
  tree: TocHeading[]
  activeId: string | null
}

// Mobile/tablet TOC (issue #153): the desktop sticky aside collapses into a
// closed <details> "Contents" above the body below the 1024 layout breakpoint.
// Presentational — shares the page-computed tree/activeId with ContentExplorer.
const MobileToc = ({ tree, activeId }: MobileTocProps) => {
  if (!tree.length) return null

  return (
    <details className="lg:hidden mb-8 rounded-lg border border-border bg-bg-subtle [&[open]_svg]:rotate-90">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 px-4 py-3 text-sm font-medium text-text-heading">
        <ChevronRight size={16} aria-hidden className="transition-transform -mt-px" />
        Contents
      </summary>
      <nav aria-label="Table of contents" className="px-4 pb-4 text-sm">
        <TocNode nodes={tree} activeId={activeId} />
      </nav>
    </details>
  )
}

export default MobileToc
