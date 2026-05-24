import type { ReactElement } from 'react'
import GithubIcon from '../components/icons/GithubIcon'

export interface FooterConfig {
  tagline: string
  exploreLinks: { label: string; href: string }[]
  socialLinks: {
    label: string // aria-label
    href: string
    icon: ReactElement
  }[]
  categoriesViewAllHref: string | null
}

const footerConfig: FooterConfig = {
  tagline: 'Notes on code and craft by Jay Lee.',
  exploreLinks: [
    { label: 'Home', href: '/' },
    { label: 'Posts', href: '/posts/1' },
    { label: 'Tags', href: '/tags' },
    { label: 'About', href: '/about' },
  ],
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com/possible819', icon: <GithubIcon /> },
  ],
  categoriesViewAllHref: null,
}

export default footerConfig
