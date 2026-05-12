export interface FooterProps {
  author: string
  message?: string
}

const Footer = (props: FooterProps) => {
  return (
    <footer className="border-t border-theme-light bg-theme-footer-bg">
      <p className="text-center text-theme font-thin">
        {props.message ? props.message : `ⓒ 2021. ${props.author}  all rights reserved.`}
      </p>
    </footer>
  )
}

export default Footer
