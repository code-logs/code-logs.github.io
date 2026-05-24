import { useTheme } from 'next-themes'
import { ReactElement, useEffect, useRef } from 'react'

type UtterancesIssueTerms = 'pathname' | 'url' | 'title' | 'og:title'

export interface UtterancesProps {
  repo: string
  issueTerm: UtterancesIssueTerms
  issueLabel?: string
}

// Utterances now follows the site's manual dark toggle (issue #153 + #148).
// The widget's theme is derived from next-themes' resolvedTheme rather than the
// OS `preferred-color-scheme`, and theme changes are pushed to the loaded
// iframe via the official `set-theme` postMessage API.
const UTTERANCES_ORIGIN = 'https://utteranc.es'

const toUtterancesTheme = (theme?: string) => (theme === 'dark' ? 'github-dark' : 'github-light')

const Utterances = (props: UtterancesProps): ReactElement => {
  const { repo, issueTerm, issueLabel } = props
  const { resolvedTheme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const createdRef = useRef(false)

  // Inject the widget once — but only after the resolved theme is known, so the
  // iframe loads with the correct theme instead of flashing the wrong one and
  // relying on a follow-up postMessage.
  useEffect(() => {
    if (createdRef.current || !containerRef.current || !resolvedTheme) return
    createdRef.current = true

    const script = document.createElement('script')
    script.src = `${UTTERANCES_ORIGIN}/client.js`
    script.crossOrigin = 'anonymous'
    script.async = true
    script.setAttribute('repo', repo)
    script.setAttribute('issue-term', issueTerm)
    script.setAttribute('theme', toUtterancesTheme(resolvedTheme))
    if (issueLabel) script.setAttribute('label', issueLabel)

    containerRef.current.append(script)
  }, [repo, issueTerm, issueLabel, resolvedTheme])

  // On toggle, post the new theme to the already-loaded iframe. Before the
  // iframe exists the query returns null and we skip — the initial theme was
  // already set on the script tag above.
  useEffect(() => {
    if (!resolvedTheme) return
    const iframe = containerRef.current?.querySelector<HTMLIFrameElement>('.utterances-frame')
    iframe?.contentWindow?.postMessage(
      { type: 'set-theme', theme: toUtterancesTheme(resolvedTheme) },
      UTTERANCES_ORIGIN
    )
  }, [resolvedTheme])

  return <div className="flex flex-col [&>div]:max-w-[inherit]" ref={containerRef}></div>
}

export default Utterances
