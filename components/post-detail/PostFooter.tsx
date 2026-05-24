import { Post } from '../../config/posts.config'
import Tags from '../tags/Tags'
import ShareButtons from './ShareButtons'

export interface PostFooterProps {
  post: Post
}

// Post footer (issue #153): tag row on the left, Copy link on the right. Sits
// between the body (+ ad) and the series/prev-next/more sections.
const PostFooter = ({ post }: PostFooterProps) => (
  <div className="flex flex-wrap items-start justify-between gap-4">
    <div className="min-w-0 flex-1">
      <Tags tags={post.tags} />
    </div>
    <ShareButtons />
  </div>
)

export default PostFooter
