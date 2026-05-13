import { useEffect, useState } from 'react'

// Threshold derived from the desktop grid: main is fixed at 768px and aside
// holds a 200px-max ad container. Below ~1100px the aside cell collapses to a
// width where AdSense cannot render — treat that range as mobile so aside is
// hidden via `pages/_app.tsx`'s `!isMobile` gate.
const MOBILE_BREAKPOINT = 1100

const useIsMobile = (initIsMobile: boolean) => {
  const [isMobile, setIsMobile] = useState<boolean>(initIsMobile)

  useEffect(() => {
    setIsMobile(document.body.clientWidth <= MOBILE_BREAKPOINT)
  }, [])

  return isMobile
}

export default useIsMobile