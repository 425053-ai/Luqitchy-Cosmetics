import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

const COUNTER_KEY = 'luqitchy:order_counter'

// GET - Get current order number without incrementing
export async function GET() {
  try {
    const counter = await redis.get<number>(COUNTER_KEY) || 0
    return NextResponse.json({ currentOrder: counter })
  } catch (error) {
    console.error('Error getting order counter:', error)
    return NextResponse.json({ error: 'Failed to get order counter' }, { status: 500 })
  }
}

// POST - Generate next order ID (atomic increment)
export async function POST() {
  try {
    // INCR is atomic - no race conditions even with concurrent requests!
    const newCounter = await redis.incr(COUNTER_KEY)
    
    // Format: ORD-0001, ORD-0002, etc.
    const orderId = `ORD-${String(newCounter).padStart(4, '0')}`
    
    return NextResponse.json({ 
      orderId,
      orderNumber: newCounter 
    })
  } catch (error) {
    console.error('Error generating order ID:', error)
    
    // Fallback to timestamp-based ID if Redis fails
    const fallbackId = `ORD-${Date.now()}`
    return NextResponse.json({ 
      orderId: fallbackId,
      orderNumber: Date.now(),
      warning: 'Used fallback ID due to database error'
    })
  }
}
