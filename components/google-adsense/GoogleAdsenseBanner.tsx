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

const GoogleAdsenseBanner = (props: GoogleAdsenseBannerProps) => {
  const insRef = useRef<HTMLModElement>(null)

  useEffect(() => {
    if (!insRef.current || insRef.current.offsetWidth < MIN_SLOT_WIDTH) return
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
