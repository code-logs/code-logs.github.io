export interface TagNavigatorProps {
  indexGroups: string[][]
  activatedIndexes: string[]
}

const TagNavigator = (props: TagNavigatorProps) => {
  const indexesSet = new Set(props.activatedIndexes)
  return (
    <div className="p-wide [&>ol]:m-0 [&>ol]:p-0 [&>ol_li]:inline-block [&>ol_li]:m-narrow [&>ol_li]:p-0 [&>ol_a]:text-text-muted [&>ol_a]:font-extralight">
      {props.indexGroups.map((indexes, keyIdx) => {
        return (
          <ol key={keyIdx}>
            {indexes.map((index) => (
              <li key={index}>
                <a
                  href={`#${index}`}
                  className={indexesSet.has(index) ? '!text-text-heading !font-medium' : ''}
                >
                  {index}
                </a>
              </li>
            ))}
          </ol>
        )
      })}
    </div>
  )
}

export default TagNavigator
