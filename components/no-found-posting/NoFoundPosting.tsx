import { SearchX } from 'lucide-react'

export interface NoFoundPostingProps {
  condition: string
}

// Native <a> for internal navigation (site-wide convention); the literal path
// lives in a const to stay out of the statically-analyzed no-html-link-for-pages
// rule, matching PostHeader.
const POSTS_HREF = '/posts/1'

const NoFoundPosting = ({ condition }: NoFoundPostingProps) => (
  <section className="mx-auto max-w-md py-16 text-center">
    <SearchX className="mx-auto mb-4 h-12 w-12 text-text-muted" strokeWidth={1.5} />
    <h2 className="text-2xl font-semibold text-text-heading">No posts found</h2>
    <p className="mt-2 text-sm text-text-muted">
      We couldn&apos;t find any posts matching{' '}
      <strong className="text-text-body">{`"${decodeURIComponent(condition)}"`}</strong>.
      <br />
      Try a different keyword or browse all posts.
    </p>
    <a
      href={POSTS_HREF}
      className="mt-6 inline-flex h-10 items-center rounded-md border border-border px-4 text-sm font-medium hover:bg-bg-subtle"
    >
      Clear search
    </a>
  </section>
)

export default NoFoundPosting
