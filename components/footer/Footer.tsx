export interface FooterProps {
  author: string
  message?: string
}

// Static footer (issue #149): border-top, padding, and top margin live in the
// base `footer` rule (globals.css). Keep this element class-free of border/bg to
// avoid a doubled border / token drift.
const Footer = (props: FooterProps) => {
  return (
    <footer>
      <p className="text-center text-text-muted font-thin">
        {props.message ? props.message : `ⓒ 2021. ${props.author}  all rights reserved.`}
      </p>
    </footer>
  )
}

export default Footer
