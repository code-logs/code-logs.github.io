import hljs from 'highlight.js'
import { NextPage } from 'next'
import { useEffect, useRef } from 'react'
import MainAdsBanner from '../components/ads-banner/MainAdsBanner'
import CategoryPostGroup from '../components/category-post-group/CategoryPostGroup'
import CommonMeta from '../components/common-meta/CommonMeta'
import PostSeriesLink from '../components/post-series-link/PostSeriesLink'
import Utterances from '../components/utterrances/Utterrances'
import blogConfig from '../config/blog.config'
import { META_CONTENTS } from '../config/meta-contents'
import { Post } from '../config/posts.config'
import postsDatabase from '../database/post-database'
import { MarkdownUtil } from '../utils/MarkdownUtil'
import PathUtil from '../utils/PathUtil'
import PostUtil from '../utils/PostUtil'
import TitleUtil from '../utils/TitleUtil'
import CarouselBanner from '../components/carousel-banner'
import bannerConfig from '../config/banner.config'

export interface PostDetailPageProps {
  post: Post
  content: string
  postsByCategory: Post[]
  enableContentExplorer: boolean
}

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
  const postsByCategory = postsDatabase.findByCategory(post.category).filter((foundPost) => foundPost.title !== post.title)

  return {
    props: { post, content, postsByCategory, enableContentExplorer: true },
  }
}

const sectionHeadingClass =
  '[&>h2]:mt-10 [&>h2]:mb-0 [&>h2]:text-[1.5rem] [&>h2]:pb-common [&>h2]:border-b [&>h2]:border-theme-light'

const PostDetail: NextPage<PostDetailPageProps> = ({ post, content, postsByCategory }: PostDetailPageProps) => {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    hljs.highlightAll()
  }, [])

  return (
    <>
      <CommonMeta
        title={TitleUtil.buildPageTitle(META_CONTENTS.POST.TITLE(post.title))}
        description={META_CONTENTS.POST.DESCRIPTION(post.title, post.description, post.category, post.tags)}
        url={`${blogConfig.baseURL}/${PostUtil.normalizeTitle(post.title)}`}
        imageURL={PathUtil.buildImagePath(post.thumbnailName)}
        keywords={[...post.tags, post.title, post.description, post.category]}
      />

      <article className="prose max-w-none post-body" ref={containerRef}>
        <p className="text-[0.9rem] text-theme m-0 text-right">
          <span>{PostUtil.readablePublishedAt(post)}</span>
        </p>
        <section className="relative m-0 [&_img]:object-cover [&_img]:w-full [&_img]:h-[315px] max-tablet:[&_img]:!object-contain max-tablet:[&_img]:h-auto">
          <img src={PathUtil.buildImagePath(post.thumbnailName)} alt={post.description} width="400" height="300" />
        </section>

        <CarouselBanner banners={bannerConfig} />

        <section>
          <h1>{post.title}</h1>
          <p className="italic text-theme text-[1.5rem] whitespace-pre-wrap leading-[2rem]">{post.description}</p>
        </section>

        <section id="content" dangerouslySetInnerHTML={{ __html: content }}></section>
      </article>

      <MainAdsBanner />

      {post.series && (
        <section className={sectionHeadingClass}>
          <h2>연관 포스팅</h2>
          <PostSeriesLink post={post} />
        </section>
      )}

      {!!postsByCategory.length && (
        <section className={sectionHeadingClass}>
          <h2>카테고리 더보기</h2>
          <CategoryPostGroup posts={postsByCategory} />
        </section>
      )}

      {!!post.references?.length && (
        <section className={`${sectionHeadingClass} [&_li]:list-disc`}>
          <h2>참고</h2>
          <ul>
            {post.references.map((ref, idx) => (
              <li key={idx}>
                <a href={ref.url} target="_blank" rel="noreferrer">
                  {ref.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={sectionHeadingClass}>
        <h2>댓글</h2>
        <Utterances repo={'code-logs/code-logs.github.io'} theme={'preferred-color-scheme'} issueTerm={'title'} issueLabel={'Comment'} />
      </section>
    </>
  )
}

export default PostDetail
