import blogConfig from '../../config/blog.config'
import GoogleAdsenseBanner from '../google-adsense/GoogleAdsenseBanner'

const MainAdsBanner = () => (
  <section className="py-5">
    <GoogleAdsenseBanner adClient={blogConfig.googleAdsense.adClient} adSlot={blogConfig.googleAdsense.mainBannerAdSlot} />
    {/* <KakaoAdfitBanner adfitUnitID={blogConfig.kakaoAdfitUnitIDs.mainBannerID} position="main" /> */}
  </section>
)

export default MainAdsBanner
