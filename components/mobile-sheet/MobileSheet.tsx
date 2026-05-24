import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { SocialIcon } from '../header/Header'
import type { Menu } from '../nav-bar/NavBar'

export interface MobileSheetProps {
  open: boolean
  onClose: () => void
  menus: Menu[]
  socialIcons: SocialIcon[]
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Right slide-in sheet for mobile nav (issue #150). Search is intentionally NOT
// here — the header's 🔍 icon opens the same palette on mobile too. Always
// mounted so the transform can transition both ways; `visibility` flips it out of
// the tab/a11y tree when closed (the visibility transition stays `visible` for
// the full slide-out, then hides — keeping the exit animation intact).
const MobileSheet = ({ open, onClose, menus, socialIcons }: MobileSheetProps) => {
  const panelRef = useRef<HTMLDivElement>(null)

  // On open: lock body scroll, focus the first focusable (close button). On close
  // (cleanup): unlock and restore focus to the hamburger that opened it.
  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)
    first?.focus()
    return () => {
      document.body.style.overflow = ''
      previouslyFocused?.focus?.()
    }
  }, [open])

  // Self-contained focus trap (zero deps): Esc closes; Tab/Shift+Tab cycle within
  // the panel's focusables.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
      return
    }
    if (e.key !== 'Tab') return

    const focusables = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)
    if (!focusables || focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <div className={`fixed inset-0 z-50 md:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ transition: 'opacity var(--duration-slow) var(--ease-out)' }}
        className={`absolute inset-0 bg-bg-page/60 backdrop-blur-sm ${open ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        onKeyDown={onKeyDown}
        style={{
          width: 'min(80vw, 320px)',
          transition: 'transform var(--duration-slow) var(--ease-out), visibility var(--duration-slow)',
        }}
        className={`absolute right-0 top-0 flex h-full flex-col gap-2 border-l border-border bg-bg-page p-5
          ${open ? 'visible translate-x-0' : 'invisible translate-x-full'}`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="self-end rounded-md p-2 text-text-body hover:bg-bg-subtle hover:text-text-heading"
        >
          <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
        </button>

        <nav>
          <ul className="flex flex-col gap-1">
            {menus.map(({ display, route }, idx) => (
              <li key={idx}>
                <a href={route} className="block rounded-md px-3 py-2 text-text-body hover:bg-bg-subtle hover:text-text-heading">
                  {display}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <hr className="my-2 border-divider" />

        <ul className="flex items-center gap-1 [&_svg]:h-5 [&_svg]:w-5">
          {socialIcons.map((socialIcon, idx) => (
            <li key={idx} className="flex">
              <a
                href={socialIcon.href}
                target="_blank"
                rel="noreferrer"
                aria-label={socialIcon.label}
                className="rounded-md p-2 text-text-body hover:bg-bg-subtle hover:text-text-heading"
              >
                {socialIcon.icon}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default MobileSheet
