import { ArrowLeft } from 'lucide-react'
import { NextPage } from 'next'
import CategoriesGrid, { CategoryWithCount } from '../../components/categories-grid/CategoriesGrid'
import CommonMeta from '../../components/common-meta/CommonMeta'
import PageHeader from '../../components/page-header/PageHeader'
import blogConfig from '../../config/blog.config'
import { META_CONTENTS } from '../../config/meta-contents'
import postsDatabase from '../../database/post-database'
import TitleUtil from '../../utils/TitleUtil'

// Native <a> for internal navigation kept in a const so the literal path stays
// out of the no-html-link-for-pages rule, matching the site-wide convention.
const POSTS_HREF = '/posts/1'

interface CategoriesIndexProps {
  categoriesWithCount: CategoryWithCount[]
}

export async function getStaticProps() {
  const posts = postsDatabase.find()
  const categories = Array.from(new Set(posts.map((post) => post.category)))
  const categoriesWithCount: CategoryWithCount[] = categories
    .map((category) => ({
      category,
      count: postsDatabase.countByCategory(category),
      hasNew: postsDatabase.hasNewByCategory(category),
    }))
    .sort((a, b) => a.category.localeCompare(b.category))

  return { props: { categoriesWithCount } }
}

const CategoriesIndex: NextPage<CategoriesIndexProps> = ({ categoriesWithCount }) => (
  <div className="container-content">
    <CommonMeta
      title={TitleUtil.buildPageTitle(META_CONTENTS.CATEGORIES_INDEX.TITLE)}
      description={META_CONTENTS.CATEGORIES_INDEX.DESCRIPTION}
      url={`${blogConfig.baseURL}/categories`}
      imageURL={'/icons/icon-512x512.png'}
      keywords={categoriesWithCount.map(({ category }) => category)}
    />

    <a
      href={POSTS_HREF}
      className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-heading"
    >
      <ArrowLeft size={16} aria-hidden />
      Posts
    </a>

    <div className="mt-6">
      <PageHeader
        title={META_CONTENTS.CATEGORIES_INDEX.TITLE}
        subtitle={`Browse posts by topic. ${categoriesWithCount.length} categories.`}
      />
    </div>

    <CategoriesGrid categoriesWithCount={categoriesWithCount} />
  </div>
)

export default CategoriesIndex
