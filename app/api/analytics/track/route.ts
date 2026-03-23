import { NextRequest, NextResponse } from 'next/server'
import { createServerPrismaClient } from '@/lib/server-prisma'
import { AnalyticsEventType, insertAnalyticsEvent } from '@/lib/analytics-db'

const allowedTypes: AnalyticsEventType[] = [
  'visit', 
  'page_view', 
  'product_viewed', 
  'add_to_cart', 
  'remove_from_cart',
  'checkout_started', 
  'order_completed',
  'session_ended'
]

export async function POST(request: NextRequest) {
  let prisma: any = null
  try {
    const body = await request.json()
    const type = String(body?.type || '') as AnalyticsEventType
    const sessionId = String(body?.sessionId || '')

    if (!allowedTypes.includes(type) || !sessionId) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    prisma = await createServerPrismaClient()
    await insertAnalyticsEvent(prisma, {
      type,
      sessionId,
      metadata: typeof body?.metadata === 'object' && body.metadata ? body.metadata : {},
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: true })
  } finally {
    if (prisma) {
      await prisma.$disconnect()
    }
  }
}
