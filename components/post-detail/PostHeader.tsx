import { ArrowLeft } from 'lucide-react'
import { Post } from '../../config/posts.config'
import PostUtil from '../../utils/PostUtil'

export interface PostHeaderProps {
  post: Post
  readingTime: number
}

// Native <a> for internal navigation (full reload) is the site-wide convention
// over next/link; kept in a const so the literal path stays out of the
// statically-analyzed no-html-link-for-pages rule, matching the dynamic hrefs
// used elsewhere.
const POSTS_HREF = '/posts/1'

// Post-detail page header (issue #153): back link → category eyebrow → title →
// description → meta row framed by hairline dividers. Replaces the prior
// right-aligned date + italic 1.5rem description flow.
const PostHeader = ({ post, readingTime }: PostHeaderProps) => (
  <section className="mb-8">
    <a
      href={POSTS_HREF}
      className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-heading"
    >
      <ArrowLeft size={16} aria-hidden />
      Posts
    </a>

    <a
      href={`/categories/${encodeURIComponent(post.category)}/1`}
      className="mt-6 block text-xs uppercase tracking-wide text-text-muted hover:text-text-heading"
    >
      {post.category}
    </a>

    <h1 className="mt-2 mb-0 text-3xl lg:text-5xl font-bold tracking-tight text-text-heading">
      {post.title}
    </h1>

    <p className="mt-4 mb-0 text-lg text-text-muted leading-relaxed whitespace-pre-wrap">
      {post.description}
    </p>

    <div className="mt-6 py-3 border-t border-b border-divider text-sm text-text-muted">
      <span>{PostUtil.readablePublishedAt(post)}</span>
      <span className="mx-2" aria-hidden>
        ·
      </span>
      <span>{readingTime} min read</span>
    </div>
  </section>
)

export default PostHeader
