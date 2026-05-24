import fs from 'fs'
import path from 'path'
import { posts } from '../config/posts.config'
import PostUtil from '../utils/PostUtil'

// Build-time search manifest (issue #150). Emits a lightweight JSON of published
// posts that the Cmd+K palette lazy-loads on first open. Body text is excluded by
// design (size restraint) — the flat shape leaves room to add fields later without
// reshaping consumers. Unlike the sitemap generator, posts.config has no env
// dependency, so no dotenv bootstrap is needed here.
//
// Pipeline placement: this runs BEFORE `next build`, not after. The output lives in
// public/, and `next build` copies public/ into the static export — running it after
// build would leave the file out of ./docs entirely.

const OUTPUT_PATH = path.join(__dirname, '../public/search-index.json')

interface SearchIndexEntry {
  title: string
  slug: string
  category: string
  description: string
  tags: string[]
  publishedAt: string
}

const generateSearchIndex = () => {
  const publishedPosts = posts.filter((post) => post.published)

  // Mirror postsDatabase ordering: publishedAt desc, original-order tiebreak. Keeps
  // the manifest deterministic across builds (stable git diffs on the committed file).
  const ordered = publishedPosts
    .map((post, index) => ({ post, index }))
    .sort((a, b) => {
      const diff = new Date(b.post.publishedAt).getTime() - new Date(a.post.publishedAt).getTime()
      return diff !== 0 ? diff : a.index - b.index
    })
    .map(({ post }) => post)

  const entries: SearchIndexEntry[] = ordered.map((post) => ({
    title: post.title,
    slug: PostUtil.normalizeTitle(post.title),
    category: post.category,
    description: post.description,
    tags: post.tags,
    publishedAt: post.publishedAt,
  }))

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(entries), { encoding: 'utf8' })
  console.log(`search-index: wrote ${entries.length} entries to ${path.relative(process.cwd(), OUTPUT_PATH)}`)
}

generateSearchIndex()
