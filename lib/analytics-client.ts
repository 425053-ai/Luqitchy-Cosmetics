"use client"

export type ClientAnalyticsEventType = 
  | 'visit' 
  | 'page_view' 
  | 'product_viewed' 
  | 'add_to_cart' 
  | 'remove_from_cart'
  | 'checkout_started' 
  | 'order_completed'
  | 'session_ended'

const SESSION_KEY = 'luqitchy-session-id'
const SESSION_START_KEY = 'luqitchy-session-start'

function generateSessionId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function getAnalyticsSessionId() {
  if (typeof window === 'undefined') return 'server-session'

  const stored = localStorage.getItem(SESSION_KEY)
  if (stored) return stored

  const generated = generateSessionId()
  localStorage.setItem(SESSION_KEY, generated)
  localStorage.setItem(SESSION_START_KEY, Date.now().toString())
  return generated
}

export function getSessionDuration() {
  if (typeof window === 'undefined') return 0
  
  const startTime = localStorage.getItem(SESSION_START_KEY)
  if (!startTime) return 0
  
  return Math.round((Date.now() - parseInt(startTime)) / 1000) // seconds
}

export async function trackEvent(type: ClientAnalyticsEventType, metadata?: Record<string, unknown>) {
  try {
    const sessionId = getAnalyticsSessionId()
    const sessionDuration = getSessionDuration()
    
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        type, 
        sessionId, 
        metadata: {
          ...metadata,
          sessionDuration,
          timestamp: new Date().toISOString(),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        }
      }),
      keepalive: true,
    })
  } catch {
    // ignore analytics failures
  }
}
