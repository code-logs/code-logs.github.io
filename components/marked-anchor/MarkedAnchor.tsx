// Nav link with the bottom 2px accent indicator (issue #150). Styling and the
// scaleX indicator live in the `.nav-link` rule (globals.css); the active page
// is expressed via `aria-current="page"` (which the CSS keys the indicator off
// of), replacing the prior border-toggle classes.
export interface MarkedAnchorProps {
  display: string
  href: string
  matched: boolean
}

const MarkedAnchor = (props: MarkedAnchorProps) => (
  <a href={props.href} className="nav-link" aria-current={props.matched ? 'page' : undefined}>
    {props.display}
  </a>
)

export default MarkedAnchor
