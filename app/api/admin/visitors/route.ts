import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME, isAdminSessionTokenValid } from '@/lib/admin-auth'
import { getAnalyticsEvents } from '@/lib/analytics-db'
import { createServerPrismaClient } from '@/lib/server-prisma'

interface AnalyticsEventRow {
  id: number
  type: 'visit' | 'page_view' | 'product_viewed' | 'add_to_cart' | 'remove_from_cart' | 'checkout_started' | 'order_completed' | 'session_ended'
  session_id: string
  metadata: Record<string, unknown> | null
  created_at: string | Date
}

export async function GET(request: NextRequest) {
  let prisma: any = null
  
  try {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
    if (!isAdminSessionTokenValid(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rangeParam = request.nextUrl.searchParams.get('range') || '24h'
    const sessionIdFilter = request.nextUrl.searchParams.get('sessionId')

    prisma = await createServerPrismaClient()

    // Calculate time range
    let since = new Date()
    if (rangeParam === '24h') since.setHours(since.getHours() - 24)
    else if (rangeParam === '7d') since.setDate(since.getDate() - 7)
    else if (rangeParam === '30d') since.setDate(since.getDate() - 30)

    let events: AnalyticsEventRow[] = []
    try {
      events = (await getAnalyticsEvents(prisma, since)) as AnalyticsEventRow[]
      console.log(`📊 Retrieved ${events.length} analytics events`)
    } catch (dbError) {
      console.warn('⚠️  Could not fetch events from database:', dbError)
      // Return empty data if database is not ready
      return NextResponse.json({
        range: rangeParam,
        summary: {
          uniqueVisitors: 0,
          totalPageViews: 0,
          cartUsers: 0,
          conversions: 0,
          conversionRate: '0',
          avgSessionDuration: 0,
        },
        visitors: [],
      })
    }

    // If specific session is requested, return detailed session info
    if (sessionIdFilter) {
      const sessionEvents = events.filter(e => e.session_id === sessionIdFilter)
      const sessionData = sessionEvents.map(e => {
        const createdAt = typeof e.created_at === 'string' ? new Date(e.created_at) : e.created_at
        return {
          type: e.type,
          timestamp: createdAt.toLocaleTimeString(),
          path: (e.metadata?.path as string) || 'N/A',
          productName: (e.metadata?.productName as string) || null,
          quantity: (e.metadata?.quantity as number) || null,
          sessionDuration: (e.metadata?.sessionDuration as number) || 0,
          pageTitle: (e.metadata?.pageTitle as string) || null,
        }
      })

      const lastEvent = sessionEvents[sessionEvents.length - 1]
      const totalSessionTime = (lastEvent?.metadata?.sessionDuration as number) || 0

      return NextResponse.json({
        sessionId: sessionIdFilter,
        events: sessionData,
        totalEvents: sessionEvents.length,
        sessionDuration: totalSessionTime,
        firstSeen: sessionEvents[0] ? new Date(sessionEvents[0].created_at).toLocaleString() : null,
        lastSeen: lastEvent ? new Date(lastEvent.created_at).toLocaleString() : null,
      })
    }

    // Get all unique sessions with summary data
    const sessionMap = new Map<string, {
      sessionId: string
      firstSeen: Date
      lastSeen: Date
      eventCount: number
      pageViews: number
      productsViewed: string[]
      addedToCart: number
      orders: number
      conversionStatus: 'visitor' | 'cart_user' | 'converted'
      lastPath: string
      sessionDuration: number
    }>()

    for (const event of events) {
      const createdAt = typeof event.created_at === 'string' ? new Date(event.created_at) : event.created_at
      
      if (!sessionMap.has(event.session_id)) {
        sessionMap.set(event.session_id, {
          sessionId: event.session_id,
          firstSeen: createdAt,
          lastSeen: createdAt,
          eventCount: 0,
          pageViews: 0,
          productsViewed: [],
          addedToCart: 0,
          orders: 0,
          conversionStatus: 'visitor',
          lastPath: (event.metadata?.path as string) || '/',
          sessionDuration: 0,
        })
      }

      const session = sessionMap.get(event.session_id)!
      session.eventCount++
      session.lastSeen = createdAt
      session.lastPath = (event.metadata?.path as string) || session.lastPath
      session.sessionDuration = Math.max(session.sessionDuration, (event.metadata?.sessionDuration as number) || 0)

      if (event.type === 'page_view') {
        session.pageViews++
      } else if (event.type === 'product_viewed') {
        const productName = (event.metadata?.productName as string) || 'Unknown'
        if (!session.productsViewed.includes(productName)) {
          session.productsViewed.push(productName)
        }
      } else if (event.type === 'add_to_cart') {
        session.addedToCart++
        if (session.conversionStatus === 'visitor') {
          session.conversionStatus = 'cart_user'
        }
      } else if (event.type === 'order_completed') {
        session.orders++
        session.conversionStatus = 'converted'
      }
    }

    // Convert to array and sort by most recent
    const visitors = Array.from(sessionMap.values())
      .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime())
      .map(v => ({
        sessionId: v.sessionId,
        firstSeen: v.firstSeen.toLocaleString(),
        lastSeen: v.lastSeen.toLocaleString(),
        eventCount: v.eventCount,
        pageViews: v.pageViews,
        productsViewed: v.productsViewed,
        addedToCart: v.addedToCart,
        orders: v.orders,
        conversionStatus: v.conversionStatus,
        lastPath: v.lastPath,
        sessionDuration: Math.round(v.sessionDuration / 1000), // Convert to seconds
      }))

    // Calculate summary statistics
    const uniqueVisitors = visitors.length
    const totalPageViews = visitors.reduce((sum, v) => sum + v.pageViews, 0)
    const cartUsers = visitors.filter(v => v.conversionStatus === 'cart_user' || v.conversionStatus === 'converted').length
    const conversions = visitors.filter(v => v.conversionStatus === 'converted').length
    const avgSessionDuration = uniqueVisitors > 0 
      ? Math.round(visitors.reduce((sum, v) => sum + v.sessionDuration, 0) / uniqueVisitors)
      : 0

    return NextResponse.json({
      range: rangeParam,
      summary: {
        uniqueVisitors,
        totalPageViews,
        cartUsers,
        conversions,
        conversionRate: uniqueVisitors > 0 ? ((conversions / uniqueVisitors) * 100).toFixed(2) : '0',
        avgSessionDuration,
      },
      visitors,
    })
  } catch (error) {
    console.error('Visitor analytics error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error details:', errorMessage)
    return NextResponse.json(
      { error: 'Analytics temporarily unavailable', details: errorMessage },
      { status: 500 }
    )
  } finally {
    if (prisma) {
      try {
        await prisma.$disconnect()
      } catch (e) {
        console.error('Error disconnecting Prisma:', e)
      }
    }
  }
}
