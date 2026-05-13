// SERVER-ONLY module. Never import from a client component.
if (typeof window !== 'undefined') {
  throw new Error('AuthoringPrompt must only be imported in server-side (Node.js) code.')
}

import fs from 'fs'
import os from 'os'
import path from 'path'
import { CATEGORIES, Post } from '../../config/posts.config'
import { GENERATED_POST_JSON_SCHEMA } from './types'

export interface AuthoringPromptOptions {
  userInstruction: string
  today: string               // YYYY-MM-DD — server's local date
  publishedPosts: Post[]      // from postsDatabase
  thumbnailFileNames: string[] // files in public/assets/images/
}

/**
 * Write the JSON Schema to a temp file and return its path.
 * Rewritten on every call so HMR-updated schema content always wins over any
 * stale file left from a prior dev-server run.
 */
export function getSchemaFilePath(): string {
  const schemaFilePath = path.join(os.tmpdir(), 'codex-post-schema.json')
  fs.writeFileSync(schemaFilePath, JSON.stringify(GENERATED_POST_JSON_SCHEMA, null, 2), 'utf8')
  return schemaFilePath
}

/**
 * Build the full prompt string to pass to codex via stdin.
 */
export function buildAuthoringPrompt(opts: AuthoringPromptOptions): string {
  const { userInstruction, today, publishedPosts, thumbnailFileNames } = opts

  const categoriesBlock = Object.entries(CATEGORIES)
    .map(([key, value]) => `  - key: "${key}"  display: "${value}"`)
    .join('\n')

  const catalogBlock = publishedPosts
    .map((p) => `  - title: "${p.title}" | category: "${p.category}" | tags: ${p.tags.join(', ')}`)
    .join('\n')

  const thumbnailsBlock = thumbnailFileNames.map((f) => `  - ${f}`).join('\n')

  return `You are a senior technical writer for a Korean developer blog (code-logs).
Your task: produce exactly ONE complete blog post in JSON that strictly conforms to the provided JSON Schema.

=== CATEGORIES (use the "key" field for the "category" property) ===
${categoriesBlock}

=== PUBLISHED POST CATALOG (use for references and to avoid duplicate topics) ===
${catalogBlock}

=== EXISTING THUMBNAIL FILES (prefer reuse; list exact filename when reusing) ===
${thumbnailsBlock}

=== STYLE RULES ===
1. Language: Korean prose (technical terms may remain in English).
2. Format: Markdown only — NO frontmatter (no ---/--- block).
3. Heading hierarchy: start at ## (the blog renders the title as <h1>).
4. Code blocks: use fenced \`\`\`lang syntax compatible with Highlight.js.
5. Emoji: allowed sparingly where natural.
6. Length: thorough — a real blog post, not a stub.

=== fileName RULES ===
- kebab-case, ends with .md (e.g. "use-action-state.md").
- Must NOT match any existing fileName in the catalog above.
- Must NOT contain spaces or uppercase.

=== publishedAt ===
Use today's date: ${today}

=== THUMBNAIL RULES ===
- Prefer "reuse": pick the most thematically fitting file from the EXISTING THUMBNAIL FILES list and set mode="reuse", reuseFileName=<that filename>.
- If absolutely nothing fits, set mode="generate" and provide a concise image-generation prompt in generatePrompt.

=== USER INSTRUCTION ===
${userInstruction}

Respond with ONLY valid JSON matching the schema — no markdown fences, no prose outside the JSON.`
}
