import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const COUNTER_KEY = 'luqitchy:order_counter'

// Lazy initialization - only create Redis client when needed (not at build time)
let redis: Redis | null = null

function getRedis(): Redis {
  if (!redis) {
    const url = (process.env.UPSTASH_REDIS_REST_URL || '').trim()
    const token = (process.env.UPSTASH_REDIS_REST_TOKEN || '').trim()
    
    if (!url || !token) {
      throw new Error('Redis credentials not configured')
    }
    
    redis = new Redis({ url, token })
  }
  return redis
}

// GET - Get current order number without incrementing
export async function GET() {
  try {
    const counter = await getRedis().get<number>(COUNTER_KEY) || 0
    return NextResponse.json({ currentOrder: counter })
  } catch (error) {
    console.error('Error getting order counter:', error)
    return NextResponse.json({ error: 'Failed to get order counter' }, { status: 500 })
  }
}

// POST - Generate next order ID (atomic increment)
export async function POST() {
  try {
    // Check if Redis is configured before trying to use it
    const url = (process.env.UPSTASH_REDIS_REST_URL || '').trim()
    const token = (process.env.UPSTASH_REDIS_REST_TOKEN || '').trim()
    
    if (!url || !token) {
      // Use fallback if Redis not configured
      const fallbackId = `ORD-${Date.now()}`
      console.warn('⚠️ Redis not configured, using fallback ID:', fallbackId)
      return NextResponse.json({ 
        orderId: fallbackId,
        orderNumber: Date.now(),
        warning: 'Redis not configured, used fallback ID'
      }, { status: 200 })
    }
    
    // INCR is atomic - no race conditions even with concurrent requests!
    const newCounter = await getRedis().incr(COUNTER_KEY)
    
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
    }, { status: 200 })
  }
}
