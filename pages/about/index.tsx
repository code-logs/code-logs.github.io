import CommonMeta from '../../components/common-meta/CommonMeta'
import blogConfig from '../../config/blog.config'
import footerConfig from '../../config/footer.config'
import { META_CONTENTS } from '../../config/meta-contents'
import { CATEGORIES } from '../../config/posts.config'
import TitleUtil from '../../utils/TitleUtil'
import type { GetStaticProps } from 'next'

const CAREER_START_YEAR = 2015
const STACK = ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Web Component']
const INTERESTS = ['DX', '웹 표준', 'Web Component', 'AI']

interface CategoryChip {
  label: string
  href: string
}

interface AboutProps {
  careerYears: number
  categoryChips: CategoryChip[]
}

// Shared chip classes. Static chips (Stack/Interests) and linked Topics chips
// share the same surface (bg-bg-subtle + ring) as the #144 <Tag> for visual
// consistency; only the linked variant adds hover + `#` prefix.
const chipBase = 'inline-flex px-3 py-1.5 rounded-sm bg-bg-subtle text-text-body text-sm ring-1 ring-border'
const subLabel = 'mt-8 mb-0 text-base font-semibold text-text-heading'

const About = ({ careerYears, categoryChips }: AboutProps) => {
  return (
    <div className="container-reading py-16">
      <CommonMeta
        title={TitleUtil.buildPageTitle(META_CONTENTS.ABOUT.TITLE)}
        description={META_CONTENTS.ABOUT.DESCRIPTION}
        url={`${blogConfig.baseURL}/about`}
        imageURL={'/icons/icon-512x512.png'}
      />

      <article className="prose-about">
        <header className="pb-12">
          <h1 className="text-4xl max-tablet:text-3xl font-bold tracking-tight text-text-heading">
            About
          </h1>
          <p className="mt-2 text-base text-text-muted">
            Frontend Engineer · {CAREER_START_YEAR}~ ({careerYears} years)
          </p>
        </header>

        <section>
          <h2>Here is...</h2>
          <p>이곳은 웹개발과 관련된 정보를 기록하고 공유하는 개인공간 입니다.</p>
          <p>올바른 정보를 공유하는 것을 목적으로 하지만 경우에 따라 유언비어(?)를 노출 할 수 있습니다.</p>
          <p>잘못된 정보의 공유나 바르지 않은 개인의견에 대한 피드백은 주시면 감사히 수용합니다.</p>
          <p>
            <strong>정보 공유를 통해 저와 참여자 분들의 긍정적인 발전을 기원합니다.</strong>
          </p>
        </section>

        <section className="section-divider">
          <h2>About me</h2>
          <p>
            <strong>Frontend Engineer</strong>입니다.
          </p>
          <p>
            {CAREER_START_YEAR}년부터 웹을 만들어 왔으며, 현재 {careerYears}년차입니다.
          </p>

          <h3 className={subLabel}>What I work with</h3>
          <ul className="mt-4 flex flex-wrap gap-2 list-none p-0">
            {STACK.map((item) => (
              <li key={item}>
                <span className={chipBase}>{item}</span>
              </li>
            ))}
          </ul>

          <h3 className={subLabel}>Currently interested in</h3>
          <ul className="mt-4 flex flex-wrap gap-2 list-none p-0">
            {INTERESTS.map((item) => (
              <li key={item}>
                <span className={chipBase}>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="section-divider">
          <h2>About this blog</h2>
          <p>학습한 내용을 기록하고 공유하기 위해 운영합니다.</p>

          <h3 className={subLabel}>Topics covered</h3>
          <ul className="mt-4 flex flex-wrap gap-2 list-none p-0">
            {categoryChips.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className={`${chipBase} transition-colors hover:bg-bg-page hover:text-text-heading before:content-['#'] before:text-text-muted before:mr-0.5`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="section-divider">
          <h2>Get in touch</h2>
          <div className="mt-4 flex flex-wrap gap-3 [&_svg]:h-4 [&_svg]:w-4">
            {footerConfig.socialLinks.map((social) => {
              const external = social.href.startsWith('http')
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md ring-1 ring-border text-sm text-text-body transition-colors hover:bg-bg-subtle hover:text-text-heading"
                >
                  {social.icon}
                  {social.label}
                </a>
              )
            })}
          </div>
        </section>

        <section className="section-divider">
          <h2>Licenses</h2>
          <p>
            {/* Native <a> for full-reload nav, matching the site convention (see Logo). */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/licenses">View third-party licenses →</a>
          </p>
        </section>
      </article>
    </div>
  )
}

export const getStaticProps: GetStaticProps<AboutProps> = async () => {
  // Posts store the hyphenated CATEGORIES *key* in `post.category`, and that key
  // is the URL slug (see pages/categories/[category]/[page].tsx getStaticPaths).
  // The href must use the key, while the visible label uses the display value —
  // matching every other category-display surface (PostCardGrid, CategoriesGrid).
  const categoryChips: CategoryChip[] = (Object.entries(CATEGORIES) as [string, string][])
    .sort(([, a], [, b]) => a.localeCompare(b))
    .map(([key, label]) => ({
      label,
      href: `/categories/${encodeURIComponent(key)}/1`,
    }))

  return {
    props: {
      careerYears: new Date().getFullYear() - CAREER_START_YEAR,
      categoryChips,
    },
  }
}

export default About
