import { CATEGORIES } from '../../config/posts.config'

export interface CategoryWithCount {
  category: string
  count: number
  hasNew: boolean
}

export interface CategoriesGridProps {
  categoriesWithCount: CategoryWithCount[]
}

// 4x2 categories grid for the home page.
// Each card links to /categories/{category}/1 (individual category pages exist).
// "View all →" link is intentionally absent: /categories index page does not
// exist yet (#155). Pass viewAllHref to SectionHeader when #155 merges.
const CategoriesGrid = ({ categoriesWithCount }: CategoriesGridProps) => (
  <ul className="grid grid-cols-2 tablet:grid-cols-3 lg:grid-cols-4 gap-3 list-none m-0 p-0">
    {categoriesWithCount.map(({ category, count, hasNew }) => {
      const label = (CATEGORIES as Record<string, string>)[category] ?? category
      return (
        <li key={category}>
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

export default CategoriesGrid
