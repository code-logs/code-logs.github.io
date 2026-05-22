export interface TagProps {
  tag: string
  count?: number
}

const Tag = (props: TagProps) => (
  <a href={`/posts/1?query=${encodeURIComponent(props.tag)}`}>
    <span className="clickable block p-2 bg-bg-subtle text-text-body ring-1 ring-border rounded-sm min-w-[40px] text-center cursor-pointer before:content-['#']">
      {props.tag} {props.count && props.count}
    </span>
  </a>
)

export default Tag
