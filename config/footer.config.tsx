import { Rss } from 'lucide-react'
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
  categoriesViewAllHref: string
}

const footerConfig: FooterConfig = {
  tagline: 'Notes on code and craft by Jay Lee.',
  exploreLinks: [
    { label: 'Home', href: '/' },
    { label: 'Posts', href: '/posts/1' },
    { label: 'Tags', href: '/tags' },
    { label: 'About', href: '/about' },
  ],
  // GitHub stays an inline SVG brand mark; RSS is a generic (non-brand) icon so
  // lucide-react's Rss is fine. The RSS link is a placeholder until the feed
  // (/rss.xml) ships in a follow-up issue.
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com/possible819', icon: <GithubIcon /> },
    { label: 'RSS', href: '/rss.xml', icon: <Rss strokeWidth={1.5} aria-hidden="true" /> },
  ],
  categoriesViewAllHref: '/categories',
}

export default footerConfig
