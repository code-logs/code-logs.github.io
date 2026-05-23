import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

// Single-button cycle: Light → Dark → System → Light. Showing the user's chosen
// theme (not resolvedTheme) keeps the System option visible in the rotation.
const ORDER = ['light', 'dark', 'system'] as const
type Mode = (typeof ORDER)[number]

const ICONS: Record<Mode, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
}

const LABELS: Record<Mode, string> = {
  light: '라이트',
  dark: '다크',
  system: '시스템',
}

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  // The server has no theme, so the first client render must match SSR markup.
  // Until mounted, render a same-size placeholder to avoid hydration mismatch
  // and layout shift. `w-6 h-6` matches the header's social icon footprint.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <span className="block w-6 h-6" aria-hidden="true" />
  }

  const current = (ORDER.includes(theme as Mode) ? theme : 'system') as Mode
  const Icon = ICONS[current]
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length]

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`테마 전환 (현재: ${LABELS[current]})`}
      className="cursor-pointer flex text-text-body hover:text-text-heading"
    >
      <Icon className="w-6 h-6" strokeWidth={1.5} aria-hidden="true" />
    </button>
  )
}

export default ThemeToggle
