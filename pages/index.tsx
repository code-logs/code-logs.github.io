import type { NextPage } from 'next'
import CategoryIndexer from '../components/category-indexer/CategoryIndexer'
import CommonMeta from '../components/common-meta/CommonMeta'
import MainAdsBanner from '../components/ads-banner/MainAdsBanner'
import RecentPosts from '../components/recent-posts/RecentPosts'
import TagIndexer, { TagWithCount } from '../components/tag-indexer/TagIndexer'
import blogConfig from '../config/blog.config'
import { META_CONTENTS } from '../config/meta-contents'
import { Post } from '../config/posts.config'
import postsDatabase from '../database/post-database'
import TitleUtil from '../utils/TitleUtil'

export async function getStaticProps() {
  const posts = postsDatabase.find()

  const recentPosts = postsDatabase.find(blogConfig.recentPostsLimit)
  const categories = Array.from(new Set(posts.map((post) => post.category))).sort()

  const tags = Array.from(new Set(posts.map((post) => post.tags).flat()))

  const tagsWithCount = tags.reduce((tagsWithCount, tag) => {
    let count = 0
    posts.forEach((post) => {
      if (post.tags?.includes(tag!)) count++
    })

    tagsWithCount.push({ tag: tag!, count })

    return tagsWithCount
  }, [] as TagWithCount[])

  return { props: { recentPosts, categories, tagsWithCount } }
}

const Home: NextPage<{
  recentPosts: Post[]
  categories: string[]
  tagsWithCount: TagWithCount[]
}> = (props) => {
  return (
    <div className="container-content">
      <CommonMeta
        title={TitleUtil.buildPageTitle(META_CONTENTS.MAIN.TITLE)}
        description={META_CONTENTS.MAIN.DESCRIPTION}
        keywords={props.categories}
        url={blogConfig.baseURL}
        imageURL={'/icons/icon-512x512.png'}
      />

      <h1>Home</h1>

      <RecentPosts posts={props.recentPosts} />

      <MainAdsBanner />

      <div className="grid grid-cols-2 pb-5 max-tablet:grid-cols-1 max-tablet:gap-3">
        <CategoryIndexer categories={props.categories} />

        <TagIndexer tagsWithCount={props.tagsWithCount} limit={20} />
      </div>
    </div>
  )
}

export default Home
