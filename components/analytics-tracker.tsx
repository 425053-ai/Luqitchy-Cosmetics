"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackEvent } from '@/lib/analytics-client'

export function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    trackEvent('visit', { path: pathname })
  }, [pathname])

  return null
}
