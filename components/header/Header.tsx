import { ReactElement } from 'react'
import NavBar, { Menu } from '../nav-bar/NavBar'
import ThemeToggle from '../theme-toggle/ThemeToggle'

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
    <header className="header-grid pb-5 border-b border-divider bg-bg-page max-tablet:pb-0 max-tablet:[&>nav]:m-auto">
      <span className="[grid-area:title] font-bold text-3xl text-center m-auto text-text-heading max-tablet:text-2xl max-tablet:text-left max-tablet:my-auto max-tablet:mx-0 max-tablet:p-3">
        {title}
      </span>

      <ul className="[grid-area:socialIcons] p-5 flex gap-3 m-auto [&_li]:my-auto [&_svg]:w-6 [&_svg]:h-6 max-tablet:p-3">
        {socialIcons.map((socialIcon, idx) => (
          <li key={idx}>
            <a href={socialIcon.href} target="_blank" rel="noreferrer" aria-label={socialIcon.label}>
              {socialIcon.icon}
            </a>
          </li>
        ))}
        {/* Shares the social-icon slot so it stays visible on the tablet (≤800px)
            one-row layout. The ul's `[&_svg]:w-6 [&_svg]:h-6` sizes the toggle icon. */}
        <li>
          <ThemeToggle />
        </li>
      </ul>

      <NavBar menus={menus} />
    </header>
  )
}

export default Header
