import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CategoryIndexer from '../../components/category-indexer/CategoryIndexer'
import CommonMeta from '../../components/common-meta/CommonMeta'
import NoFoundPosting from '../../components/no-found-posting/NoFoundPosting'
import PageHeader from '../../components/page-header/PageHeader'
import Paginator from '../../components/paginator/Paginator'
import PostCardList from '../../components/post-card-list/PostCardList'
import SearchInput from '../../components/search-input/SearchInput'
import TagIndexer, { TagWithCount } from '../../components/tag-indexer/TagIndexer'
import blogConfig from '../../config/blog.config'
import { META_CONTENTS } from '../../config/meta-contents'
import { Post } from '../../config/posts.config'
import postsDatabase from '../../database/post-database'
import PathUtil from '../../utils/PathUtil'
import TitleUtil from '../../utils/TitleUtil'

interface PostsProps {
  page: number
  lastPage: number
  posts: Post[]
  totalCount: number
  categories: string[]
  tagsWithCount: TagWithCount[]
}

export async function getStaticPaths() {
  const posts = postsDatabase.find()
  const lastPage = Math.ceil(posts.length / blogConfig.pageLimit)

  return {
    paths: Array(lastPage)
      .fill('')
      .map((_, idx) => `/posts/${idx + 1}`),
    fallback: false,
  }
}

export async function getStaticProps(context: { params: { page: string } }) {
  const page = Number(context.params.page)
  const pageLimit = blogConfig.pageLimit
  const skip = (page - 1) * pageLimit
  const allPosts = postsDatabase.find()
  const lastPage = Math.ceil(allPosts.length / pageLimit)
  const posts = postsDatabase.find(pageLimit, skip)
  const totalCount = postsDatabase.count()

  // Aside indexers: categories ordered by post count (desc), and tags with counts.
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
      totalCount,
      categories,
      tagsWithCount,
    },
  }
}

const Posts: NextPage<PostsProps> = (props) => {
  const { page, totalCount, categories, tagsWithCount } = props
  // Initialize from static props so the exported HTML carries the first-page
  // list. A search (?query=) URL swaps in filtered results client-side — the
  // brief page-1 flash before that effect runs is accepted (issue #154).
  const [lastPage, setLastPage] = useState(props.lastPage)
  const [posts, setPosts] = useState<Post[]>(props.posts)
  const [query, setQuery] = useState<string>()
  // Total matches across all search-result pages (not the current page slice),
  // so the header reads the true "Found N" count even when N > pageLimit.
  const [matchCount, setMatchCount] = useState(0)
  const route = useRouter()

  useEffect(() => {
    const url = new URL(PathUtil.absolutePath(route.asPath))

    if (url.search) {
      const searchParams = new URLSearchParams(url.search)
      const searchQuery = searchParams.get('query')
      if (searchQuery) {
        const pageLimit = blogConfig.pageLimit
        const skip = (page - 1) * pageLimit
        const matches = postsDatabase.query(searchQuery)
        setQuery(encodeURIComponent(searchQuery))
        setPosts(postsDatabase.query(searchQuery, pageLimit, skip))
        setMatchCount(matches.length)
        setLastPage(Math.ceil(matches.length / pageLimit))
        return
      }
    }

    setLastPage(props.lastPage)
    setPosts(props.posts)
    setQuery(undefined)
  }, [page, route, props])

  const decodedQuery = query && decodeURIComponent(query)
  const count = query ? matchCount : totalCount
  const subtitle = query
    ? `Found ${count} ${count === 1 ? 'post' : 'posts'} for "${decodedQuery}"`
    : `Total ${count} ${count === 1 ? 'post' : 'posts'}`

  return (
    <div className="container-content layout-with-aside py-12">
      <div>
        <CommonMeta
          title={TitleUtil.buildPageTitle(META_CONTENTS.POSTS.TITLE)}
          description={META_CONTENTS.POSTS.DESCRIPTION(page)}
          url={`${blogConfig.baseURL}/posts/${page}`}
          imageURL={'/icons/icon-512x512.png'}
          keywords={Array.from(new Set(posts.flatMap((post) => [...post.tags, post.category])))}
          // Supplemental client-side signal; static export blocks search query
          // URLs at robots.txt because this meta appears only after hydration.
          customMeta={query ? <meta name="robots" content="noindex, follow" /> : undefined}
        />

        <PageHeader title="Posts" subtitle={subtitle} query={query} />

        <form
          role="search"
          className="mb-8"
          onSubmit={(event) => {
            event.preventDefault()

            const form = event.currentTarget
            const submittedQuery = new FormData(form).get('query')

            const url = new URL(location.href)
            url.pathname = '/posts/1'
            url.search = submittedQuery ? `query=${encodeURIComponent(submittedQuery.toString())}` : ''

            location.href = url.href
          }}
        >
          <SearchInput
            placeholder="Search posts..."
            aria-label="Search posts"
            name="query"
            defaultValue={decodedQuery}
          />
        </form>

        {!!posts.length && (
          <>
            <PostCardList titleLevel={2} posts={posts} />
            <Paginator page={page} lastPage={lastPage} query={query} baseURL={`${blogConfig.baseURL}/posts`} />
          </>
        )}

        {query && !posts.length && <NoFoundPosting condition={query} />}
      </div>

      <aside className="space-y-10">
        <CategoryIndexer categories={categories} />
        <TagIndexer tagsWithCount={tagsWithCount} />
      </aside>
    </div>
  )
}

export default Posts
