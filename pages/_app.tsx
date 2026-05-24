import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import Footer from '../components/footer/Footer'
import GTagScript from '../components/gtag-script/GTagScript'
import Header from '../components/header/Header'
import NaverAnalyticsScript from '../components/naver-analytics-script/NaverAnalyticsScript'
import SWScript from '../components/sw-script/SWScript'
import blogConfig from '../config/blog.config'
import menus from '../config/menu.config'
import socialIcons from '../config/social.config'
import { fontVariables } from '../styles/fonts'
import '../styles/globals.css'
import '../styles/highlight.css'

const MainApp = ({ Component, pageProps }: AppProps) => {
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
        <Header title={blogConfig.title} socialIcons={socialIcons} menus={menus} />

        <main className="flex-1">
          <Component {...pageProps} />
        </main>

        <Footer author={blogConfig.author} />
      </div>
    </ThemeProvider>
  )
}

export default MainApp
