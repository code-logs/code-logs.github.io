import { useEffect, useState } from 'react'
import { CATEGORIES } from '../../config/posts.config'
import postsDatabase from '../../database/post-database'
import SectionHeader from '../section-header/SectionHeader'

export interface CategoryIndexerProps {
  categories: string[]
  // When set, the matching category row is highlighted as the active location
  // (used on /categories/[category]/[page]). Match is on the raw category key.
  currentCategory?: string
}

const CategoryIndexer = ({ categories, currentCategory }: CategoryIndexerProps) => {
  const [newCategories, setNewCategories] = useState<string[]>([])

  useEffect(() => {
    setNewCategories(categories.filter((category) => postsDatabase.hasNewByCategory(category)))
  }, [categories])

  return (
    <section>
      <SectionHeader title="Categories" viewAllHref="/categories" />
      <ul className="m-0 list-none p-0">
        {categories.map((category) => {
          const isCurrent = category === currentCategory
          return (
            <li key={category}>
              <a
                href={`/categories/${encodeURIComponent(category)}/1`}
                aria-current={isCurrent ? 'page' : undefined}
                className={
                  isCurrent
                    ? 'flex items-center gap-2 border-b border-divider py-2 text-sm font-medium text-text-heading bg-bg-subtle rounded-md px-2'
                    : 'flex items-center gap-2 border-b border-divider py-2 text-sm text-text-body hover:text-link'
                }
              >
                {newCategories.includes(category) && (
                  <span className="rounded-sm bg-accent-strong px-1.5 text-[0.65rem] font-semibold uppercase tracking-wide text-accent-on">
                    New
                  </span>
                )}
                <span className="flex-1 capitalize">{(CATEGORIES as Record<string, string>)[category]}</span>
                <span
                  className={
                    isCurrent
                      ? 'grid h-6 w-6 place-items-center rounded-full ring-1 ring-divider text-xs tabular-nums text-text-muted'
                      : 'grid h-6 w-6 place-items-center rounded-full bg-bg-subtle text-xs tabular-nums text-text-muted'
                  }
                >
                  {postsDatabase.countByCategory(category)}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default CategoryIndexer
