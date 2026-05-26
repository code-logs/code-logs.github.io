import { NextPage } from 'next'
import AlphabetNav from '../../components/alphabet-nav/AlphabetNav'
import CategoriesGrid, { CategoryWithCount } from '../../components/categories-grid/CategoriesGrid'
import CommonMeta from '../../components/common-meta/CommonMeta'
import PageHeader from '../../components/page-header/PageHeader'
import blogConfig from '../../config/blog.config'
import { META_CONTENTS } from '../../config/meta-contents'
import { CATEGORIES } from '../../config/posts.config'
import postsDatabase from '../../database/post-database'
import { getIndexLetter } from '../../utils/HangulUtil'
import TitleUtil from '../../utils/TitleUtil'

interface CategoriesIndexProps {
  categoriesWithCount: CategoryWithCount[]
}

export async function getStaticProps() {
  const posts = postsDatabase.find()
  const categories = Array.from(new Set(posts.map((post) => post.category)))
  // Sorted by the category key (#155 decision). AlphabetNav/anchor letters are
  // derived from the display label (getIndexLetter(label)) — this relies on each
  // CATEGORIES key and its label sharing a first letter, which holds for the
  // current map. If a future label's first letter diverges from its key, switch
  // this sort to the label so anchors land on the first card of each letter.
  const categoriesWithCount: CategoryWithCount[] = categories
    .map((category) => ({
      category,
      count: postsDatabase.countByCategory(category),
      hasNew: postsDatabase.hasNewByCategory(category),
    }))
    .sort((a, b) => a.category.localeCompare(b.category))

  return { props: { categoriesWithCount } }
}

const CategoriesIndex: NextPage<CategoriesIndexProps> = ({ categoriesWithCount }) => {
  // Active letters derive from each category's display label so the nav matches
  // the card grid's alphabetical order (#155). The shared AlphabetNav links to
  // the per-letter anchor CategoriesGrid renders on the first matching card.
  const activeLetters = new Set(
    categoriesWithCount.map(({ category }) =>
      getIndexLetter((CATEGORIES as Record<string, string>)[category] ?? category)
    )
  )

  return (
    <div className="container-content py-12">
      <CommonMeta
        title={TitleUtil.buildPageTitle(META_CONTENTS.CATEGORIES_INDEX.TITLE)}
        description={META_CONTENTS.CATEGORIES_INDEX.DESCRIPTION}
        url={`${blogConfig.baseURL}/categories`}
        imageURL={'/icons/icon-512x512.png'}
        keywords={categoriesWithCount.map(({ category }) => category)}
      />

      <PageHeader
        title={META_CONTENTS.CATEGORIES_INDEX.TITLE}
        subtitle={`Browse posts by topic. ${categoriesWithCount.length} categories.`}
        breadcrumb={[{ label: 'Posts', href: '/posts/1' }, { label: META_CONTENTS.CATEGORIES_INDEX.TITLE }]}
      />

      <AlphabetNav activeLetters={activeLetters} ariaLabel="Category index navigation" />

      <div className="mt-8">
        <CategoriesGrid categoriesWithCount={categoriesWithCount} enableLetterAnchors />
      </div>
    </div>
  )
}

export default CategoriesIndex
