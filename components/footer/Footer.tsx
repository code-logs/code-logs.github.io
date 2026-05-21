export interface FooterProps {
  author: string
  message?: string
}

const Footer = (props: FooterProps) => {
  return (
    <footer className="border-t border-divider bg-bg-page">
      <p className="text-center text-text-muted font-thin">
        {props.message ? props.message : `ⓒ 2021. ${props.author}  all rights reserved.`}
      </p>
    </footer>
  )
}

export default Footer
