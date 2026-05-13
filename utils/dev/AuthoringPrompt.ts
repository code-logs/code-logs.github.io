// SERVER-ONLY module. Never import from a client component.
if (typeof window !== 'undefined') {
  throw new Error('AuthoringPrompt must only be imported in server-side (Node.js) code.')
}

import fs from 'fs'
import os from 'os'
import path from 'path'
import { GENERATED_POST_JSON_SCHEMA } from './types'

export interface AuthoringPromptOptions {
  userInstruction?: string
  today: string               // YYYY-MM-DD — server's local date
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
 *
 * The prompt references workspace paths instead of embedding data dumps so the
 * model reads live state (categories, catalog, thumbnails) on each run. Codex
 * runs with `--sandbox workspace-write` and has read access to the project root.
 */
export function buildAuthoringPrompt(opts: AuthoringPromptOptions): string {
  const { userInstruction = '', today } = opts

  return `You are a senior technical writer for a Korean developer blog (code-logs).
Your task: produce exactly ONE complete blog post in JSON that strictly conforms to the provided JSON Schema.

=== WORKSPACE LAYOUT (read these files directly to stay current) ===
- 카테고리 정의 및 발행 카탈로그: \`config/posts.config.ts\`
  · \`CATEGORIES\` 객체: 카테고리 key → display 매핑. JSON 응답의 \`category\` 필드에는 **key**를 사용한다.
  · \`posts\` 배열: 발행된 Post 메타데이터. 중복 주제 회피와 references 작성에 활용한다.
- 마크다운 본문 위치: \`posts/<category-key>/<fileName>.md\`
- 썸네일 디렉토리: \`public/assets/images/\` (디렉토리를 직접 살펴 재사용할 파일을 고른다)

=== WORKFLOW ===
1. \`config/posts.config.ts\`를 읽어 사용 가능한 카테고리 key, 기존 fileName, 기존 제목/태그를 파악한다.
2. \`public/assets/images/\`를 살펴 주제에 어울리는 썸네일 파일이 있는지 확인한다.
3. 아래 USER INSTRUCTION을 충족하는 새 포스트를 작성한다.

=== Post METADATA 포맷 (자세한 타입은 \`config/posts.config.ts\`의 \`Post\` 참고) ===
- title: 한국어 제목 (필수)
- description: 1-2문장 요약 (필수)
- category: \`CATEGORIES\` 객체의 **key** 중 하나 (필수)
- fileName: kebab-case, \`.md\`로 끝나는 파일명 (예: "use-action-state.md") — 기존과 중복 금지
- publishedAt: YYYY-MM-DD 형식
- tags: 문자열 배열 (최소 1개)
- references: \`[{ title, url }]\` 배열 (선택)

=== STYLE RULES ===
1. Language: Korean prose (technical terms may remain in English).
2. Format: Markdown only — NO frontmatter (no ---/--- block).
3. Heading hierarchy: start at ## (the blog renders the title as <h1>).
4. Code blocks: use fenced \`\`\`lang syntax compatible with Highlight.js.
5. Emoji: allowed sparingly where natural.
6. Length: thorough — a real blog post, not a stub.

=== fileName RULES ===
- kebab-case, ends with .md (e.g. "use-action-state.md").
- 공백/대문자 금지.
- \`config/posts.config.ts\`의 기존 fileName과 중복되지 않아야 한다.

=== publishedAt ===
Use today's date: ${today}

=== THUMBNAIL RULES ===
- 우선 \`public/assets/images/\`에서 주제에 가장 잘 맞는 기존 파일을 골라 mode="reuse", reuseFileName=<파일명>으로 설정한다.
- 적합한 파일이 없을 때만 mode="generate"로 두고, 이미지 생성용 prompt를 generatePrompt에 작성한다.

=== USER INSTRUCTION ===
${userInstruction || '(여기에 작성 지시를 입력하세요)'}

Respond with ONLY valid JSON matching the schema — no markdown fences, no prose outside the JSON.`
}
