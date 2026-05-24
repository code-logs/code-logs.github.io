import SectionHeader from '../section-header/SectionHeader'
import Tags from '../tags/Tags'

export interface TagWithCount {
  tag: string
  count: number
}

export interface TagIndexerProps {
  tagsWithCount: TagWithCount[]
  limit?: number
}

const TagIndexer = (props: TagIndexerProps) => {
  const { tagsWithCount, limit = 12 } = props
  // Defensive copy: never mutate the props array in place.
  const sorted = [...tagsWithCount].sort((tagA, tagB) => tagB.count - tagA.count)

  return (
    <section>
      <SectionHeader title="Tags" viewAllHref="/tags" />

      <Tags tags={sorted.slice(0, limit)} />
    </section>
  )
}

export default TagIndexer
