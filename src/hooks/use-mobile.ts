'use client'

import * as React from 'react'

/**
 * Small utility hook used by shadcn/ui components.
 * Returns true when the viewport is below the provided breakpoint.
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Guard for SSR / non-browser environments
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return

    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)

    const onChange = () => setIsMobile(mql.matches)
    onChange()

    // Safari < 14
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    }

    mql.addListener(onChange)
    return () => mql.removeListener(onChange)
  }, [breakpoint])

  return isMobile
}
