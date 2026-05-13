import { CATEGORIES } from '../../config/posts.config'

export interface GeneratedPostMetadata {
  title: string
  description: string
  /** Must be one of the keys in the CATEGORIES map (e.g. 'react', 'react-native') */
  category: keyof typeof CATEGORIES
  /** kebab-case filename ending with .md (e.g. 'use-action-state.md') */
  fileName: string
  /** ISO date string YYYY-MM-DD */
  publishedAt: string
  tags: string[]
  references?: { title: string; url: string }[]
}

export interface GeneratedPostThumbnail {
  mode: 'reuse' | 'generate'
  /** When mode === 'reuse': the existing filename in public/assets/images/ */
  reuseFileName?: string
  /** When mode === 'generate': a descriptive prompt for creating a thumbnail image */
  generatePrompt?: string
}

export interface GeneratedPost {
  metadata: GeneratedPostMetadata
  /** Full markdown body — no frontmatter; headings start at ## */
  markdown: string
  thumbnail: GeneratedPostThumbnail
}

/** JSON Schema for GeneratedPost — used with codex --output-schema */
export const GENERATED_POST_JSON_SCHEMA = {
  type: 'object',
  required: ['metadata', 'markdown', 'thumbnail'],
  additionalProperties: false,
  properties: {
    metadata: {
      type: 'object',
      required: ['title', 'description', 'category', 'fileName', 'publishedAt', 'tags'],
      additionalProperties: false,
      properties: {
        title: { type: 'string', minLength: 1 },
        description: { type: 'string', minLength: 1 },
        category: { type: 'string', enum: Object.keys(CATEGORIES) },
        fileName: { type: 'string', pattern: '^[a-z0-9-]+\\.md$' },
        publishedAt: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
        tags: { type: 'array', items: { type: 'string' }, minItems: 1 },
        references: {
          type: 'array',
          items: {
            type: 'object',
            required: ['title', 'url'],
            additionalProperties: false,
            properties: {
              title: { type: 'string' },
              url: { type: 'string' },
            },
          },
        },
      },
    },
    markdown: { type: 'string', minLength: 1 },
    thumbnail: {
      type: 'object',
      required: ['mode'],
      additionalProperties: false,
      properties: {
        mode: { type: 'string', enum: ['reuse', 'generate'] },
        reuseFileName: { type: 'string', pattern: '^[\\w.\\-]+$' },
        generatePrompt: { type: 'string' },
      },
    },
  },
}
