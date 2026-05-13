// SERVER-ONLY module. Never import from a client component.
if (typeof window !== 'undefined') {
  throw new Error('PostConfigWriter must only be imported in server-side (Node.js) code.')
}

import fs from 'fs'
import path from 'path'
import { CATEGORIES } from '../../config/posts.config'
import { GeneratedPostMetadata } from './types'

const CONFIG_PATH = path.join(process.cwd(), 'config', 'posts.config.ts')

/** Expected suffix of posts.config.ts after the closing ] of the posts array */
const EXPECTED_TAIL = ']\n\nexport default posts\n'

/**
 * Append a new Post entry to config/posts.config.ts.
 *
 * Strategy: locate the closing `]` of the `posts` array (the last `]` before
 * `\n\nexport default posts\n`) and splice in the serialized entry.
 *
 * Throws if:
 * - The file does not end with the expected pattern (file has been edited).
 * - category is not a valid CATEGORIES key.
 * - fileName already exists in the file (duplicate guard).
 */
export function appendPostConfig(metadata: GeneratedPostMetadata, thumbnailName: string): void {
  // Sanity check: category key must exist in CATEGORIES
  if (!(metadata.category in CATEGORIES)) {
    throw new Error(
      `Unknown category key: "${metadata.category}". ` +
      `Valid keys: ${Object.keys(CATEGORIES).join(', ')}`
    )
  }

  const raw = fs.readFileSync(CONFIG_PATH, 'utf8')

  // Guard: file must end exactly as expected
  if (!raw.endsWith(EXPECTED_TAIL)) {
    throw new Error(
      `posts.config.ts does not end with the expected pattern (\`${EXPECTED_TAIL.trim()}\`). ` +
      'Refusing to mutate the file automatically. Append the entry manually.'
    )
  }

  // Guard: fileName must not already exist
  if (raw.includes(`fileName: '${metadata.fileName}'`) || raw.includes(`fileName: "${metadata.fileName}"`)) {
    throw new Error(`fileName "${metadata.fileName}" already exists in posts.config.ts.`)
  }

  // Build the new entry string — mirrors the style of the last entries in the file:
  // backtick strings for title/description/publishedAt, single-quoted for fileName/thumbnailName
  const entry = serializeEntry(metadata, thumbnailName)

  // Insert before the closing `]` (which is at index: raw.length - EXPECTED_TAIL.length).
  // Append the comma to the prior entry's closing brace line (i.e. replace the trailing
  // newline before `]` with `,\n`) so the separator reads `},\n  {` not `}\n,\n  {`.
  const insertAt = raw.length - EXPECTED_TAIL.length
  const before = raw.slice(0, insertAt) // ends with "  }\n"
  const updated = before.replace(/\n$/, ',\n') + entry + '\n' + raw.slice(insertAt)

  fs.writeFileSync(CONFIG_PATH, updated, 'utf8')
}

function serializeEntry(meta: GeneratedPostMetadata, thumbnailName: string): string {
  const indent = '  '
  const tagItems = meta.tags.map(toTemplateLiteral).join(', ')

  let block = `${indent}{\n`
  block += `${indent}  title: ${toTemplateLiteral(meta.title)},\n`
  block += `${indent}  description: ${toTemplateLiteral(meta.description)},\n`
  block += `${indent}  fileName: '${meta.fileName}',\n`
  block += `${indent}  category: '${meta.category}',\n`
  block += `${indent}  published: true,\n`
  block += `${indent}  publishedAt: ${toTemplateLiteral(meta.publishedAt)},\n`
  block += `${indent}  thumbnailName: ${toTemplateLiteral(thumbnailName)},\n`
  block += `${indent}  tags: [${tagItems}],\n`

  if (meta.references && meta.references.length > 0) {
    block += `${indent}  references: [\n`
    for (const ref of meta.references) {
      block += `${indent}    {\n`
      block += `${indent}      title: ${toTemplateLiteral(ref.title)},\n`
      block += `${indent}      url: ${toTemplateLiteral(ref.url)},\n`
      block += `${indent}    },\n`
    }
    block += `${indent}  ],\n`
  }

  block += `${indent}}`
  return block
}

/** Serialize a string as a TypeScript template literal. */
function toTemplateLiteral(s: string): string {
  return `\`${s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\``
}

/**
 * Get the directory name for a category key.
 *
 * The CATEGORIES map key IS the directory name (e.g. 'react-native' → posts/react-native/).
 * The value is the display string ('react native'). Do not confuse them.
 */
export function getCategoryDir(categoryKey: keyof typeof CATEGORIES): string {
  if (!(categoryKey in CATEGORIES)) {
    throw new Error(`Unknown category key: "${categoryKey}"`)
  }
  // The key is the directory name — no transformation needed.
  return categoryKey
}
