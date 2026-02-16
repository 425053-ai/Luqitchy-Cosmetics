import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import fs from 'fs'
import path from 'path'

const COUNTER_KEY = 'luqitchy:order_counter'
const COUNTER_FILE = path.join(process.cwd(), 'data', 'order-counter.json')

// In-memory counter as fallback
let memoryCounter = 0

// Try to load counter from file
function loadCounterFromFile(): number {
  try {
    if (fs.existsSync(COUNTER_FILE)) {
      const data = fs.readFileSync(COUNTER_FILE, 'utf-8')
      const parsed = JSON.parse(data)
      memoryCounter = Math.max(memoryCounter, parsed.counter || 0)
      return memoryCounter
    }
  } catch (err) {
    console.warn('Could not load counter from file:', err)
  }
  return memoryCounter
}

// Save counter to file
function saveCounterToFile(counter: number) {
  try {
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    fs.writeFileSync(
      COUNTER_FILE,
      JSON.stringify({ counter, updatedAt: new Date().toISOString() }, null, 2)
    )
  } catch (err) {
    console.warn('Could not save counter to file:', err)
  }
}

// Initialize counter on first load
loadCounterFromFile()

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
    // Check if Redis is configured
    const url = (process.env.UPSTASH_REDIS_REST_URL || '').trim()
    const token = (process.env.UPSTASH_REDIS_REST_TOKEN || '').trim()
    
    let newCounter: number
    let usingRedis = false

    if (url && token) {
      try {
        // Check if counter is using old 1000+ format and reset it
        const currentValue = await getRedis().get<number>(COUNTER_KEY)
        if (currentValue !== null && currentValue >= 1000) {
          console.log('🔄 Resetting Redis counter from old format:', currentValue)
          await getRedis().set(COUNTER_KEY, 0)
        }
        // Try to use Redis
        newCounter = await getRedis().incr(COUNTER_KEY)
        usingRedis = true
        console.log('✅ Using Redis counter:', newCounter)
      } catch (redisErr) {
        console.warn('⚠️ Redis failed, falling back to file counter:', redisErr)
        // Fall back to file counter
        memoryCounter++
        saveCounterToFile(memoryCounter)
        newCounter = memoryCounter
      }
    } else {
      // No Redis configured, use file-based counter
      memoryCounter++
      saveCounterToFile(memoryCounter)
      newCounter = memoryCounter
      console.log('📝 Using file-based counter:', newCounter)
    }
    
    // Format: ORD-0001, ORD-0002, etc.
    const orderId = `ORD-${String(newCounter).padStart(4, '0')}`
    
    return NextResponse.json({ 
      orderId,
      orderNumber: newCounter,
      ...(usingRedis && { info: 'Using Redis' })
    }, { status: 200 })
  } catch (error) {
    console.error('Error generating order ID:', error)
    
    // Last resort fallback - use memory counter
    memoryCounter++
    const orderId = `ORD-${String(memoryCounter).padStart(4, '0')}`
    return NextResponse.json({ 
      orderId,
      orderNumber: memoryCounter,
      warning: 'Using memory counter'
    }, { status: 200 })
  }
}
