import localFont from 'next/font/local'

// Self-hosted variable fonts (all OFL — see public/fonts/*-OFL.txt).
// English/display = Geist, Korean body = Pretendard, code = Geist Mono.
// `src` paths are resolved relative to this file by next/font/local.

// Geist (latin display + body). Regular axis preloaded to protect LCP;
// the rest stream in with `display: swap`.
export const geist = localFont({
  src: '../public/fonts/Geist-Variable.woff2',
  variable: '--font-geist',
  weight: '100 900',
  display: 'swap',
  preload: true,
})

// Pretendard (Korean body). Not preloaded — large CJK file, swap in.
// `45 920` is Pretendard Variable's declared weight axis range (not a typo).
export const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  weight: '45 920',
  display: 'swap',
  preload: false,
})

// Geist Mono (code). Not preloaded — only the post body / code blocks use it.
export const geistMono = localFont({
  src: '../public/fonts/GeistMono-Variable.woff2',
  variable: '--font-geist-mono',
  weight: '100 900',
  display: 'swap',
  preload: false,
})

// Single string applied to a top-level wrapper to expose every font variable.
export const fontVariables = `${geist.variable} ${pretendard.variable} ${geistMono.variable}`
