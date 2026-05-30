import Database from '.'
import PostUtil from '../utils/PostUtil'
import posts, { Post } from '../config/posts.config'

class PostDatabase extends Database<Post & { order: number }> {
  constructor() {
    super(posts.filter((post) => post.published).map((post, index) => ({ ...post, order: index })))
    this.sort((postA, postB) => {
      if (postA.publishedAt > postB.publishedAt) return -1
      if (postA.publishedAt < postB.publishedAt) return 1
      return postB.order - postA.order
    })
  }

  findByTitle(title: string) {
    return this.dataset.find((post) => PostUtil.normalizeTitle(post.title) === title || post.title === title)
  }

  hasNewByCategory(category: string) {
    return Boolean(
      this.dataset
        .filter((post) => post.category === category)
        .find((post) => {
          const publishedDate = new Date(post.publishedAt)
          return publishedDate.setDate(publishedDate.getDate() + 7) >= Date.now()
        })
    )
  }

  count() {
    return this.dataset.length
  }

  countByCategory(category: string) {
    return this.dataset.filter((post) => post.category === category).length
  }

  countByTag(tag: string) {
    return this.dataset.filter((post) => post.tags.includes(tag)).length
  }

  query(condition: string, limit?: number, skip: number = 0) {
    // Case-insensitive full-string substring match (mirrors SearchPalette's
    // scoreEntry). The query is matched as a whole phrase against each field and
    // each individual tag — NOT split on whitespace. Splitting OR-matched every
    // word against the joined tag string, so a multi-word tag like "web
    // component" returned posts merely mentioning "component", and an
    // upper-case tag like "Figma MCP" matched nothing because only the query
    // was lower-cased. Both broke tag-badge navigation (issue #231).
    const normalized = condition.trim().toLowerCase()

    const foundPosts = this.dataset.filter((post) => {
      return (
        post.title.toLowerCase().includes(normalized) ||
        post.description.toLowerCase().includes(normalized) ||
        post.category.toLowerCase().includes(normalized) ||
        post.tags.some((tag) => tag.toLowerCase().includes(normalized))
      )
    })

    if (limit !== undefined) return foundPosts.slice(skip, skip + limit)
    return foundPosts
  }

  findByCategory(category: string, limit?: number, skip: number = 0) {
    const foundPosts = this.dataset.filter((post) => post.category === category)

    if (limit !== undefined) return foundPosts.slice(skip, skip + limit)
    return foundPosts
  }

  findByNormalizedTitle(normalizedTitle: string) {
    return this.dataset.find((post) => {
      return PostUtil.normalizeTitle(post.title) === normalizedTitle
    })
  }

  // Chronological neighbors over the full published set (issue #153). The
  // dataset is sorted publishedAt desc (index 0 = newest), so the older
  // ("previous") post sits at the next index and the newer ("next") post at
  // the prior index. Returns undefined at the chronological boundaries.
  findPrevious(post: Post) {
    const index = this.dataset.findIndex((p) => p.title === post.title)
    if (index < 0) return undefined
    return this.dataset[index + 1]
  }

  findNext(post: Post) {
    const index = this.dataset.findIndex((p) => p.title === post.title)
    if (index <= 0) return undefined
    return this.dataset[index - 1]
  }
}

const postsDatabase = new PostDatabase()

export default postsDatabase
