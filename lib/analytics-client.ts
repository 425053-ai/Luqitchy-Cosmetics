"use client"

export type ClientAnalyticsEventType = 'visit' | 'add_to_cart' | 'checkout_started' | 'order_completed'

const SESSION_KEY = 'luqitchy-session-id'

function generateSessionId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function getAnalyticsSessionId() {
  if (typeof window === 'undefined') return 'server-session'

  const stored = localStorage.getItem(SESSION_KEY)
  if (stored) return stored

  const generated = generateSessionId()
  localStorage.setItem(SESSION_KEY, generated)
  return generated
}

export async function trackEvent(type: ClientAnalyticsEventType, metadata?: Record<string, unknown>) {
  try {
    const sessionId = getAnalyticsSessionId()
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, sessionId, metadata }),
      keepalive: true,
    })
  } catch {
    // ignore analytics failures
  }
}
