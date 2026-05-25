import { NextPage } from 'next'
import MainAdsBanner from '../../../components/ads-banner/MainAdsBanner'
import CategoryIndexer from '../../../components/category-indexer/CategoryIndexer'
import CommonMeta from '../../../components/common-meta/CommonMeta'
import PageHeader from '../../../components/page-header/PageHeader'
import Paginator from '../../../components/paginator/Paginator'
import PostCardList from '../../../components/post-card-list/PostCardList'
import TagIndexer, { TagWithCount } from '../../../components/tag-indexer/TagIndexer'
import blogConfig from '../../../config/blog.config'
import { META_CONTENTS } from '../../../config/meta-contents'
import { CATEGORIES, Post } from '../../../config/posts.config'
import postsDatabase from '../../../database/post-database'
import TitleUtil from '../../../utils/TitleUtil'

export async function getStaticPaths() {
  const posts = postsDatabase.find()
  const categories = posts.map((post) => post.category)
  const categoryPageMap = new Map<string, number>()
  categories.forEach((category) => {
    const posts = postsDatabase.findByCategory(category)
    const lastPage = Math.ceil(posts.length / blogConfig.pageLimit)

    categoryPageMap.set(category, lastPage)
  })

  let paths: string[] = []
  categoryPageMap.forEach((lastPage, category) => {
    Array(lastPage)
      .fill('')
      .map((_, idx) => idx + 1)
      .forEach((page) => {
        paths.push(`/categories/${encodeURIComponent(category)}/${page}`)
      })
  })

  return { paths, fallback: false }
}

export async function getStaticProps(context: { params: { category: string; page: string } }) {
  const category = decodeURI(context.params.category)
  const page = Number(context.params.page)
  const pageLimit = blogConfig.pageLimit
  const skip = (page - 1) * pageLimit

  const lastPage = Math.ceil(postsDatabase.findByCategory(category).length / pageLimit)
  const posts = postsDatabase.findByCategory(category, pageLimit, skip)
  const count = postsDatabase.countByCategory(category)

  // Aside indexers: categories ordered by post count (desc), and tags with counts.
  const allPosts = postsDatabase.find()
  const categoryCountMap = new Map<string, number>()
  const tagCountMap = new Map<string, number>()
  allPosts.forEach((post) => {
    categoryCountMap.set(post.category, (categoryCountMap.get(post.category) ?? 0) + 1)
    post.tags.forEach((tag) => tagCountMap.set(tag, (tagCountMap.get(tag) ?? 0) + 1))
  })

  const categories = Array.from(categoryCountMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category)

  const tagsWithCount: TagWithCount[] = Array.from(tagCountMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }))

  return {
    props: {
      page,
      lastPage,
      posts,
      category,
      count,
      categories,
      tagsWithCount,
    },
  }
}

const Category: NextPage<{
  page: number
  lastPage: number
  posts: Post[]
  category: string
  count: number
  categories: string[]
  tagsWithCount: TagWithCount[]
}> = (props) => {
  const { page, lastPage, posts, category, count, categories, tagsWithCount } = props
  const label = (CATEGORIES as Record<string, string>)[category] ?? category

  return (
    <div className="container-content layout-with-aside">
      <div>
        <CommonMeta
          title={TitleUtil.buildPageTitle(META_CONTENTS.CATEGORY_DETAIL.TITLE(category))}
          description={META_CONTENTS.CATEGORY_DETAIL.DESCRIPTION(category, page)}
          url={`${blogConfig.baseURL}/categories/${encodeURIComponent(category)}/${page}`}
          imageURL={'/icons/icon-512x512.png'}
          keywords={posts.map((post) => [...post.tags, post.title, post.category, post.description]).flat()}
        />

        <PageHeader
          title={label}
          subtitle={`${count} ${count === 1 ? 'post' : 'posts'}`}
          breadcrumb={[{ label: 'Categories', href: '/categories' }, { label }]}
        />

        <PostCardList titleLevel={2} posts={posts} />

        <MainAdsBanner />

        <Paginator
          page={page}
          lastPage={lastPage}
          baseURL={`${blogConfig.baseURL}/categories/${encodeURIComponent(category)}`}
        />
      </div>

      <aside className="space-y-10">
        <CategoryIndexer categories={categories} currentCategory={category} />
        <TagIndexer tagsWithCount={tagsWithCount} />
      </aside>
    </div>
  )
}

export default Category
