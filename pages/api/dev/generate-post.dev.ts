import type { NextApiRequest, NextApiResponse } from 'next'
import postsDatabase from '../../../database/post-database'
import { buildAuthoringPrompt, getSchemaFilePath } from '../../../utils/dev/AuthoringPrompt'
import { runCodex } from '../../../utils/dev/CodexClient'
import { listThumbnailFiles } from '../../../utils/dev/ThumbnailResolver'
import { CATEGORIES } from '../../../config/posts.config'
import { GeneratedPost } from '../../../utils/dev/types'

// Belt-and-suspenders: also blocked at pageExtensions layer in production
if (process.env.NODE_ENV === 'production') {
  console.warn('generate-post.dev.ts loaded in production — this should not happen')
}

type SuccessResponse = { post: GeneratedPost }
type ErrorResponse = { error: string; detail?: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  // Production guard
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { userInstruction } = req.body as { userInstruction?: string }
  if (!userInstruction || typeof userInstruction !== 'string' || !userInstruction.trim()) {
    return res.status(400).json({ error: 'userInstruction is required' })
  }

  // Compute today in local time (YYYY-MM-DD)
  const today = new Date().toLocaleDateString('sv-SE') // 'sv-SE' gives YYYY-MM-DD in local TZ

  const publishedPosts = postsDatabase.find()
  const thumbnailFileNames = listThumbnailFiles()
  const schemaPath = getSchemaFilePath()

  const prompt = buildAuthoringPrompt({
    userInstruction: userInstruction.trim(),
    today,
    publishedPosts,
    thumbnailFileNames,
  })

  let rawOutput: string
  try {
    rawOutput = await runCodex({ prompt, schemaPath, timeoutMs: 300_000 })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return res.status(500).json({
      error: 'codex execution failed',
      detail: message,
    })
  }

  // Parse and validate the JSON output
  let post: GeneratedPost
  try {
    post = JSON.parse(rawOutput) as GeneratedPost
  } catch {
    return res.status(500).json({
      error: 'codex returned invalid JSON',
      detail: rawOutput.slice(0, 500),
    })
  }

  // Defense-in-depth validation
  const validationError = validateGeneratedPost(post)
  if (validationError) {
    return res.status(500).json({ error: validationError, detail: rawOutput.slice(0, 500) })
  }

  return res.status(200).json({ post })
}

function validateGeneratedPost(post: GeneratedPost): string | null {
  if (!post || typeof post !== 'object') return 'Response is not an object'

  const { metadata, markdown, thumbnail } = post

  if (!metadata) return 'Missing metadata'
  if (!markdown || typeof markdown !== 'string') return 'Missing or invalid markdown'
  if (!thumbnail) return 'Missing thumbnail'

  if (!(metadata.category in CATEGORIES)) {
    return `Invalid category key: "${metadata.category}"`
  }
  if (!metadata.fileName || !/^[a-z0-9-]+\.md$/.test(metadata.fileName)) {
    return `Invalid fileName: "${metadata.fileName}" (must be kebab-case ending in .md)`
  }
  if (!metadata.publishedAt || !/^\d{4}-\d{2}-\d{2}$/.test(metadata.publishedAt)) {
    return `Invalid publishedAt: "${metadata.publishedAt}" (must be YYYY-MM-DD)`
  }
  if (!Array.isArray(metadata.tags) || metadata.tags.length === 0) {
    return 'tags must be a non-empty array'
  }
  if (!thumbnail.mode || !['reuse', 'generate'].includes(thumbnail.mode)) {
    return 'thumbnail.mode must be "reuse" or "generate"'
  }
  if (thumbnail.mode === 'reuse' && !thumbnail.reuseFileName) {
    return 'thumbnail.mode is "reuse" but reuseFileName is missing'
  }

  return null
}
