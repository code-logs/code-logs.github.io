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
  // Single-row layout fitted to the 64px slim header (issue #149): title left,
  // nav centered (flex-1), social + theme toggle right. Background/border live
  // in the base `header` rule (globals.css) so the backdrop-blur shows through —
  // do NOT add an opaque bg here. Logo/search/mobile-sheet slots come in #150.
  return (
    <header className="flex items-center gap-4 max-tablet:gap-2">
      <span className="shrink-0 font-bold text-xl text-text-heading whitespace-nowrap max-tablet:text-lg">
        {title}
      </span>

      <NavBar menus={menus} />

      <ul className="shrink-0 flex items-center gap-3 [&_li]:flex [&_svg]:w-5 [&_svg]:h-5">
        {socialIcons.map((socialIcon, idx) => (
          <li key={idx}>
            <a href={socialIcon.href} target="_blank" rel="noreferrer" aria-label={socialIcon.label}>
              {socialIcon.icon}
            </a>
          </li>
        ))}
        {/* Shares the social-icon slot so the toggle stays inline; the ul's
            `[&_svg]:w-5 [&_svg]:h-5` sizes the toggle icon to match. */}
        <li>
          <ThemeToggle />
        </li>
      </ul>
    </header>
  )
}

export default Header
