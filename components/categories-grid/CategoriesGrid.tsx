import { CATEGORIES } from '../../config/posts.config'
import { getIndexLetter } from '../../utils/HangulUtil'

export interface CategoryWithCount {
  category: string
  count: number
  hasNew: boolean
}

export interface CategoriesGridProps {
  categoriesWithCount: CategoryWithCount[]
  // When true (the /categories index), the first card of each alphabet letter
  // gets an `id` anchor target for AlphabetNav. Left off on the home page so its
  // top-8 grid stays anchor-free.
  enableLetterAnchors?: boolean
}

// Responsive categories grid, reused by the home page (top 8) and the
// /categories index (all categories). Each card links to /categories/{category}/1.
// Consumers pass viewAllHref="/categories" to their SectionHeader (#155).
const CategoriesGrid = ({ categoriesWithCount, enableLetterAnchors }: CategoriesGridProps) => {
  // Tracks which letters already received an anchor so only the first card of
  // each letter group (in the caller's sort order) carries the `id`.
  const anchoredLetters = new Set<string>()

  return (
    <ul className="grid grid-cols-2 tablet:grid-cols-3 lg:grid-cols-4 gap-3 list-none m-0 p-0">
      {categoriesWithCount.map(({ category, count, hasNew }) => {
        const label = (CATEGORIES as Record<string, string>)[category] ?? category

        let anchorId: string | undefined
        if (enableLetterAnchors) {
          const letter = getIndexLetter(label)
          if (!anchoredLetters.has(letter)) {
            anchoredLetters.add(letter)
            anchorId = letter
          }
        }

        return (
          <li
            key={category}
            id={anchorId}
            style={
              anchorId
                ? { scrollMarginTop: 'calc(var(--header-height) + var(--spacing-12))' }
                : undefined
            }
          >
            <a
              href={`/categories/${encodeURIComponent(category)}/1`}
              className="card-hover flex flex-col gap-1 p-4 rounded-md ring-1 ring-border hover:ring-accent hover:bg-bg-subtle transition-colors relative"
            >
            {hasNew && (
              <span
                aria-label="New post"
                className="absolute top-3 right-3 w-1.5 h-1.5 bg-accent rounded-full"
              />
            )}
              <span className="capitalize text-sm font-medium text-text-heading leading-snug">
                {label}
              </span>
              <span className="text-xs text-text-muted tabular-nums">{count} posts</span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export default CategoriesGrid
