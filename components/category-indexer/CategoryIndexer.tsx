import { useEffect, useState } from 'react'
import { CATEGORIES } from '../../config/posts.config'
import postsDatabase from '../../database/post-database'

export interface CategoryIndexerProps {
  categories: string[]
}

const CategoryIndexer = ({ categories }: CategoryIndexerProps) => {
  const [newCategories, setNewCategories] = useState<string[]>([])

  useEffect(() => {
    setNewCategories(categories.filter((category) => postsDatabase.hasNewByCategory(category)))
  }, [categories])

  return (
    <section>
      <h2>Categories</h2>
      <ul className="m-0 p-0">
        {categories.map((category, idx) => (
          <li key={idx}>
            <a
              href={`/categories/${encodeURIComponent(category)}/1`}
              className="flex gap-1 border-b border-divider p-1"
            >
              {newCategories.includes(category) && (
                <span className="bg-danger py-1 px-1 rounded-full text-white font-semibold italic text-[0.7rem] my-auto">
                  New
                </span>
              )}
              <span className="flex-1 my-auto capitalize">{(CATEGORIES as any)[category]}</span>
              <span className="rounded-full bg-bg-subtle text-text-body w-[25px] h-[25px] grid">
                <span className="m-auto">{postsDatabase.countByCategory(category)}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default CategoryIndexer
