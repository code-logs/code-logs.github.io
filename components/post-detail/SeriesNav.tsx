import { Post } from '../../config/posts.config'
import postsDatabase from '../../database/post-database'
import PostUtil from '../../utils/PostUtil'
import NavCard from './NavCard'

export interface SeriesNavProps {
  post: Post
}

// Series prev/next as a card pair (issue #153), replacing the prior list-disc
// PostSeriesLink. Renders only when the post declares a series neighbor.
const SeriesNav = ({ post }: SeriesNavProps) => {
  const prevTitle = post.series?.prevPostTitle
  const nextTitle = post.series?.nextPostTitle
  if (!prevTitle && !nextTitle) return null

  return (
    <nav aria-label="Series navigation" className="grid grid-cols-2 gap-4 max-tablet:grid-cols-1">
      {prevTitle && (
        <NavCard
          direction="prev"
          label="Previous in series"
          title={prevTitle}
          description={postsDatabase.findByTitle(prevTitle)?.description}
          href={PostUtil.buildLinkURLByTitle(prevTitle)}
        />
      )}
      {nextTitle && (
        <NavCard
          direction="next"
          label="Next in series"
          title={nextTitle}
          description={postsDatabase.findByTitle(nextTitle)?.description}
          href={PostUtil.buildLinkURLByTitle(nextTitle)}
        />
      )}
    </nav>
  )
}

export default SeriesNav
