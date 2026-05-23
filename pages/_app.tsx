import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import AsideAdsBanner from '../components/ads-banner/AsideAdsBanner'
import ContentExplorer from '../components/content-explorer/ContentExplorer'
import Footer from '../components/footer/Footer'
import GTagScript from '../components/gtag-script/GTagScript'
import Header from '../components/header/Header'
import NaverAnalyticsScript from '../components/naver-analytics-script/NaverAnalyticsScript'
import SWScript from '../components/sw-script/SWScript'
import blogConfig from '../config/blog.config'
import menus from '../config/menu.config'
import socialIcons from '../config/social.config'
import useIsMobile from '../hooks/useIsMobile'
import { fontVariables } from '../styles/fonts'
import '../styles/globals.css'
import '../styles/highlight.css'

const MainApp = ({ Component, pageProps }: AppProps) => {
  const isMobile = useIsMobile(true)

  return (
    // ThemeProvider sits outside the `display: contents` wrapper: it renders no
    // DOM (Context only), so the `#__next` 3-column grid is unaffected. It sets
    // `.dark` on <html> (attribute="class") to drive the token flip in
    // globals.css; System mode resolves via prefers-color-scheme, and
    // disableTransitionOnChange suppresses the global transition flash on swap.
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {/* Font CSS variables are injected here, not in `_document.tsx`: next/font
          must be loaded from `_app`/pages, and the body className would otherwise
          need a wrapper. `display: contents` keeps header/main/aside/footer as
          direct grid items of `#__next` while still exposing the variables to them.
          `role="none"` neutralizes the box that `display: contents` drops from the
          a11y tree, so the landmark children below remain the only exposed regions. */}
      <div className={fontVariables} style={{ display: 'contents' }} role="none">
        <GTagScript gaID={blogConfig.googleAnalytics.id} />
        <NaverAnalyticsScript issuedId={blogConfig.naverAnalytics.id} />
        <SWScript />
        <Header title={blogConfig.title} socialIcons={socialIcons} menus={menus} />

        <main>
          <Component {...pageProps} />
        </main>

        <aside>
          {!isMobile && pageProps?.enableContentExplorer && <ContentExplorer />}
          {!isMobile && <AsideAdsBanner />}
        </aside>

        <Footer author={blogConfig.author} />
      </div>
    </ThemeProvider>
  )
}

export default MainApp
