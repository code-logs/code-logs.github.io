import { ENGLISH_LETTERS, KOREAN_GROUPS, OTHER_GROUP } from '../../utils/HangulUtil'

export interface AlphabetNavProps {
  // Letters that have at least one item; only these render as anchor links.
  activeLetters: Set<string>
  // Per-page <nav> label (e.g. "Tag index navigation").
  ariaLabel?: string
}

// Shared sticky alphabet index, used by /tags and /categories. Renders A–Z and
// the 14 Korean groups as two rows; active letters link to the matching
// `#letter` section, inactive letters are muted and non-interactive. Replaces
// the page-specific TagNavigator.
const AlphabetNav = ({ activeLetters, ariaLabel }: AlphabetNavProps) => {
  // OTHER_GROUP ('#') only appears as a row entry when something is actually
  // bucketed under it, so the matching `#` section is never orphaned from the
  // nav while the common case keeps the two fixed A–Z / Korean rows clean.
  const koreanRow = activeLetters.has(OTHER_GROUP)
    ? [...KOREAN_GROUPS, OTHER_GROUP]
    : KOREAN_GROUPS
  const rows = [ENGLISH_LETTERS, koreanRow]

  return (
    <nav
      aria-label={ariaLabel}
      className="sticky top-[var(--header-height)] z-[5] -mx-[var(--spacing-page-x)] lg:-mx-[var(--spacing-page-x-desktop)] border-b border-divider bg-bg-page/80 px-[var(--spacing-page-x)] lg:px-[var(--spacing-page-x-desktop)] py-3 backdrop-blur"
    >
      {rows.map((row, rowIdx) => (
        <ol
          key={rowIdx}
          className="m-0 flex flex-wrap gap-1 p-0 tablet:gap-2 [&:not(:first-child)]:mt-1"
        >
          {row.map((letter) => {
            const isActive = activeLetters.has(letter)
            return (
              <li key={letter} className="list-none">
                {isActive ? (
                  <a
                    href={`#${letter}`}
                    className="font-mono text-sm text-text-body transition-colors hover:text-accent"
                  >
                    {letter}
                  </a>
                ) : (
                  <span
                    aria-disabled="true"
                    tabIndex={-1}
                    className="pointer-events-none font-mono text-sm text-text-muted/40"
                  >
                    {letter}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      ))}
    </nav>
  )
}

export default AlphabetNav
