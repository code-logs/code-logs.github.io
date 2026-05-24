import { Check, Link as LinkIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

// Copy-link button (issue #153): copies the current page URL to the clipboard
// and flips to a transient "Copied!" state for 1.5s. The label change is
// announced via aria-live for screen readers.
const ShareButtons = () => {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard API unavailable (insecure context / denied permission) — no-op.
    }
  }, [])

  return (
    <button
      type="button"
      onClick={onCopy}
      className="clickable inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-text-body hover:text-text-heading"
    >
      {copied ? <Check size={16} aria-hidden /> : <LinkIcon size={16} aria-hidden />}
      <span aria-live="polite">{copied ? 'Copied!' : 'Copy link'}</span>
    </button>
  )
}

export default ShareButtons
