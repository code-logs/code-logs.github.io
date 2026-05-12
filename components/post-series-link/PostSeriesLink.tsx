import { Post } from '../../config/posts.config'
import postsDatabase from '../../database/post-database'
import PostUtil from '../../utils/PostUtil'

export interface PostSeriesLinkProps {
  post: Post
}

const PostSeriesLink = ({ post }: PostSeriesLinkProps) => {
  return (
    <ol className="ps-[20px] [&>li]:list-disc [&>li]:mb-[20px] [&>li>h3]:italic [&>li>h3]:my-[5px]">
      {post.series?.prevPostTitle && (
        <li>
          <h3>
            <span>이전글 - </span>
            {post.series.prevPostTitle}
          </h3>
          <a href={PostUtil.buildLinkURLByTitle(post.series.prevPostTitle)}>{postsDatabase.findByTitle(post.series?.prevPostTitle)?.description || ''}</a>
        </li>
      )}

      {post.series?.nextPostTitle && (
        <li>
          <h3>
            <span>다음글 - </span>
            {post.series.nextPostTitle}
          </h3>
          <a href={PostUtil.buildLinkURLByTitle(post.series.nextPostTitle)}>{postsDatabase.findByTitle(post.series?.nextPostTitle)?.description || ''}</a>
        </li>
      )}
    </ol>
  )
}

export default PostSeriesLink
