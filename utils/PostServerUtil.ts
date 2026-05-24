// Server-only utilities (Node.js / getStaticProps context).
// NEVER import this file on the client or in components — it uses `fs` via
// MarkdownUtil.readFileSync and will break the client bundle if imported there.
import { Post } from '../config/posts.config'
import { MarkdownUtil } from './MarkdownUtil'
import PostUtil from './PostUtil'

// Reads the markdown source and estimates reading time.
// English words at 200 wpm, Korean characters at 500 chars/min.
// Returns Math.max(1, Math.ceil(...)) — minimum 1 minute.
export function calculateReadingTime(post: Post): number {
  const markdown = MarkdownUtil.readFileSync(PostUtil.getMarkdownFilePath(post))

  // Count Korean (Hangul syllable block) characters for the Korean reading rate.
  // 힣 = U+D7A3 is the last Hangul syllable (NOT 힝/U+D7BD).
  const koreanChars = (markdown.match(/[ㄱ-힣]/g) || []).length
  // Whitespace-delimited token count as a proxy for English words.
  const totalTokens = markdown.split(/\s+/).filter(Boolean).length
  // Subtract an approximation of Korean-character tokens so they are not
  // double-counted in the English word rate.
  const englishWords = Math.max(0, totalTokens - Math.ceil(koreanChars / 5))

  const minutes = englishWords / 200 + koreanChars / 500
  return Math.max(1, Math.ceil(minutes))
}
