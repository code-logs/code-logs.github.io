import { CATEGORIES, Post } from '../../config/posts.config'
import PathUtil from '../../utils/PathUtil'
import PostUtil from '../../utils/PostUtil'
import Tags from '../tags/Tags'

export interface PostCardProps {
  titleLevel?: 1 | 2 | 3
  post: Post
}

// Linear-list card variant (the /posts route). Distinct from PostCardGrid (the
// home 2-col grid): same data, card surface + ring + hover lift, with the
// side-thumbnail post-card-grid inner layout.
const PostCard = ({ titleLevel = 3, post }: PostCardProps) => (
  <article className="card-hover post-card-grid gap-3 rounded-lg ring-1 ring-border p-5">
    <span className="[grid-area:category] text-xs uppercase tracking-wide text-text-muted">
      {(CATEGORIES as Record<string, string>)[post.category]}
    </span>

    <span className="[grid-area:publishedAt] text-right text-xs text-text-muted tabular-nums">
      {PostUtil.readablePublishedAt(post)}
    </span>

    <a
      href={PostUtil.buildLinkURLByTitle(post.title)}
      className="[grid-area:title] min-w-0 break-words [&>*]:text-text-heading [&>*]:text-xl [&>*]:font-semibold [&>*]:my-2 hover:[&>*]:text-link"
    >
      {titleLevel === 1 && <h1>{post.title}</h1>}
      {titleLevel === 2 && <h2>{post.title}</h2>}
      {titleLevel === 3 && <h3>{post.title}</h3>}
    </a>

    <a
      href={PostUtil.buildLinkURLByTitle(post.title)}
      className="[grid-area:description] min-w-0 break-words"
    >
      <p className="m-0 text-sm leading-relaxed text-text-muted line-clamp-2 whitespace-pre-wrap">
        {post.description}
      </p>
    </a>

    {post.thumbnailName && (
      <div className="[grid-area:thumbnail]">
        <a href={PostUtil.buildLinkURLByTitle(post.title)}>
          <img
            src={PathUtil.buildImagePath(post.thumbnailName)}
            alt={post.description}
            width="160"
            height="120"
            className="w-[160px] h-[120px] max-w-full rounded-md object-cover"
          />
        </a>
      </div>
    )}

    <section className="[grid-area:tags] min-w-0">
      <Tags tags={post.tags} />
    </section>
  </article>
)

export default PostCard
