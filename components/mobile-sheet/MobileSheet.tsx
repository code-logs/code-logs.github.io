import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
//
// Rendered via createPortal into document.body (issue #210): the header carries
// `backdrop-filter: blur(8px)`, which makes it a containing block for its
// `position: fixed` descendants — so an in-header sheet would clip its `fixed
// inset-0` overlay to the ~55px header box instead of the viewport. Portaling to
// body escapes that containing block while keeping the frosted header. The
// `sheetOpen` state stays in Header (only the render location moves) — see
// .claude/docs/header-interaction-gotchas.md.
const MobileSheet = ({ open, onClose, menus, socialIcons }: MobileSheetProps) => {
  const panelRef = useRef<HTMLDivElement>(null)
  // Portal target (document.body) only exists on the client. Under
  // `output: 'export'` the first render runs without a DOM, so gate the portal
  // behind a post-mount flag to avoid a hydration mismatch. The sheet is
  // interactive-only, so its absence from the initial static HTML is harmless.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // On open: lock body scroll, focus the first focusable (close button). On close
  // (cleanup): unlock and restore focus to the hamburger that opened it.
  // The panel only becomes `visibility:visible` on the open render, and a still-
  // `hidden` element rejects focus(), so defer the focus to the next frame. The
  // open-state `transition` (above) drops the `visibility` transition so `visible`
  // applies synchronously — one rAF is enough. Without this, focus never enters
  // the sheet and Escape never reaches the panel's onKeyDown.
  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    const raf = requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()
    })
    return () => {
      cancelAnimationFrame(raf)
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

  if (!mounted) return null

  return createPortal(
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
          // On open, transition transform only — `visibility` must flip to `visible`
          // synchronously so the panel is focusable on the very next frame (a
          // still-`hidden` element rejects focus()). On close, keep the `visibility`
          // transition so the panel stays visible for the full slide-out before hiding.
          transition: open
            ? 'transform var(--duration-slow) var(--ease-out)'
            : 'transform var(--duration-slow) var(--ease-out), visibility var(--duration-slow)',
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
    </div>,
    document.body,
  )
}

export default MobileSheet
