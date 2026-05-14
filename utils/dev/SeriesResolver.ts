// SERVER-ONLY module. Never import from a client component.
if (typeof window !== 'undefined') {
  throw new Error('SeriesResolver must only be imported in server-side (Node.js) code.')
}

import postsDatabase from '../../database/post-database'
import { GeneratedPostMetadata } from './types'

/**
 * Walk a new post's series chain in both directions (prev and next) and return
 * the thumbnail filenames of every existing series member.
 *
 * - The new post itself is not in postsDatabase yet, so no self-collision.
 * - Missing titles (typo / fabricated) are silently skipped.
 * - A visited set prevents infinite loops on malformed chains.
 */
export function collectSeriesThumbnails(metadata: GeneratedPostMetadata): string[] {
  if (!metadata.series) return []

  const visited = new Set<string>()
  const thumbnails: string[] = []

  walk(metadata.series.prevPostTitle, 'prev', visited, thumbnails)
  walk(metadata.series.nextPostTitle, 'next', visited, thumbnails)

  return thumbnails
}

function walk(
  title: string | undefined,
  direction: 'prev' | 'next',
  visited: Set<string>,
  out: string[]
): void {
  if (!title) return
  if (visited.has(title)) return
  visited.add(title)

  const post = postsDatabase.findByTitle(title)
  if (!post) return

  if (post.thumbnailName) out.push(post.thumbnailName)

  const nextTitle = direction === 'prev' ? post.series?.prevPostTitle : post.series?.nextPostTitle
  walk(nextTitle, direction, visited, out)
}
