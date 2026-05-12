import { TagWithCount } from '../tag-indexer/TagIndexer'
import Tags from '../tags/Tags'

export type TagsByIndexes = { [tag: string]: TagWithCount[] }

export interface TagListProps {
  indexGroups: string[][]
  tagsByIndexes: TagsByIndexes
}

const TagList = (props: TagListProps) => {
  return (
    <ol className="m-0 p-0 [&_ol]:m-0 [&_ol]:p-0 [&_h2]:text-[1.5rem] [&_h2]:pb-narrow [&_h2]:border-b [&_h2]:border-theme-invisible">
      {props.indexGroups.map((indexGroup, idx) => (
        <ol key={idx}>
          {indexGroup
            .filter((index) => props.tagsByIndexes[index].length)
            .map((index, idx) => (
              <li key={idx}>
                <h2 id={index}>{index}</h2>
                <Tags tags={props.tagsByIndexes[index]} />
              </li>
            ))}
        </ol>
      ))}
    </ol>
  )
}

export default TagList
