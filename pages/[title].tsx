import hljs from 'highlight.js'
import { NextPage } from 'next'
import { useEffect, useRef } from 'react'
import MainAdsBanner from '../components/ads-banner/MainAdsBanner'
import CommonMeta from '../components/common-meta/CommonMeta'
import ContentExplorer from '../components/content-explorer/ContentExplorer'
import { useActiveHeading, useHeadingTree } from '../components/content-explorer/toc'
import CommentsSection from '../components/post-detail/CommentsSection'
import MobileToc from '../components/post-detail/MobileToc'
import MoreFromCategory from '../components/post-detail/MoreFromCategory'
import PostFooter from '../components/post-detail/PostFooter'
import PostHeader from '../components/post-detail/PostHeader'
import PostThumbnail from '../components/post-detail/PostThumbnail'
import PrevNextNav from '../components/post-detail/PrevNextNav'
import SeriesNav from '../components/post-detail/SeriesNav'
import blogConfig from '../config/blog.config'
import { META_CONTENTS } from '../config/meta-contents'
import { Post } from '../config/posts.config'
import postsDatabase from '../database/post-database'
import { MarkdownUtil } from '../utils/MarkdownUtil'
import PathUtil from '../utils/PathUtil'
import { calculateReadingTime } from '../utils/PostServerUtil'
import PostUtil from '../utils/PostUtil'
import TitleUtil from '../utils/TitleUtil'

type PostWithReadingTime = Post & { readingTime: number }

export interface PostDetailPageProps {
  post: Post
  content: string
  readingTime: number
  previous: Post | null
  next: Post | null
  moreFromCategory: PostWithReadingTime[]
}

const MORE_FROM_CATEGORY_LIMIT = 3

export async function getStaticPaths() {
  const posts = postsDatabase.find()
  const titles = posts.map((post) => post.title)

  return {
    paths: titles.map((title) => '/' + PostUtil.normalizeTitle(title)),
    fallback: false,
  }
}

export async function getStaticProps(context: { params: { title: string } }) {
  const post = postsDatabase.findByTitle(context.params.title)!
  const content = MarkdownUtil.getMarkdownContent(PostUtil.getMarkdownFilePath(post))

  const moreFromCategory: PostWithReadingTime[] = postsDatabase
    .findByCategory(post.category)
    .filter((found) => found.title !== post.title)
    .slice(0, MORE_FROM_CATEGORY_LIMIT)
    .map((found) => ({ ...found, readingTime: calculateReadingTime(found) }))

  return {
    props: {
      post,
      content,
      readingTime: calculateReadingTime(post),
      // null (not undefined): Next.js rejects `undefined` in JSON props.
      previous: postsDatabase.findPrevious(post) ?? null,
      next: postsDatabase.findNext(post) ?? null,
      moreFromCategory,
    },
  }
}

// Top divider + 48px gap shared by every post-footer section (issue #153).
const sectionClass = 'mt-12 pt-12 border-t border-divider'

const PostDetail: NextPage<PostDetailPageProps> = ({ post, content, readingTime, previous, next, moreFromCategory }) => {
  const contentRef = useRef<HTMLElement>(null)

  // TOC tree + active heading are computed once here and shared by the desktop
  // aside and the mobile <details>, so the scan/observer never run twice.
  const { tree, ids } = useHeadingTree()
  const activeId = useActiveHeading(ids)

  useEffect(() => {
    hljs.highlightAll()
  }, [])

  // Heading anchors (issue #153): clicking (or Enter/Space on) an h2/h3 copies
  // its anchor URL. Headings come from dangerouslySetInnerHTML, so behavior is
  // wired here via delegation. The heading is made keyboard-focusable but keeps
  // its native heading role (no role="button" override) so screen-reader
  // heading navigation still works; `title` conveys the copy affordance.
  useEffect(() => {
    const container = contentRef.current
    if (!container) return

    const headings = Array.from(container.querySelectorAll<HTMLElement>('h2[id], h3[id]'))
    headings.forEach((heading) => {
      heading.tabIndex = 0
      heading.title = 'Copy link to this section'
    })

    const copyAnchor = (target: EventTarget | null) => {
      const heading = (target as HTMLElement | null)?.closest<HTMLElement>('h2[id], h3[id]')
      if (!heading || !container.contains(heading)) return
      const url = `${window.location.origin}${window.location.pathname}#${heading.id}`
      navigator.clipboard?.writeText(url).catch(() => {})
      window.history.replaceState(null, '', `#${heading.id}`)
    }

    const onClick = (event: MouseEvent) => copyAnchor(event.target)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      if (!(event.target as HTMLElement)?.closest('h2[id], h3[id]')) return
      event.preventDefault()
      copyAnchor(event.target)
    }

    container.addEventListener('click', onClick)
    container.addEventListener('keydown', onKeyDown)
    return () => {
      container.removeEventListener('click', onClick)
      container.removeEventListener('keydown', onKeyDown)
    }
  }, [content])

  return (
    <div className="post-detail-layout">
      <CommonMeta
        title={TitleUtil.buildPageTitle(META_CONTENTS.POST.TITLE(post.title))}
        description={META_CONTENTS.POST.DESCRIPTION(post.title, post.description, post.category, post.tags)}
        url={`${blogConfig.baseURL}${PostUtil.buildLinkURLByTitle(post.title)}`}
        imageURL={PathUtil.buildImagePath(post.thumbnailName)}
        keywords={[...post.tags, post.title, post.description, post.category]}
        article={{ publishedAt: post.publishedAt, tags: post.tags }}
      />

      <main className="min-w-0">
        <PostHeader post={post} readingTime={readingTime} />
        <PostThumbnail post={post} />
        <MobileToc tree={tree} activeId={activeId} />

        <article className="prose max-w-none post-body">
          <section id="content" ref={contentRef} dangerouslySetInnerHTML={{ __html: content }}></section>
        </article>

        <div className="mt-12">
          <MainAdsBanner />
        </div>

        <section className={sectionClass}>
          <PostFooter post={post} />
        </section>

        {post.series && (
          <section className={sectionClass}>
            <SeriesNav post={post} />
          </section>
        )}

        {(previous || next) && (
          <section className={sectionClass}>
            <PrevNextNav previous={previous ?? undefined} next={next ?? undefined} />
          </section>
        )}

        {!!moreFromCategory.length && (
          <section className={sectionClass}>
            <MoreFromCategory category={post.category} posts={moreFromCategory} />
          </section>
        )}

        {!!post.references?.length && (
          <section className={sectionClass}>
            <h2 className="m-0 mb-4 text-xl font-semibold text-text-heading">References</h2>
            <ul className="m-0 list-disc ps-5">
              {post.references.map((ref, idx) => (
                <li key={idx} className="text-sm text-text-body">
                  <a href={ref.url} target="_blank" rel="noreferrer" className="text-link hover:text-link-hover">
                    {ref.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className={sectionClass}>
          <CommentsSection />
        </section>
      </main>

      <aside className="max-lg:hidden">
        <ContentExplorer tree={tree} activeId={activeId} />
      </aside>
    </div>
  )
}

export default PostDetail
