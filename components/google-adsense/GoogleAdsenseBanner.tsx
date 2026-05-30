import { useEffect, useRef } from 'react'

export interface GoogleAdsenseBannerProps {
  adClient: string
  adSlot: string
}

declare global {
  interface Window {
    adsbygoogle: { [key: string]: any }
  }
}

// AdSense throws `TagError: No slot size for availableWidth=...` when the slot
// is narrower than ~125px, which surfaces as a Next.js client-side exception
// fallback. Skip push() entirely when the slot is too narrow.
const MIN_SLOT_WIDTH = 125

// adsbygoogle also throws an *asynchronous* `TagError: All 'ins' elements ...
// already have ads in them` when a client-side re-render remounts in-list ad
// slots — the /posts search filter swaps the post list (and the MainAdsBanner
// units interleaved in it), so adsbygoogle reprocesses already-filled slots.
// The throw originates inside adsbygoogle's own deferred task (no React/our
// frames on the stack), so a try/catch around push() cannot catch it. Suppress
// just this error class at the window level so it can't escalate into a fatal
// Next.js client-side exception fallback (#231). Installed once per session.
let tagErrorSuppressed = false
const suppressAdsenseTagError = () => {
  if (tagErrorSuppressed || typeof window === 'undefined') return
  tagErrorSuppressed = true
  window.addEventListener('error', (event) => {
    // Match only the duplicate-push variant, NOT the narrow-slot
    // `No slot size for availableWidth` TagError — that one stays observable so
    // the MIN_SLOT_WIDTH guard's failures aren't masked.
    if (event.error?.name === 'TagError' && /already have ads/.test(event.error?.message ?? '')) {
      event.preventDefault()
    }
  })
}

const GoogleAdsenseBanner = (props: GoogleAdsenseBannerProps) => {
  const insRef = useRef<HTMLModElement>(null)

  useEffect(() => {
    suppressAdsenseTagError()
    const ins = insRef.current
    if (!ins || ins.offsetWidth < MIN_SLOT_WIDTH) return
    window.adsbygoogle = window.adsbygoogle || []
    window.adsbygoogle.push({})
  }, [])

  return (
    <ins
      ref={insRef}
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={props.adClient}
      data-ad-slot={props.adSlot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  )
}

export default GoogleAdsenseBanner
