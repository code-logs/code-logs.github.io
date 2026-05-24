import React from 'react'
import { Post } from '../../config/posts.config'
import MainAdsBanner from '../ads-banner/MainAdsBanner'
import PostCard, { PostCardProps } from '../post-card/PostCard'

export interface PostCardListProps {
  titleLevel?: PostCardProps['titleLevel']
  posts: Post[]
  adsBlockCycle?: number
}

const PostCardList = ({ titleLevel, posts, adsBlockCycle = 3 }: PostCardListProps) =>
  !!posts.length ? (
    <ul className="m-0 list-none space-y-4 p-0">
      {posts.map((post, idx) => (
        <React.Fragment key={post.title}>
          <li key={post.title}>
            <PostCard titleLevel={titleLevel} post={post} />
          </li>

          {adsBlockCycle !== 0 && (idx + 1) % adsBlockCycle === 0 && (
            <li key={`main-ads-${idx}`}>
              <MainAdsBanner />
            </li>
          )}
        </React.Fragment>
      ))}
    </ul>
  ) : (
    <></>
  )

export default PostCardList
