import { Post } from '../../config/posts.config'
import PostUtil from '../../utils/PostUtil'
import NavCard from './NavCard'

export interface PrevNextNavProps {
  previous?: Post
  next?: Post
}

// Chronological prev/next post navigation (issue #153), independent of series.
// `previous` is the older post, `next` the newer one (see
// postsDatabase.findPrevious / findNext). The empty cell is held with an
// invisible spacer so a lone card keeps its left/right alignment.
const PrevNextNav = ({ previous, next }: PrevNextNavProps) => {
  if (!previous && !next) return null

  return (
    <nav aria-label="Post navigation" className="grid grid-cols-2 gap-4 max-tablet:grid-cols-1">
      {previous ? (
        <NavCard
          direction="prev"
          label="Previous post"
          title={previous.title}
          href={PostUtil.buildLinkURLByTitle(previous.title)}
        />
      ) : (
        <span className="max-tablet:hidden" />
      )}
      {next ? (
        <NavCard
          direction="next"
          label="Next post"
          title={next.title}
          href={PostUtil.buildLinkURLByTitle(next.title)}
        />
      ) : (
        <span className="max-tablet:hidden" />
      )}
    </nav>
  )
}

export default PrevNextNav
