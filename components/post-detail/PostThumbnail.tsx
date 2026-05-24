import { Post } from '../../config/posts.config'
import PathUtil from '../../utils/PathUtil'

export interface PostThumbnailProps {
  post: Post
}

// Post-detail thumbnail (issue #153): a 16:9 cover image with a soft radius.
// Replaces the prior forced 315px height + mobile object-contain branch.
// Renders nothing when the post has no thumbnail.
const PostThumbnail = ({ post }: PostThumbnailProps) => {
  if (!post.thumbnailName) return null

  return (
    <div className="mb-10 aspect-[16/9] overflow-hidden rounded-lg bg-bg-subtle">
      <img
        src={PathUtil.buildImagePath(post.thumbnailName)}
        alt={post.title}
        className="w-full h-full object-cover"
      />
    </div>
  )
}

export default PostThumbnail
