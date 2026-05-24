import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { useEffect, useState } from 'react'
import Footer from '../components/footer/Footer'
import GTagScript from '../components/gtag-script/GTagScript'
import Header from '../components/header/Header'
import NaverAnalyticsScript from '../components/naver-analytics-script/NaverAnalyticsScript'
import SearchPalette from '../components/search-palette/SearchPalette'
import SWScript from '../components/sw-script/SWScript'
import blogConfig from '../config/blog.config'
import menus from '../config/menu.config'
import socialIcons from '../config/social.config'
import { fontVariables } from '../styles/fonts'
import '../styles/globals.css'
import '../styles/highlight.css'

const MainApp = ({ Component, pageProps }: AppProps) => {
  // The search palette is global so Cmd/Ctrl+K works from any page. State lives
  // here (not in Header) because the shortcut is window-level and the palette is
  // mounted as a sibling of the page, not inside the header.
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        // Inside a text field, leave the OS/browser default (e.g. Safari's
        // address-bar focus) untouched.
        const tag = (e.target as HTMLElement)?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        e.preventDefault()
        setPaletteOpen((open) => !open)
      }
      if (e.key === 'Escape') setPaletteOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    // ThemeProvider renders no DOM (Context only) — it sets `.dark` on <html>
    // (attribute="class") to drive the token flip in globals.css. System mode
    // resolves via prefers-color-scheme; disableTransitionOnChange suppresses
    // the global transition flash on theme swap.
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {/* Page skeleton (issue #149): a real flex column replaces the legacy
          `#__next` grid. `min-h-dvh` + `flex-1` main keep the static footer at
          the viewport bottom on short pages. The font CSS variables ride on this
          container (next/font must load from `_app`/pages); a real flex box still
          propagates them to descendants. The app-global aside was removed here —
          aside content (ContentExplorer/ads) is recomposed per-page in follow-up
          issues (#153 / 2-2 / 2-3). */}
      <div className={`${fontVariables} min-h-dvh flex flex-col`}>
        <GTagScript gaID={blogConfig.googleAnalytics.id} />
        <NaverAnalyticsScript issuedId={blogConfig.naverAnalytics.id} />
        <SWScript />
        <Header socialIcons={socialIcons} menus={menus} onOpenSearch={() => setPaletteOpen(true)} />

        <main className="flex-1">
          <Component {...pageProps} />
        </main>

        <Footer />

        <SearchPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      </div>
    </ThemeProvider>
  )
}

export default MainApp
