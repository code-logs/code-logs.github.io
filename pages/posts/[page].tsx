import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import CommonMeta from '../../components/common-meta/CommonMeta'
import NoFoundPosting from '../../components/no-found-posting/NoFoundPosting'
import Paginator from '../../components/paginator/Paginator'
import PostCardList from '../../components/post-card-list/PostCardList'
import SearchInput from '../../components/search-input/SearchInput'
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
  const lastPage = Math.ceil(postsDatabase.find().length / pageLimit)
  const posts = postsDatabase.find(pageLimit, skip)
  const totalCount = postsDatabase.count()

  return {
    props: {
      page,
      lastPage,
      posts,
      totalCount,
    },
  }
}

const Posts: NextPage<PostsProps> = (props) => {
  const { page, totalCount } = props
  const [lastPage, setLastPage] = useState(1)
  const [posts, setPosts] = useState<Post[]>([])
  const [query, setQuery] = useState<string>()
  const route = useRouter()

  const [pageInitialized, setPageInitialized] = useState(false)

  useEffect(() => {
    const url = new URL(PathUtil.absolutePath(route.asPath))

    if (url.search) {
      const searchParams = new URLSearchParams(url.search)
      const query = searchParams.get('query')
      if (query) {
        setQuery(encodeURIComponent(query))
        const pageLimit = blogConfig.pageLimit
        const skip = (page - 1) * pageLimit
        setPosts(postsDatabase.query(query, pageLimit, skip))
        setLastPage(Math.ceil(postsDatabase.query(query).length / pageLimit))
      }
    } else {
      setLastPage(props.lastPage)
      setPosts(props.posts)
      setQuery(undefined)
    }

    setPageInitialized(true)
  }, [page, route, props])

  const renderCommonFragment = useCallback(
    () => (
      <>
        <CommonMeta
          title={TitleUtil.buildPageTitle(META_CONTENTS.POSTS.TITLE)}
          description={META_CONTENTS.POSTS.DESCRIPTION(page)}
          url={`${blogConfig.baseURL}/posts/${page}`}
          imageURL={'/icons/icon-512x512.png'}
          keywords={posts.map((post) => [...post.tags, post.title, post.description]).flat()}
        />

        <span className="text-theme text-[0.8rem] float-right mt-wide">{query ? `Found ${posts.length}` : `Total ${totalCount}`}</span>
        <h1>Posts </h1>
      </>
    ),
    [page, posts, query, totalCount]
  )

  if (!pageInitialized) return renderCommonFragment()

  return (
    <>
      {renderCommonFragment()}

      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault()

          const form = event.currentTarget
          const query = new FormData(form).get('query')

          const url = new URL(location.href)
          url.pathname = '/posts/1'
          url.search = query ? `query=${encodeURIComponent(query.toString())}` : ''

          location.href = url.href
        }}
      >
        <SearchInput placeholder="Search..." name="query" defaultValue={query && decodeURIComponent(query)} />
      </form>

      {!!posts.length && (
        <>
          <PostCardList titleLevel={2} posts={posts} />
          <Paginator page={page} lastPage={lastPage} query={query} baseURL={`${blogConfig.baseURL}/posts`} />
        </>
      )}

      {query && !posts.length && <NoFoundPosting condition={query} />}
    </>
  )
}

export default Posts
