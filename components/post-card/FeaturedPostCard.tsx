import { CATEGORIES, Post } from '../../config/posts.config'
import PathUtil from '../../utils/PathUtil'
import PostUtil from '../../utils/PostUtil'

export interface FeaturedPostCardProps {
  post: Post & { readingTime: number }
}

// Large 2-col featured card for the most recent post.
// Desktop: [thumbnail 2fr | content 3fr], mobile: stacked (flex-col).
// Whole card is a group; the "Read post →" CTA nudges right on hover.
// Tags in the tag-row are non-link text chips (avoids <a>-in-<a> nesting).
const FeaturedPostCard = ({ post }: FeaturedPostCardProps) => {
  const href = PostUtil.buildLinkURLByTitle(post.title)
  const categoryLabel = (CATEGORIES as Record<string, string>)[post.category] ?? post.category
  const visibleTags = post.tags.slice(0, 3)

  return (
    <article className="card-hover group ring-1 ring-border rounded-lg overflow-hidden relative">
      <div className="grid grid-cols-[2fr_3fr] max-tablet:grid-cols-1">
        {/* Thumbnail */}
        <div className="aspect-[4/3] overflow-hidden bg-bg-subtle max-tablet:aspect-[16/9]">
          <img
            src={PathUtil.buildImagePath(post.thumbnailName)}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col p-8 gap-3 max-tablet:p-5">
          {/* Eyebrow */}
          <span className="text-xs uppercase tracking-wide text-text-muted font-medium">
            {categoryLabel}
          </span>

          {/* Title with stretched link — h3 to sit under the section's h2 ("Featured") */}
          <h3 className="text-3xl font-semibold text-text-heading line-clamp-2 m-0 leading-snug max-tablet:text-2xl">
            <a
              href={href}
              className="text-text-heading hover:text-link after:absolute after:inset-0 after:content-['']"
            >
              {post.title}
            </a>
          </h3>

          {/* Description */}
          <p className="text-sm text-text-body line-clamp-3 m-0 leading-relaxed">
            {post.description}
          </p>

          {/* Tag row */}
          <div className="flex items-center gap-2 flex-wrap mt-auto">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-bg-subtle ring-1 ring-border rounded-sm text-text-muted before:content-['#']"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA — decorative; intentionally NOT lifted above the stretched-link
              overlay so the whole card (CTA text included) is a single click target. */}
          <span className="pointer-events-none inline-flex items-center gap-1 text-sm font-medium text-accent group-hover:translate-x-0.5 transition-transform">
            Read post →
          </span>
        </div>
      </div>
    </article>
  )
}

export default FeaturedPostCard
