import { ArrowLeft } from 'lucide-react'
import CommonMeta from '../components/common-meta/CommonMeta'
import blogConfig from '../config/blog.config'
import { META_CONTENTS } from '../config/meta-contents'
import TitleUtil from '../utils/TitleUtil'

// The page skeleton (issue #149) renders `<main className="flex-1">` in
// `_app.tsx`, so this root is a plain <div> (no nested <main>); `h-full` lets it
// fill that flex-1 main and `justify-center` centers the content vertically.
const NotFound = () => {
  return (
    <div className="container-reading h-full flex flex-col items-center justify-center text-center py-16 md:py-24">
      <CommonMeta
        title={TitleUtil.buildPageTitle(META_CONTENTS.NOT_FOUND.TITLE)}
        description={META_CONTENTS.NOT_FOUND.DESCRIPTION}
        url={blogConfig.baseURL}
        imageURL={'/icons/icon-512x512.png'}
        customMeta={<meta name="robots" content="noindex, follow" />}
      />

      <span
        aria-hidden
        className="block font-mono text-8xl md:text-9xl font-bold text-link tracking-tighter leading-none"
      >
        404
      </span>
      <h1 className="mt-6 text-3xl font-bold text-text-heading">{META_CONTENTS.NOT_FOUND.HEADING}</h1>
      <p className="mt-3 text-base text-text-muted leading-relaxed max-w-md mx-auto">
        {META_CONTENTS.NOT_FOUND.BODY}
      </p>

      <div className="mt-10 flex flex-wrap gap-3 justify-center">
        {/* Native <a> for full-reload nav, matching the site convention (see about/index.tsx). */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          className="inline-flex items-center gap-2 h-10 px-5 rounded-md bg-text-heading text-bg-page text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          홈으로
        </a>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/posts/1"
          className="inline-flex items-center h-10 px-5 rounded-md ring-1 ring-border text-sm font-medium text-text-body transition-colors hover:bg-bg-subtle hover:text-text-heading"
        >
          포스트 보기
        </a>
      </div>
    </div>
  )
}

export default NotFound
