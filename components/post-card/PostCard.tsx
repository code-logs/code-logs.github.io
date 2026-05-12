import { CATEGORIES, Post } from '../../config/posts.config'
import PathUtil from '../../utils/PathUtil'
import PostUtil from '../../utils/PostUtil'
import Tags from '../tags/Tags'

export interface PostCardProps {
  titleLevel?: 1 | 2 | 3
  post: Post
}

const PostCard = ({ titleLevel = 3, post }: PostCardProps) => (
  <article className="clickable post-card-grid gap-common border-t border-theme-light py-wide">
    <a
      href={PostUtil.buildLinkURLByTitle(post.title)}
      className="[grid-area:title] [&>h1]:text-theme-dark [&>h1]:text-[1.5rem] [&>h1]:my-common [&>h2]:text-theme-dark [&>h2]:text-[1.5rem] [&>h2]:my-common [&>h3]:text-theme-dark [&>h3]:text-[1.5rem] [&>h3]:my-common"
    >
      {titleLevel === 1 && <h1>{post.title}</h1>}
      {titleLevel === 2 && <h2>{post.title}</h2>}
      {titleLevel === 3 && <h3>{post.title}</h3>}
    </a>

    <span className="[grid-area:category] text-[0.9rem] font-light capitalize italic text-theme">
      {(CATEGORIES as any)[post.category]}
    </span>

    <span className="[grid-area:publishedAt] text-right text-[0.9rem] font-light text-theme">
      {PostUtil.readablePublishedAt(post)}
    </span>

    <a
      href={PostUtil.buildLinkURLByTitle(post.title)}
      className="[grid-area:description] [&>p]:whitespace-pre-wrap [&>p]:mt-0 [&>p]:leading-wide [&>p]:text-theme"
    >
      <p>{post.description}</p>
    </a>

    {post.thumbnailName && (
      <div className="[grid-area:thumbnail] m-auto">
        <a href={PostUtil.buildLinkURLByTitle(post.title)}>
          <img
            src={PathUtil.buildImagePath(post.thumbnailName)}
            alt={post.description}
            width="400"
            height="300"
            className="rounded-md w-[335px] max-w-full h-full"
          />
        </a>
      </div>
    )}

    <section className="[grid-area:tags]">
      <Tags tags={post.tags} />
    </section>
  </article>
)

export default PostCard
