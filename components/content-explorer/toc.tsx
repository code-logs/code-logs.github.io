import { useEffect, useMemo, useState } from 'react'

// Shared TOC primitives (issue #153) used by both the desktop sticky aside
// (ContentExplorer) and the mobile <details> (MobileToc). The prior
// useScroll/offsetTop approach with a hard-coded HEADER_HEIGHT is replaced by an
// IntersectionObserver keyed off the `--header-height` CSS variable, and the
// hand-unrolled 3-level nesting by a recursive TocNode.

export interface TocHeading {
  id: string
  text: string
  level: number
  children: TocHeading[]
}

const CONTENT_SELECTOR = 'section#content'

// Build a nested heading tree from the rendered post body. Headings without an
// id (none, in practice — marked assigns slug ids) are skipped so anchors never
// point at `#`.
const buildHeadingTree = (container: HTMLElement): TocHeading[] => {
  const elements = Array.from(
    container.querySelectorAll<HTMLHeadingElement>('h2, h3, h4')
  ).filter((el) => el.id)

  const root: TocHeading[] = []
  const stack: TocHeading[] = []

  elements.forEach((el) => {
    const level = Number(el.tagName[1])
    const node: TocHeading = { id: el.id, text: el.textContent ?? '', level, children: [] }

    while (stack.length && stack[stack.length - 1].level >= level) stack.pop()

    if (stack.length) stack[stack.length - 1].children.push(node)
    else root.push(node)

    stack.push(node)
  })

  return root
}

const flatten = (nodes: TocHeading[]): string[] =>
  nodes.flatMap((node) => [node.id, ...flatten(node.children)])

// Reads the post body after mount and returns the heading tree + the flat id
// list (in document order) for the active-heading observer.
export const useHeadingTree = () => {
  const [tree, setTree] = useState<TocHeading[]>([])

  useEffect(() => {
    const container = document.querySelector<HTMLElement>(CONTENT_SELECTOR)
    if (!container) return
    setTree(buildHeadingTree(container))
  }, [])

  // Memoized so the id list keeps a stable reference across renders; otherwise
  // useActiveHeading would tear down and rebuild its observer on every render.
  const ids = useMemo(() => flatten(tree), [tree])

  return { tree, ids }
}

const readHeaderHeight = () => {
  if (typeof window === 'undefined') return 64
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-height')
  const parsed = parseInt(raw, 10)
  return Number.isNaN(parsed) ? 64 : parsed
}

// Tracks the heading currently in the reading band via IntersectionObserver.
// The top inset matches the sticky header height; the bottom -70% inset makes a
// heading "active" once it reaches the upper third of the viewport. When
// several qualify, the topmost in document order wins; when none do, the last
// active id is kept.
export const useActiveHeading = (ids: string[]) => {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (!ids.length) return

    const visible = new Set<string>()
    const headerOffset = readHeaderHeight()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        })
        const topmost = ids.find((id) => visible.has(id))
        if (topmost) setActiveId(topmost)
      },
      { rootMargin: `-${headerOffset + 8}px 0px -70% 0px`, threshold: 0 }
    )

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [ids])

  return activeId
}

const LEVEL_PADDING: Record<number, string> = { 2: 'pl-3', 3: 'pl-6', 4: 'pl-9' }

export interface TocNodeProps {
  nodes: TocHeading[]
  activeId: string | null
  onNavigate?: () => void
}

// Recursive TOC renderer. Active item: left 2px accent bar + heading color;
// inactive: muted; hover: body. No translateX/underline/italic (removed in
// issue #153).
export const TocNode = ({ nodes, activeId, onNavigate }: TocNodeProps) => (
  <ul className="m-0 list-none p-0">
    {nodes.map((node) => {
      const active = node.id === activeId
      return (
        <li key={node.id} className="m-0">
          <a
            href={`#${node.id}`}
            onClick={onNavigate}
            aria-current={active ? 'location' : undefined}
            className={`block border-l-2 ${LEVEL_PADDING[node.level] ?? 'pl-3'} py-1 leading-snug transition-colors ${
              active
                ? 'border-accent text-text-heading'
                : 'border-transparent text-text-muted hover:text-text-body'
            }`}
          >
            {node.text}
          </a>
          {!!node.children.length && (
            <TocNode nodes={node.children} activeId={activeId} onNavigate={onNavigate} />
          )}
        </li>
      )
    })}
  </ul>
)
