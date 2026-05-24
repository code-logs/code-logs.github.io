import MainAdsBanner from '../../components/ads-banner/MainAdsBanner'
import CommonMeta from '../../components/common-meta/CommonMeta'
import RaiseSection from '../../components/raise-section/RaiseSection'
import blogConfig from '../../config/blog.config'
import { META_CONTENTS } from '../../config/meta-contents'
import { CATEGORIES } from '../../config/posts.config'
import TitleUtil from '../../utils/TitleUtil'
import type { GetStaticProps } from 'next'

const standardTimeout = 300
const ratio = 1.5

const CAREER_START_YEAR = 2015
const STACK = ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Web Component']
const INTERESTS = ['DX', '웹 표준', 'Web Component', 'AI']
const TOPICS = Object.values(CATEGORIES).join(', ')

interface AboutProps {
  careerYears: number
}

const About = ({ careerYears }: AboutProps) => {
  return (
    <div className="container-reading">
      <CommonMeta
        title={TitleUtil.buildPageTitle(META_CONTENTS.ABOUT.TITLE)}
        description={META_CONTENTS.ABOUT.DESCRIPTION}
        url={`${blogConfig.baseURL}/about`}
        imageURL={'/icons/icon-512x512.png'}
      />

      <article className="[&_section]:mb-8 [&_p]:ml-5 [&_p]:text-text-body [&_p]:italic">
        <h1>About</h1>

        <RaiseSection timeout={standardTimeout}>
          <h2>Here is...</h2>
          <p>이곳은 웹개발과 관련된 정보를 기록하고 공유하는 개인공간 입니다.</p>
          <p>올바른 정보를 공유하는 것을 목적으로 하지만 경우에 따라 유언비어(?)를 노출 할 수 있습니다.</p>
          <p>잘못된 정보의 공유나 바르지 않은 개인의견에 대한 피드백은 주시면 감사히 수용합니다.</p>
          <br />
          <p>
            <strong>정보 공유를 통해 저와 참여자 분들의 긍정적인 발전을 기원합니다.</strong>
          </p>
        </RaiseSection>

        <RaiseSection timeout={standardTimeout * ratio}>
          <h2>About me</h2>
          <p>
            <strong>Frontend Engineer</strong>입니다.
          </p>
          <p>
            {CAREER_START_YEAR}년부터 웹을 만들어 왔으며, 현재 {careerYears}년차입니다.
          </p>
          <p>주력 스택은 {STACK.join(', ')}입니다.</p>
          <p>주된 관심사는 {INTERESTS.join(', ')}입니다.</p>
        </RaiseSection>

        <RaiseSection timeout={standardTimeout * ratio * 2}>
          <h2>About this blog</h2>
          <p>학습한 내용을 기록하고 공유하기 위해 운영합니다.</p>
          <p>주로 다루는 주제는 {TOPICS}입니다.</p>
        </RaiseSection>

        <RaiseSection timeout={standardTimeout * ratio * 3}>
          <h2>Licenses</h2>
          <p>
            <a href="licenses">Link to license info</a>
          </p>
        </RaiseSection>
      </article>

      <MainAdsBanner />
    </div>
  )
}

export const getStaticProps: GetStaticProps<AboutProps> = async () => {
  return {
    props: {
      careerYears: new Date().getFullYear() - CAREER_START_YEAR,
    },
  }
}

export default About
