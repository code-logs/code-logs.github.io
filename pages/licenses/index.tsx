import GoogleAdsenseBanner from '../../components/google-adsense/GoogleAdsenseBanner'
import KakaoAdfitBanner from '../../components/kakao-adfit/KakaoAdfitBanner'
import MainAdsBanner from '../../components/ads-banner/MainAdsBanner'
import RaiseSection from '../../components/raise-section/RaiseSection'
import blogConfig from '../../config/blog.config'
import licenses from '../../public/licenses.json'

const Licenses = () => {
  return (
    <>
      <h1>Licenses</h1>
      <RaiseSection className="grid grid-cols-2 overflow-auto">
        {Object.keys(licenses).map((depName) => {
          return (
            <details
              className="text-text-muted [&_summary]:py-3 [&_summary]:px-0 [&_a]:text-link"
              key={depName}
            >
              <summary>{depName}</summary>
              <ul>
                <li>{(licenses as any)[depName].licenses}</li>
                {(licenses as any)[depName].repository && (
                  <li>
                    <a target="_blank" rel="noreferrer" href={(licenses as any)[depName].repository}>
                      Repository
                    </a>
                  </li>
                )}
              </ul>
            </details>
          )
        })}
      </RaiseSection>

      <MainAdsBanner />
    </>
  )
}

export default Licenses
