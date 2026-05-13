import { useEffect } from 'react'
import blogConfig from '../config/blog.config'

const useAdsense = (adClient: typeof blogConfig.googleAdsense.adClient) => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (document.head) {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`
      script.crossOrigin = 'anonymous'
      document.head.appendChild(script)
    }
  }, [adClient])
}

export default useAdsense
