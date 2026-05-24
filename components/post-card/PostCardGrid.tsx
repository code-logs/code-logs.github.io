import { CATEGORIES, Post } from '../../config/posts.config'
import PathUtil from '../../utils/PathUtil'
import PostUtil from '../../utils/PostUtil'

export interface PostCardGridProps {
  post: Post & { readingTime: number }
}

// Grid card used in the Recent section (2x2 on desktop, 1-col on mobile).
// The entire card is a single <a> (stretched-link pattern) so tags inside the
// meta bar are rendered as non-link text chips to avoid <a>-in-<a>.
const PostCardGrid = ({ post }: PostCardGridProps) => {
  const href = PostUtil.buildLinkURLByTitle(post.title)
  const categoryLabel = (CATEGORIES as Record<string, string>)[post.category] ?? post.category
  const visibleTags = post.tags.slice(0, 3)

  return (
    <article className="card-hover ring-1 ring-border rounded-lg overflow-hidden relative flex flex-col">
      {/* Thumbnail */}
      <div className="aspect-[16/9] overflow-hidden bg-bg-subtle">
        <img
          src={PathUtil.buildImagePath(post.thumbnailName)}
          alt={post.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-2">
        {/* Eyebrow category */}
        <span className="text-xs uppercase tracking-wide text-text-muted font-medium">
          {categoryLabel}
        </span>

        {/* Title — stretched link covers the whole card */}
        <h3 className="text-xl font-semibold text-text-heading line-clamp-2 my-0 leading-snug">
          <a
            href={href}
            className="text-text-heading hover:text-link after:absolute after:inset-0 after:content-['']"
          >
            {post.title}
          </a>
        </h3>

        {/* Description */}
        <p className="text-sm text-text-body line-clamp-2 m-0 leading-relaxed">{post.description}</p>

        {/* Meta bar: tags + reading time */}
        <div className="mt-auto pt-3 flex items-center gap-2 flex-wrap">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 bg-bg-subtle ring-1 ring-border rounded-sm text-text-muted before:content-['#']"
            >
              {tag}
            </span>
          ))}
          <span className="ml-auto text-xs text-text-muted whitespace-nowrap">
            {post.readingTime} min read
          </span>
        </div>
      </div>
    </article>
  )
}

export default PostCardGrid
