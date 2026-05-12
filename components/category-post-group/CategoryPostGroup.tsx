import { useEffect, useState } from 'react'
import { Post } from '../../config/posts.config'
import PostUtil from '../../utils/PostUtil'

export interface CategoryPostGroupProps {
  posts: Post[]
}

const containerClass =
  'ps-[20px] [&>li]:list-disc [&>li]:mb-[20px] [&>li>h3]:italic [&>li>h3]:my-[5px]'

const CategoryPostGroup = ({ posts }: CategoryPostGroupProps) => {
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [remainPosts, setRemainPosts] = useState<Post[]>([])

  useEffect(() => {
    const recentPostLimit = 3
    const copied = [...posts]
    setRecentPosts(copied.slice(0, recentPostLimit))
    setRemainPosts(copied.slice(recentPostLimit))
  }, [posts])

  return (
    <>
      <ul className={containerClass}>
        {recentPosts.map((post) => (
          <li key={post.fileName}>
            <h3>{post.title}</h3>
            <a href={PostUtil.buildLinkURLByTitle(post.title)}>{post.description}</a>
          </li>
        ))}
      </ul>

      {!!remainPosts.length && (
        <details>
          <summary>더보기</summary>
          <ul className={containerClass}>
            {posts.map((post) => (
              <li key={post.fileName}>
                <h3>{post.title}</h3>
                <a href={PostUtil.buildLinkURLByTitle(post.title)}>{post.description}</a>
              </li>
            ))}
          </ul>
        </details>
      )}
    </>
  )
}

export default CategoryPostGroup
