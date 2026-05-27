import { Menu as MenuIcon } from 'lucide-react'
import { ReactElement, useState } from 'react'
import MobileSheet from '../mobile-sheet/MobileSheet'
import NavBar, { Menu } from '../nav-bar/NavBar'
import SearchTrigger from '../search-trigger/SearchTrigger'
import ThemeToggle from '../theme-toggle/ThemeToggle'
import Logo from './Logo'

export interface SocialIcon {
  href: string
  icon: ReactElement
  label: string
}

export interface HeaderProps {
  menus: Menu[]
  socialIcons: SocialIcon[]
  // The search palette is mounted globally in _app (Cmd+K is a global shortcut),
  // so the header only triggers it.
  onOpenSearch: () => void
}

// Five-slot header (issue #150). Desktop (≥768): Logo · Nav (centered) · Search ·
// Theme · Social. Mobile (<768): Logo · Search(icon) · Theme · Hamburger, with the
// hamburger opening a right slide-in sheet for nav + social. Background/border are
// owned by the base `.site-header` rule (globals.css) — do NOT add an opaque bg here, it
// would defeat the backdrop blur. The mobile sheet state is local: the header owns
// the menus/socialIcons it needs, so there is nothing to lift.
const Header = ({ menus, socialIcons, onOpenSearch }: HeaderProps) => {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <header className="site-header flex items-center gap-2 md:gap-4">
      <Logo />

      {/* Desktop nav doubles as the flex spacer; on mobile a bare spacer pushes the
          action cluster to the right edge. */}
      <div className="hidden flex-1 md:block">
        <NavBar menus={menus} />
      </div>
      <div className="flex-1 md:hidden" />

      <div className="flex items-center gap-1 md:gap-3">
        <SearchTrigger onOpen={onOpenSearch} />
        <ThemeToggle />

        <ul className="hidden items-center gap-1 md:flex [&_svg]:h-5 [&_svg]:w-5">
          {socialIcons.map((socialIcon, idx) => (
            <li key={idx} className="flex">
              <a
                href={socialIcon.href}
                target="_blank"
                rel="noreferrer"
                aria-label={socialIcon.label}
                className="clickable rounded-md p-2 text-text-body hover:bg-bg-subtle hover:text-text-heading"
              >
                {socialIcon.icon}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-label="Open menu"
          aria-expanded={sheetOpen}
          className="flex rounded-md p-2 text-text-body hover:bg-bg-subtle hover:text-text-heading md:hidden"
        >
          <MenuIcon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <MobileSheet open={sheetOpen} onClose={() => setSheetOpen(false)} menus={menus} socialIcons={socialIcons} />
    </header>
  )
}

export default Header
