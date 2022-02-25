import CommonMeta from '../../components/common-meta/CommonMeta'
import TitleUtil from '../../utils/TitleUtil'
import blogConfig from '../../config/blog.config'

const About = () => {
  return (
    <>
      <CommonMeta
        title={TitleUtil.buildPageTitle('About')}
        description={'Code Logs에 대하여'}
        url={`${blogConfig.baseURL}/about`}
        imageURL={'/icons/icon-512x512.png'}
      />
      <h1>About</h1>
    </>
  )
}

export default About
