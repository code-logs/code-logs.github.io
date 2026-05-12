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
              className="flex gap-narrow border-b border-theme-light p-narrow"
            >
              {newCategories.includes(category) && (
                <span className="bg-[rgb(253,69,74)] py-narrow px-narrow rounded-[50px] text-white font-semibold italic text-[0.7rem] my-auto">
                  New
                </span>
              )}
              <span className="flex-1 my-auto capitalize">{(CATEGORIES as any)[category]}</span>
              <span className="rounded-[50px] bg-theme text-white w-[25px] h-[25px] grid">
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
