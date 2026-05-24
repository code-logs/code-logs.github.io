import footerConfig from '../../config/footer.config'
import Logo from '../header/Logo'

// Brand column: the header wordmark (reused #150 Logo), a tagline, and a social
// row. Social markup mirrors the header's (clickable rounded-md p-2 + subtle
// hover) for visual consistency. Icon sizing rides on the row wrapper because
// lucide/SVG icons don't size via font-size (see icon-library-gotchas).
const FooterBrand = () => (
  <div className="flex flex-col items-start gap-4">
    <Logo />

    <p className="text-sm leading-relaxed text-text-muted">{footerConfig.tagline}</p>

    <ul className="flex items-center gap-1 [&_svg]:h-5 [&_svg]:w-5">
      {footerConfig.socialLinks.map((social, idx) => {
        const external = social.href.startsWith('http')
        return (
          <li key={idx} className="flex">
            <a
              href={social.href}
              aria-label={social.label}
              {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="clickable rounded-md p-2 text-text-body hover:bg-bg-subtle hover:text-text-heading"
            >
              {social.icon}
            </a>
          </li>
        )
      })}
    </ul>
  </div>
)

export default FooterBrand
