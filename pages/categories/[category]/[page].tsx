import { NextPage } from 'next'
import MainAdsBanner from '../../../components/ads-banner/MainAdsBanner'
import CommonMeta from '../../../components/common-meta/CommonMeta'
import Paginator from '../../../components/paginator/Paginator'
import PostCardList from '../../../components/post-card-list/PostCardList'
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

  return {
    props: {
      page,
      lastPage,
      posts,
      category,
    },
  }
}

const Category: NextPage<{
  page: number
  lastPage: number
  posts: Post[]
  category: string
}> = (props) => {
  const { page, lastPage, posts, category } = props

  return (
    <div className="container-content">
      <CommonMeta
        title={TitleUtil.buildPageTitle(META_CONTENTS.CATEGORIES.TITLE(category))}
        description={META_CONTENTS.CATEGORIES.DESCRIPTION(category, page)}
        url={`categories/${category}/${page}}`}
        imageURL={'/icons/icon-512x512.png'}
        keywords={posts.map((post) => [...post.tags, post.title, post.category, post.description]).flat()}
      />

      <h1 className="capitalize">{(CATEGORIES as any)[category]}</h1>

      <PostCardList titleLevel={2} posts={posts} />

      <MainAdsBanner />

      <Paginator page={page} lastPage={lastPage} baseURL={`${blogConfig.baseURL}/categories/${category}`} />
    </div>
  )
}

export default Category
