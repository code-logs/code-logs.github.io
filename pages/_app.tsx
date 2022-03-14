import type { AppProps } from 'next/app'
import 'normalize.css'
import Footer from '../components/footer/Footer'
import GTagScript from '../components/gtag-script/GTagScript'
import Header from '../components/header/Header'
import SWScript from '../components/sw-script/SWScript'
import blogConfig from '../config/blog.config'
import gaConfig from '../config/ga.config'
import menus from '../config/menu.config'
import socialIcons from '../config/social.config'
import '../styles/globals.scss'
import '../styles/highlight.scss'

const MainApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <GTagScript gaID={gaConfig.id} />
      <SWScript />
      <Header title={blogConfig.title} socialIcons={socialIcons} menus={menus} />

      <main>
        <Component {...pageProps} />
      </main>

      <aside></aside>

      <Footer author={blogConfig.author} />
    </>
  )
}

export default MainApp
