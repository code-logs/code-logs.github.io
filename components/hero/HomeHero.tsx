import { SITE_TAGLINE } from '../../config/footer.config'

export interface HomeHeroProps {
  lastUpdated: string // ISO date string (publishedAt of most recent post)
  postCount: number
}

// Page-level <h1>: the wordmark functions as the site's primary heading for
// screen readers and SEO. The visible <h1>Home</h1> from the old index was
// removed; this is its accessible replacement.
const HomeHero = ({ lastUpdated, postCount }: HomeHeroProps) => {
  const displayDate = new Date(lastUpdated).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <section className="py-12 max-tablet:py-8">
      <h1 className="font-mono text-5xl font-medium tracking-tighter text-text-heading max-tablet:text-3xl leading-tight m-0">
        code-logs
        <span className="text-accent">/</span>
      </h1>

      <p className="mt-4 text-lg text-text-muted leading-relaxed">{SITE_TAGLINE}</p>

      <p className="mt-3 text-sm text-text-muted">
        Last updated{' '}
        <time dateTime={lastUpdated}>{displayDate}</time>
        {' · '}
        {postCount} posts
      </p>
    </section>
  )
}

export default HomeHero
