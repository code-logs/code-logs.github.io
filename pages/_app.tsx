import type { AppProps } from 'next/app'
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
import '../styles/globals.css'
import '../styles/highlight.css'

const MainApp = ({ Component, pageProps }: AppProps) => {
  const isMobile = useIsMobile(true)

  return (
    <>
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
    </>
  )
}

export default MainApp
