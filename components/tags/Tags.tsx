import Tag from '../tag/Tag'
import { TagWithCount } from '../tag-indexer/TagIndexer'

export interface TagsProps {
  tags: (string | TagWithCount)[]
}

const Tags = (props: TagsProps) => {
  return (
    <ul className="list-none m-0 p-0 [&>li]:inline-block [&>li]:mt-0 [&>li]:mr-[5px] [&>li]:mb-[5px] [&>li]:ml-0">
      {props.tags.map((tag, idx) => (
        <li key={idx}>
          {typeof tag === 'string' ? (
            <Tag tag={tag} />
          ) : (
            <Tag tag={tag.tag} count={tag.count} />
          )}
        </li>
      ))}
    </ul>
  )
}

export default Tags
