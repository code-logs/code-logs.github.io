import blogConfig from '../../config/blog.config'
import GoogleAdsenseBanner from '../google-adsense/GoogleAdsenseBanner'

const AsideAdsBanner = () => (
  <section className="flex flex-col p-wide gap-wide max-w-[200px] mx-auto">
    <GoogleAdsenseBanner adClient={blogConfig.googleAdsense.adClient} adSlot={blogConfig.googleAdsense.asideBannerAdSlot} />
    <GoogleAdsenseBanner adClient={blogConfig.googleAdsense.adClient} adSlot={blogConfig.googleAdsense.asideBannerAdSlot} />
    <GoogleAdsenseBanner adClient={blogConfig.googleAdsense.adClient} adSlot={blogConfig.googleAdsense.asideBannerAdSlot} />
    <GoogleAdsenseBanner adClient={blogConfig.googleAdsense.adClient} adSlot={blogConfig.googleAdsense.asideBannerAdSlot} />
    {/* <KakaoAdfitBanner adfitUnitID={blogConfig.kakaoAdfitUnitIDs.asideBannerID1} position="aside" />
    <KakaoAdfitBanner adfitUnitID={blogConfig.kakaoAdfitUnitIDs.asideBannerID2} position="aside" /> */}
  </section>
)

export default AsideAdsBanner
