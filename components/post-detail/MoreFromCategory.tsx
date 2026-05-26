import { ArrowRight } from 'lucide-react'
import { Post } from '../../config/posts.config'
import PostCardGrid from '../post-card/PostCardGrid'

export interface MoreFromCategoryProps {
  category: string
  posts: (Post & { readingTime: number })[]
}

// Static literals so Tailwind's JIT keeps the class (a `grid-cols-${n}` template
// would be purged). Caps desktop columns at the visible count so 1–2 posts fill
// the row instead of rendering as lone narrow, left-skewed cards (issue #192).
const DESKTOP_GRID_COLS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
}

// "More from {category}" (issue #153): up to 3 latest posts in the same
// category, rendered with the shared PostCardGrid (#152). Replaces the prior
// list-disc CategoryPostGroup. Renders nothing when the category has no other
// posts.
const MoreFromCategory = ({ category, posts }: MoreFromCategoryProps) => {
  if (!posts.length) return null

  const desktopCols = DESKTOP_GRID_COLS[Math.min(posts.length, 3)] ?? 'grid-cols-3'

  return (
    <section>
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="m-0 text-xl font-semibold text-text-heading border-0 p-0">
          More from {category}
        </h2>
        <a
          href={`/categories/${encodeURIComponent(category)}/1`}
          className="inline-flex items-center gap-1 whitespace-nowrap text-sm text-link hover:text-link-hover"
        >
          View category
          <ArrowRight size={16} aria-hidden />
        </a>
      </div>

      <div className={`grid ${desktopCols} gap-6 max-tablet:grid-cols-1`}>
        {posts.map((post) => (
          <PostCardGrid key={post.fileName} post={post} />
        ))}
      </div>
    </section>
  )
}

export default MoreFromCategory
