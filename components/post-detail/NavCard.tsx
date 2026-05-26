import { ArrowLeft, ArrowRight } from 'lucide-react'

export interface NavCardProps {
  direction: 'prev' | 'next'
  label: string
  title: string
  description?: string
  href: string
}

// Shared prev/next card (issue #153) used by both SeriesNav and PrevNextNav.
// The arrow glyph is decorative (aria-hidden); the card's accessible name is
// carried by its label + title text.
const NavCard = ({ direction, label, title, description, href }: NavCardProps) => {
  const isPrev = direction === 'prev'

  return (
    <a
      href={href}
      className={`card-hover group flex flex-col gap-1 rounded-lg ring-1 ring-border p-4 no-underline ${
        isPrev ? 'items-start text-left' : 'items-end text-right'
      }`}
    >
      <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-text-muted">
        {isPrev && <ArrowLeft size={14} aria-hidden />}
        {label}
        {!isPrev && <ArrowRight size={14} aria-hidden />}
      </span>
      <span className="font-medium text-text-heading group-hover:text-link line-clamp-2">
        {title}
      </span>
      {description && (
        <span className="text-sm text-text-muted line-clamp-1">{description}</span>
      )}
    </a>
  )
}

export default NavCard
