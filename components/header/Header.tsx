import { ReactElement } from 'react'
import NavBar, { Menu } from '../nav-bar/NavBar'
import styles from './Header.module.scss'

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
    <header className={styles.header}>
      <span className={styles.title}>{title}</span>

      <ul className={styles.socialIcons}>
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
