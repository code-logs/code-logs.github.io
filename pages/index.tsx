import type { NextPage } from 'next'
import CategoriesGrid, { CategoryWithCount } from '../components/categories-grid/CategoriesGrid'
import CommonMeta from '../components/common-meta/CommonMeta'
import HomeHero from '../components/hero/HomeHero'
import FeaturedPostCard from '../components/post-card/FeaturedPostCard'
import PostCardGrid from '../components/post-card/PostCardGrid'
import SectionHeader from '../components/section-header/SectionHeader'
import MainAdsBanner from '../components/ads-banner/MainAdsBanner'
import { TagWithCount } from '../components/tag-indexer/TagIndexer'
import Tags from '../components/tags/Tags'
import blogConfig from '../config/blog.config'
import { META_CONTENTS } from '../config/meta-contents'
import { Post } from '../config/posts.config'
import postsDatabase from '../database/post-database'
import TitleUtil from '../utils/TitleUtil'
import { calculateReadingTime } from '../utils/PostServerUtil'

type PostWithReadingTime = Post & { readingTime: number }

export async function getStaticProps() {
  const posts = postsDatabase.find()

  // Featured = most recent post; Recent = next 4 posts (indices 1–4)
  const featuredPost: PostWithReadingTime = {
    ...posts[0],
    readingTime: calculateReadingTime(posts[0]),
  }

  const recentPosts: PostWithReadingTime[] = posts.slice(1, 5).map((post) => ({
    ...post,
    readingTime: calculateReadingTime(post),
  }))

  // Top 8 categories by post count
  const categoryCountMap = new Map<string, number>()
  posts.forEach((post) => {
    categoryCountMap.set(post.category, (categoryCountMap.get(post.category) ?? 0) + 1)
  })
  const categoriesWithCount: CategoryWithCount[] = Array.from(categoryCountMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([category, count]) => ({
      category,
      count,
      hasNew: postsDatabase.hasNewByCategory(category),
    }))

  // Top 12 tags by post count
  const tagCountMap = new Map<string, number>()
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCountMap.set(tag, (tagCountMap.get(tag) ?? 0) + 1)
    })
  })
  const tagsWithCount: TagWithCount[] = Array.from(tagCountMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([tag, count]) => ({ tag, count }))

  const totalPostCount = postsDatabase.count()
  const lastUpdated = posts[0].publishedAt

  return {
    props: {
      featuredPost,
      recentPosts,
      categoriesWithCount,
      tagsWithCount,
      totalPostCount,
      lastUpdated,
    },
  }
}

const Home: NextPage<{
  featuredPost: PostWithReadingTime
  recentPosts: PostWithReadingTime[]
  categoriesWithCount: CategoryWithCount[]
  tagsWithCount: TagWithCount[]
  totalPostCount: number
  lastUpdated: string
}> = (props) => {
  const { featuredPost, recentPosts, categoriesWithCount, tagsWithCount, totalPostCount, lastUpdated } = props

  return (
    <div className="container-content">
      <CommonMeta
        title={TitleUtil.buildPageTitle(META_CONTENTS.MAIN.TITLE)}
        description={META_CONTENTS.MAIN.DESCRIPTION}
        keywords={categoriesWithCount.map((c) => c.category)}
        url={blogConfig.baseURL}
        imageURL={'/icons/icon-512x512.png'}
      />

      {/* Hero — acts as page <h1> for accessibility */}
      <HomeHero lastUpdated={lastUpdated} postCount={totalPostCount} />

      {/* Featured post */}
      <section className="mb-16">
        <SectionHeader title="Featured" />
        <FeaturedPostCard post={featuredPost} />
      </section>

      {/* Ad separator between Featured and Recent */}
      <MainAdsBanner />

      {/* Recent posts — 2x2 grid */}
      <section className="mb-16">
        <SectionHeader title="Recent" viewAllHref="/posts/1" />
        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6">
          {recentPosts.map((post) => (
            <PostCardGrid key={post.title} post={post} />
          ))}
        </div>
      </section>

      {/* Categories — top 8, no "View all" until /categories index exists (#155) */}
      <section className="mb-16">
        <SectionHeader title="Categories" />
        <CategoriesGrid categoriesWithCount={categoriesWithCount} />
      </section>

      {/* Ad separator between Categories and Tags */}
      <MainAdsBanner />

      {/* Tags — top 12 */}
      <section className="mb-16">
        <SectionHeader title="Tags" viewAllHref="/tags" />
        <Tags tags={tagsWithCount} />
      </section>
    </div>
  )
}

export default Home
