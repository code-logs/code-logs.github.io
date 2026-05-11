import GoogleAdsenseBanner from '../../components/google-adsense/GoogleAdsenseBanner'
import KakaoAdfitBanner from '../../components/kakao-adfit/KakaoAdfitBanner'
import MainAdsBanner from '../../components/ads-banner/MainAdsBanner'
import RaiseSection from '../../components/raise-section/RaiseSection'
import blogConfig from '../../config/blog.config'
import licenses from '../../public/licenses.json'
import styles from './Licenses.module.scss'

const Licenses = () => {
  return (
    <>
      <h1>Licenses</h1>
      <RaiseSection className={styles.wrapper}>
        {Object.keys(licenses).map((depName) => {
          return (
            <details className={styles.licenseInfo} key={depName}>
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
