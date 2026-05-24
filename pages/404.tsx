import CommonMeta from '../components/common-meta/CommonMeta'
import MainAdsBanner from '../components/ads-banner/MainAdsBanner'
import blogConfig from '../config/blog.config'
import { META_CONTENTS } from '../config/meta-contents'
import TitleUtil from '../utils/TitleUtil'

const NotFound = () => {
  return (
    <div className="container-reading">
      <CommonMeta
        title={TitleUtil.buildPageTitle(META_CONTENTS.NOT_FOUND.TITLE)}
        description={META_CONTENTS.NOT_FOUND.DESCRIPTION}
        url={blogConfig.baseURL}
        imageURL={'/icons/icon-512x512.png'}
      />
      <section>
        <h1>Page Not Found</h1>
      </section>

      <MainAdsBanner />
    </div>
  )
}

export default NotFound
