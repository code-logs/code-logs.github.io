// SERVER-ONLY module. Never import from a client component.
if (typeof window !== 'undefined') {
  throw new Error('ThumbnailResolver must only be imported in server-side (Node.js) code.')
}

import fs from 'fs'
import path from 'path'
import { GeneratedPostThumbnail } from './types'

const IMAGES_DIR = path.join(process.cwd(), 'public', 'assets', 'images')

/**
 * Resolve the thumbnail for a post.
 *
 * - mode: 'reuse' — verifies reuseFileName exists in public/assets/images/.
 *   Returns the filename to store in `thumbnailName`.
 *
 * - mode: 'generate' — writes uploadedImageBuffer to public/assets/images/<targetFileName>.
 *   Returns targetFileName to store in `thumbnailName`.
 *   uploadedImageBuffer and targetFileName are required when mode === 'generate'.
 *
 * Throws a descriptive Error if preconditions are not met.
 */
export function resolveThumbnail(
  thumbnail: GeneratedPostThumbnail,
  opts?: {
    /** Required when thumbnail.mode === 'generate' */
    uploadedImageBuffer?: Buffer
    /** Required when thumbnail.mode === 'generate': desired filename (kebab slug + extension) */
    targetFileName?: string
  }
): string {
  if (thumbnail.mode === 'reuse') {
    const fileName = thumbnail.reuseFileName
    if (!fileName) {
      throw new Error('thumbnail.mode is "reuse" but reuseFileName is missing.')
    }
    const fullPath = path.join(IMAGES_DIR, fileName)
    // Containment check: ensure the resolved path stays inside IMAGES_DIR
    if (!path.resolve(fullPath).startsWith(path.resolve(IMAGES_DIR) + path.sep)) {
      throw new Error(`Invalid reuseFileName: "${fileName}" resolves outside the images directory.`)
    }
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Thumbnail file not found: public/assets/images/${fileName}`)
    }
    return fileName
  }

  // mode === 'generate'
  const { uploadedImageBuffer, targetFileName } = opts ?? {}
  if (!uploadedImageBuffer || !targetFileName) {
    throw new Error(
      'thumbnail.mode is "generate" but no image was uploaded. ' +
      'Please upload a thumbnail image in the authoring UI.'
    )
  }
  const dest = path.join(IMAGES_DIR, targetFileName)
  fs.writeFileSync(dest, uploadedImageBuffer)
  return targetFileName
}

/** List all filenames in public/assets/images/ */
export function listThumbnailFiles(): string[] {
  try {
    return fs.readdirSync(IMAGES_DIR)
  } catch {
    return []
  }
}
