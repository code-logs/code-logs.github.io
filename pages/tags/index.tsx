import { NextPage } from 'next'
import { Tags as TagsIcon } from 'lucide-react'
import AlphabetNav from '../../components/alphabet-nav/AlphabetNav'
import CommonMeta from '../../components/common-meta/CommonMeta'
import MainAdsBanner from '../../components/ads-banner/MainAdsBanner'
import PageHeader from '../../components/page-header/PageHeader'
import SectionHeader from '../../components/section-header/SectionHeader'
import { TagWithCount } from '../../components/tag-indexer/TagIndexer'
import TagsComponent from '../../components/tags/Tags'
import blogConfig from '../../config/blog.config'
import { META_CONTENTS } from '../../config/meta-contents'
import postsDatabase from '../../database/post-database'
import { ENGLISH_LETTERS, getIndexLetter, KOREAN_GROUPS, OTHER_GROUP } from '../../utils/HangulUtil'
import TitleUtil from '../../utils/TitleUtil'

const POPULAR_LIMIT = 10

// Native <a> for internal navigation (site-wide convention); the literal path
// lives in a const to stay out of the statically-analyzed no-html-link-for-pages
// rule, matching NoFoundPosting.
const POSTS_HREF = '/posts/1'

// Every bucket in render order: A–Z, the 14 Korean groups, then the catch-all.
const ALL_LETTERS = [...ENGLISH_LETTERS, ...KOREAN_GROUPS, OTHER_GROUP]

export async function getStaticProps() {
  // Flat list of every tag occurrence across published posts (duplicates kept —
  // they drive per-tag usage counts).
  const tags = postsDatabase
    .find()
    .map((post) => post.tags)
    .flat()
    .sort((a, b) => (a > b ? 1 : -1))

  return {
    props: {
      tags,
    },
  }
}

const Tags: NextPage<{ tags: string[] }> = ({ tags }) => {
  // Fix for the legacy count bug: unique tag count vs. total usage. The old
  // header showed tags.length (total occurrences) as if it were the tag count.
  const uniqueTagCount = new Set(tags).size
  const totalUsage = tags.length

  // Collapse occurrences into { tag, count }.
  const tagsWithCount = tags.reduce((acc, tag) => {
    const existing = acc.find((entry) => entry.tag === tag)
    if (existing) {
      existing.count++
    } else {
      acc.push({ tag, count: 1 })
    }
    return acc
  }, [] as TagWithCount[])

  // Top tags by usage, alphabetical tiebreak for stable output.
  const popularTags = [...tagsWithCount]
    .sort((a, b) => b.count - a.count || (a.tag > b.tag ? 1 : -1))
    .slice(0, POPULAR_LIMIT)

  // Bucket each tag into its alphabet group via the shared helper (correct
  // Hangul initial-consonant grouping included).
  const tagsByLetter = tagsWithCount.reduce((acc, tagWithCount) => {
    const letter = getIndexLetter(tagWithCount.tag)
    ;(acc[letter] ??= []).push(tagWithCount)
    return acc
  }, {} as Record<string, TagWithCount[]>)

  const activeLetterList = ALL_LETTERS.filter((letter) => tagsByLetter[letter]?.length)
  const activeLetters = new Set(activeLetterList)
  const firstActiveLetter = activeLetterList[0]

  // No published tags at all: render a friendly empty state instead of an
  // all-muted AlphabetNav + ad-only body, which reads as broken.
  const isEmpty = activeLetterList.length === 0
  // Hide "Popular tags" when the distinct-tag count is small enough that the
  // section would just duplicate the full alphabetical listing below.
  const showPopular = uniqueTagCount > POPULAR_LIMIT

  return (
    <section className="container-content py-12">
      <CommonMeta
        title={TitleUtil.buildPageTitle(META_CONTENTS.TAGS.TITLE)}
        description={META_CONTENTS.TAGS.DESCRIPTION}
        url={`${blogConfig.baseURL}/tags`}
        imageURL={'/icons/icon-512x512.png'}
      />

      <PageHeader
        title={META_CONTENTS.TAGS.TITLE}
        subtitle={`${uniqueTagCount} tags · ${totalUsage} uses`}
        breadcrumb={[{ label: 'Posts', href: '/posts/1' }, { label: META_CONTENTS.TAGS.TITLE }]}
      />

      {isEmpty && (
        <section className="mx-auto max-w-md py-16 text-center">
          <TagsIcon className="mx-auto mb-4 h-12 w-12 text-text-muted" strokeWidth={1.5} />
          <h2 className="text-2xl font-semibold text-text-heading">No tags yet</h2>
          <p className="mt-2 text-sm text-text-muted">
            Tags will appear here once posts are published.
            <br />
            Browse all posts in the meantime.
          </p>
          <a
            href={POSTS_HREF}
            className="mt-6 inline-flex h-10 items-center rounded-md border border-border px-4 text-sm font-medium hover:bg-bg-subtle"
          >
            Browse posts
          </a>
        </section>
      )}

      {!isEmpty && showPopular && (
        <section className="mb-10">
          <SectionHeader title="Popular tags" />
          <TagsComponent tags={popularTags} />
          {firstActiveLetter && (
            <a
              href={`#${firstActiveLetter}`}
              className="mt-3 inline-block text-sm text-text-muted transition-colors hover:text-accent"
            >
              View all below ↓
            </a>
          )}
        </section>
      )}

      {!isEmpty && (
        <>
          <AlphabetNav activeLetters={activeLetters} ariaLabel="Tag index navigation" />

          {activeLetterList.map((letter) => (
            <section
              key={letter}
              id={letter}
              className="mt-12 border-t border-divider pt-6"
              style={{ scrollMarginTop: 'calc(var(--header-height) + var(--spacing-12))' }}
            >
              <h2 className="mb-4 text-2xl font-semibold text-text-heading">{letter}</h2>
              <TagsComponent tags={tagsByLetter[letter]} />
            </section>
          ))}

          <MainAdsBanner />
        </>
      )}
    </section>
  )
}

export default Tags
