export interface MarkedAnchorProps {
  display: string
  href: string
  matched: boolean
}

const MarkedAnchor = (props: MarkedAnchorProps) => (
  <a
    href={props.href}
    className={`active:border-b-2 active:border-solid ${props.matched ? 'border-b-2 border-solid' : ''}`}
  >
    {props.display}
  </a>
)

export default MarkedAnchor
