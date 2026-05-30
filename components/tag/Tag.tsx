export interface TagProps {
  tag: string
  count?: number
}

const Tag = (props: TagProps) => (
  <a href={`/posts/1?query=${encodeURIComponent(props.tag)}`}>
    <span className="clickable inline-flex items-center justify-center p-2 bg-bg-subtle text-text-body ring-1 ring-border rounded-sm min-w-[40px] cursor-pointer break-words">
      <span>#{props.tag}</span>
      {props.count != null && (
        <span className="ml-1 text-text-muted text-xs tabular-nums leading-none">
          {props.count}
        </span>
      )}
    </span>
  </a>
)

export default Tag
