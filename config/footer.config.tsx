import type { ReactElement } from 'react'
import GithubIcon from '../components/icons/GithubIcon'

// Shared tagline constant — single source of truth for Hero + Footer.
// Import this wherever the tagline copy is needed instead of duplicating it.
export const SITE_TAGLINE = 'Notes on code and craft by Jay Lee.'

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
  tagline: SITE_TAGLINE,
  exploreLinks: [
    { label: 'Home', href: '/' },
    { label: 'Posts', href: '/posts/1' },
    { label: 'Tags', href: '/tags' },
    { label: 'About', href: '/about' },
  ],
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com/possible819', icon: <GithubIcon /> },
  ],
  categoriesViewAllHref: '/categories',
}

export default footerConfig
