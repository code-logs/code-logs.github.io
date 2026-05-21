import { ReactElement } from 'react'
import NavBar, { Menu } from '../nav-bar/NavBar'

export interface SocialIcon {
  href: string
  icon: ReactElement
  label: string
}

export interface HeaderProps {
  title: string
  menus: Menu[]
  socialIcons: SocialIcon[]
}

const Header = ({ title, menus, socialIcons }: HeaderProps) => {
  return (
    <header className="header-grid pb-wide border-b border-divider bg-bg-page max-tablet:pb-0 max-tablet:[&>nav]:m-auto">
      <span className="[grid-area:title] font-bold text-[2rem] text-center m-auto text-text-heading max-tablet:text-[1.5rem] max-tablet:text-left max-tablet:my-auto max-tablet:mx-0 max-tablet:p-common">
        {title}
      </span>

      <ul className="[grid-area:socialIcons] p-wide flex gap-common m-auto [&_li]:my-auto [&_svg]:w-6 [&_svg]:h-6 max-tablet:p-common">
        {socialIcons.map((socialIcon, idx) => (
          <li key={idx}>
            <a href={socialIcon.href} target="_blank" rel="noreferrer" aria-label={socialIcon.label}>
              {socialIcon.icon}
            </a>
          </li>
        ))}
      </ul>

      <NavBar menus={menus} />
    </header>
  )
}

export default Header
