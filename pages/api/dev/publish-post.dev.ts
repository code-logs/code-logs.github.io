import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { CATEGORIES } from '../../../config/posts.config'
import { appendPostConfig, getCategoryDir } from '../../../utils/dev/PostConfigWriter'
import { resolveThumbnail } from '../../../utils/dev/ThumbnailResolver'
import { GeneratedPost } from '../../../utils/dev/types'
import PostUtil from '../../../utils/PostUtil'

if (process.env.NODE_ENV === 'production') {
  console.warn('publish-post.dev.ts loaded in production — this should not happen')
}

type SuccessResponse = { url: string; message: string }
type ErrorResponse = { error: string }

// Increase body size limit for base64-encoded thumbnail uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

interface PublishRequestBody {
  post: GeneratedPost
  /** Base64-encoded image data (only when thumbnail.mode === 'generate') */
  thumbnailBase64?: string
  /** Original MIME type of uploaded image (e.g. 'image/png') */
  thumbnailMimeType?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { post, thumbnailBase64, thumbnailMimeType } = req.body as PublishRequestBody

  if (!post || !post.metadata || !post.markdown || !post.thumbnail) {
    return res.status(400).json({ error: 'Invalid request body: post, metadata, markdown, and thumbnail are required' })
  }

  const { metadata, markdown, thumbnail } = post

  // Validate category
  if (!(metadata.category in CATEGORIES)) {
    return res.status(400).json({ error: `Invalid category key: "${metadata.category}"` })
  }

  // Validate fileName format
  if (!metadata.fileName || !/^[a-z0-9-]+\.md$/.test(metadata.fileName)) {
    return res.status(400).json({ error: `Invalid fileName: "${metadata.fileName}"` })
  }

  const categoryDir = getCategoryDir(metadata.category)
  const markdownDir = path.join(process.cwd(), 'posts', categoryDir)
  const markdownPath = path.join(markdownDir, metadata.fileName)

  // Collision check: file must not exist on disk
  if (fs.existsSync(markdownPath)) {
    return res.status(409).json({
      error: `File already exists: posts/${categoryDir}/${metadata.fileName}. Choose a different fileName.`,
    })
  }

  // Resolve thumbnail
  let thumbnailName: string
  let resolvedThumbnailPath: string | undefined
  try {
    let uploadedImageBuffer: Buffer | undefined
    let targetFileName: string | undefined

    if (thumbnail.mode === 'generate') {
      if (!thumbnailBase64 || !thumbnailMimeType) {
        return res.status(400).json({
          error: 'thumbnail.mode is "generate" but no image was uploaded. Provide thumbnailBase64 and thumbnailMimeType.',
        })
      }
      uploadedImageBuffer = Buffer.from(thumbnailBase64, 'base64')
      const ext = mimeToExt(thumbnailMimeType)
      // Derive filename from post slug
      const slug = metadata.fileName.replace(/\.md$/, '')
      targetFileName = `${slug}.${ext}`
    }

    thumbnailName = resolveThumbnail(thumbnail, { uploadedImageBuffer, targetFileName })
    // Track the resolved thumbnail path only for generated thumbnails so we can
    // roll it back if a later step fails (reused thumbnails pre-existed and must
    // not be deleted on rollback).
    if (thumbnail.mode === 'generate') {
      resolvedThumbnailPath = path.join(process.cwd(), 'public', 'assets', 'images', thumbnailName)
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return res.status(400).json({ error: message })
  }

  // Write markdown file
  try {
    fs.mkdirSync(markdownDir, { recursive: true })
    fs.writeFileSync(markdownPath, markdown, 'utf8')
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return res.status(500).json({ error: `Failed to write markdown: ${message}` })
  }

  // Append to posts.config.ts
  try {
    appendPostConfig(metadata, thumbnailName)
  } catch (err) {
    // Roll back the markdown file we just wrote
    try { fs.unlinkSync(markdownPath) } catch { /* ignore */ }
    // Roll back the generated thumbnail (only if we created it — never delete reused ones)
    if (resolvedThumbnailPath) {
      try { fs.unlinkSync(resolvedThumbnailPath) } catch { /* ignore */ }
    }
    const message = err instanceof Error ? err.message : String(err)
    return res.status(500).json({ error: `Failed to update posts.config.ts: ${message}` })
  }

  const url = '/' + PostUtil.normalizeTitle(metadata.title)
  return res.status(200).json({
    url,
    message: `Post published! Visit ${url} in dev to preview.`,
  })
}

function mimeToExt(mime: string): string {
  const map: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
  }
  return map[mime] ?? 'png'
}
