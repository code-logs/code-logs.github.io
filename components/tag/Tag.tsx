export interface TagProps {
  tag: string
  count?: number
}

const Tag = (props: TagProps) => (
  <a href={`/posts/1?query=${encodeURIComponent(props.tag)}`}>
    <span className="clickable block p-2 bg-bg-subtle text-text-body ring-1 ring-border rounded-sm min-w-[40px] text-center cursor-pointer break-words before:content-['#']">
      {props.tag}
      {props.count != null && (
        <span className="ml-1 text-text-muted text-xs tabular-nums">{props.count}</span>
      )}
    </span>
  </a>
)

export default Tag
