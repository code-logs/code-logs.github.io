import { ReactElement, useEffect, useRef } from 'react'
import styles from './Utterrances.module.scss'

type UtterancesIssueTerms = 'pathname' | 'url' | 'title' | 'og:title'

type UtterancesThemes =
  | 'github-light'
  | 'github-dark'
  | 'preferred-color-scheme'
  | 'github-dark-orange'
  | 'icy-dark'
  | 'dark-blue'
  | 'photon-dark'
  | 'boxy-light'

export interface UtterancesProps {
  repo: string
  issueTerm: UtterancesIssueTerms
  theme: UtterancesThemes
  issueLabel?: string
}

const Utterances = (props: UtterancesProps): ReactElement => {
  const repo: string = props.repo
  const issueTerm: UtterancesIssueTerms = props.issueTerm
  const theme: UtterancesThemes = props.theme
  const issueLabel: string | undefined = props.issueLabel

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const utterrances = document.createElement('script')
    utterrances.src = 'https://utteranc.es/client.js'
    utterrances.crossOrigin = 'anonymous'
    utterrances.async = true
    utterrances.setAttribute('repo', repo)
    utterrances.setAttribute('issue-term', issueTerm)
    utterrances.setAttribute('theme', theme)
    if (issueLabel) utterrances.setAttribute('label', issueLabel)

    containerRef.current.append(utterrances)
  }, [issueLabel, issueTerm, repo, theme])

  return <div className={styles.utteranceContainer} ref={containerRef}></div>
}

export default Utterances
