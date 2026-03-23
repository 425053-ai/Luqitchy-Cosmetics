"use client"

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackEvent, getSessionDuration } from '@/lib/analytics-client'

export function AnalyticsTracker() {
  const pathname = usePathname()
  const pageStartTimeRef = useRef<number>(Date.now())
  const previousPathnameRef = useRef<string | null>(null)

  useEffect(() => {
    // Track page view on mount/route change
    trackEvent('page_view', { 
      path: pathname,
      pageTitle: document.title
    })

    pageStartTimeRef.current = Date.now()

    return () => {
      // Track time spent on page before unmounting
      const timeSpent = Math.round((Date.now() - pageStartTimeRef.current) / 1000)
      if (timeSpent > 0) {
        trackEvent('visit', {
          path: previousPathnameRef.current || pathname,
          timeSpent, // seconds
          pageTitle: document.title
        })
      }
      previousPathnameRef.current = pathname
    }
  }, [pathname])

  // Track session end on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const sessionDuration = getSessionDuration()
      trackEvent('session_ended', {
        path: pathname,
        sessionDuration
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [pathname])

  return null
}
