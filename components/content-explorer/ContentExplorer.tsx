import { TocHeading, TocNode } from './toc'

export interface ContentExplorerProps {
  tree: TocHeading[]
  activeId: string | null
}

// Desktop sticky TOC aside (issue #153). Presentational: the heading tree +
// active id are computed once in the page (useHeadingTree/useActiveHeading) and
// shared with MobileToc, so neither the scan nor the IntersectionObserver runs
// twice. Renders nothing when the post has no headings.
const ContentExplorer = ({ tree, activeId }: ContentExplorerProps) => {
  if (!tree.length) return null

  return (
    <nav
      aria-label="Table of contents"
      className="sticky max-h-[calc(100dvh-var(--header-height)-var(--spacing-12))] overflow-y-auto text-sm top-[calc(var(--header-height)+var(--spacing-6))]"
    >
      <p className="m-0 mb-3 text-xs uppercase tracking-wide text-text-muted">On this page</p>
      <TocNode nodes={tree} activeId={activeId} />
    </nav>
  )
}

export default ContentExplorer
