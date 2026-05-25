// Maps a Hangul syllable to one of 14 canonical initial-consonant groups so the
// /tags and /categories alphabet indexes bucket Korean labels correctly. The
// legacy char-code range comparison mis-filed ㅍ (파) under 하; this derives the
// real initial-jamo index from the Unicode syllable block instead.
const HANGUL_START = 0xac00
const HANGUL_END = 0xd7a3
const JUNGSUNG_COUNT = 21
const JONGSUNG_COUNT = 28

// 19 initial-jamo indices → 14 groups. Tense consonants (ㄲ/ㄸ/ㅃ/ㅆ/ㅉ) fold
// into their plain counterpart; ㅊ→차, ㅋ→카, ㅌ→타, ㅍ→파.
const INITIAL_JAMO_TO_GROUP: Record<number, string> = {
  0: '가',
  1: '가', // ㄱ ㄲ
  2: '나', // ㄴ
  3: '다',
  4: '다', // ㄷ ㄸ
  5: '라', // ㄹ
  6: '마', // ㅁ
  7: '바',
  8: '바', // ㅂ ㅃ
  9: '사',
  10: '사', // ㅅ ㅆ
  11: '아', // ㅇ
  12: '자',
  13: '자', // ㅈ ㅉ
  14: '차', // ㅊ
  15: '카', // ㅋ
  16: '타', // ㅌ
  17: '파', // ㅍ
  18: '하', // ㅎ
}

export const KOREAN_GROUPS = [
  '가',
  '나',
  '다',
  '라',
  '마',
  '바',
  '사',
  '아',
  '자',
  '차',
  '카',
  '타',
  '파',
  '하',
]

// Returns the Korean group label for the first character, or null when the
// character is not a complete Hangul syllable (callers fall back to A–Z / other
// bucketing for ASCII, jamo-only, or empty input).
export function getKoreanGroup(char: string): string | null {
  if (!char) return null
  const code = char.charCodeAt(0)
  if (Number.isNaN(code) || code < HANGUL_START || code > HANGUL_END) return null
  const initialIndex = Math.floor((code - HANGUL_START) / (JUNGSUNG_COUNT * JONGSUNG_COUNT))
  return INITIAL_JAMO_TO_GROUP[initialIndex] ?? null
}

// A–Z, the English half of the alphabet index. Paired with KOREAN_GROUPS to
// render the two-row AlphabetNav and to enumerate every possible bucket.
export const ENGLISH_LETTERS = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
)

// The bucket every other label falls into when it starts with neither an
// ASCII letter nor a Hangul syllable (digits, symbols). Kept out of the nav rows
// but used as a section heading when such labels exist.
export const OTHER_GROUP = '#'

// Maps a label to its alphabet-index bucket: an uppercase A–Z letter, a Korean
// group, or OTHER_GROUP. Shared by /tags and /categories so both pages bucket
// identically.
export function getIndexLetter(label: string): string {
  if (!label) return OTHER_GROUP
  const first = label.charAt(0)
  const upper = first.toUpperCase()
  if (upper >= 'A' && upper <= 'Z') return upper
  return getKoreanGroup(first) ?? OTHER_GROUP
}
