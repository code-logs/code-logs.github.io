// SERVER-ONLY module. Never import from a client component.
if (typeof window !== 'undefined') {
  throw new Error('ImageGenerator must only be imported in server-side (Node.js) code.')
}

import fs from 'fs'
import os from 'os'
import path from 'path'
import { runCodex } from './CodexClient'

const IMAGES_DIR = path.join(process.cwd(), 'public', 'assets', 'images')

const IMAGE_GENERATION_RESULT_SCHEMA = {
  type: 'object',
  required: ['savedFileName'],
  additionalProperties: false,
  properties: {
    savedFileName: { type: 'string', pattern: '^[\\w.\\-]+\\.(png|jpg|jpeg|webp)$' },
  },
}

export interface GenerateThumbnailOptions {
  /** Post slug without `.md` extension — drives the deterministic output filename. */
  postFileNameWithoutExt: string
  /** Codex's earlier free-form image description. */
  generatePrompt: string
  /** Existing series thumbnails (filenames only, no directory prefix). */
  seriesThumbnailFileNames: string[]
}

export interface GenerateThumbnailResult {
  savedFileName: string
}

/**
 * Invoke Codex's $imagegen skill to produce a 1024×1024 PNG thumbnail.
 *
 * The output filename is deterministic (`<slug>.png`) so the caller controls
 * the destination and the path-traversal containment is enforced before AND
 * after the Codex call.
 */
export async function generateThumbnail(opts: GenerateThumbnailOptions): Promise<GenerateThumbnailResult> {
  const { postFileNameWithoutExt, generatePrompt, seriesThumbnailFileNames } = opts

  if (!generatePrompt || !generatePrompt.trim()) {
    throw new Error('generatePrompt is empty — cannot run $imagegen without a description.')
  }

  const savedFileName = `${postFileNameWithoutExt}.png`
  const destPath = path.join(IMAGES_DIR, savedFileName)

  if (!path.resolve(destPath).startsWith(path.resolve(IMAGES_DIR) + path.sep)) {
    throw new Error(`Invalid output filename: "${savedFileName}" resolves outside the images directory.`)
  }
  if (fs.existsSync(destPath)) {
    throw new Error(`Output file already exists: public/assets/images/${savedFileName}`)
  }

  const schemaPath = writeSchemaFile()

  const seriesBlock = seriesThumbnailFileNames.length === 0
    ? '없음 (단독 포스트)'
    : seriesThumbnailFileNames.map((f) => `  - public/assets/images/${f}`).join('\n')

  const prompt = `\$imagegen

목표: 새로운 블로그 포스트 썸네일 이미지를 1024×1024 PNG로 생성한다.

저장 위치: 정확히 \`public/assets/images/${savedFileName}\` (다른 파일명/경로 금지).
- 워크스페이스 쓰기 권한이 있으므로 위 경로에 직접 파일을 작성하라.

=== IMAGE DESCRIPTION ===
${generatePrompt.trim()}

=== SERIES VISUAL CONSISTENCY (필수) ===
아래 기존 시리즈 썸네일이 있을 경우, 그 이미지들을 참고해 색감·구도·타이포·일러스트 톤을 일치시킬 것. 새 이미지가 같은 시리즈의 일원으로 보여야 한다.

${seriesBlock}

작업이 끝나면 다음 형식의 JSON만 응답하라:
{ "savedFileName": "${savedFileName}" }

다른 텍스트는 포함하지 마라.`

  const rawOutput = await runCodex({ prompt, schemaPath, timeoutMs: 600_000 })

  let parsed: GenerateThumbnailResult
  try {
    parsed = JSON.parse(rawOutput) as GenerateThumbnailResult
  } catch {
    throw new Error(`$imagegen returned invalid JSON: ${rawOutput.slice(0, 300)}`)
  }

  if (parsed.savedFileName !== savedFileName) {
    throw new Error(`$imagegen savedFileName mismatch: expected "${savedFileName}", got "${parsed.savedFileName}"`)
  }

  if (!fs.existsSync(destPath)) {
    throw new Error(`$imagegen reported success but file is missing at public/assets/images/${savedFileName}`)
  }
  const stat = fs.statSync(destPath)
  if (stat.size === 0) {
    try { fs.unlinkSync(destPath) } catch { /* ignore */ }
    throw new Error(`$imagegen produced a 0-byte file at public/assets/images/${savedFileName}`)
  }

  return { savedFileName }
}

function writeSchemaFile(): string {
  const schemaFilePath = path.join(os.tmpdir(), 'codex-image-result-schema.json')
  fs.writeFileSync(schemaFilePath, JSON.stringify(IMAGE_GENERATION_RESULT_SCHEMA, null, 2), 'utf8')
  return schemaFilePath
}
