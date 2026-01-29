import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// File path for storing the order counter
const counterFilePath = path.join(process.cwd(), 'data', 'order-counter.json')

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Get current counter value
async function getCounter(): Promise<number> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(counterFilePath, 'utf-8')
    const json = JSON.parse(data)
    return json.counter || 0
  } catch {
    // If file doesn't exist, start from 0
    return 0
  }
}

// Save counter value
async function saveCounter(counter: number): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(counterFilePath, JSON.stringify({ counter, updatedAt: new Date().toISOString() }))
}

// GET - Get current order number without incrementing
export async function GET() {
  try {
    const counter = await getCounter()
    return NextResponse.json({ currentOrder: counter })
  } catch (error) {
    console.error('Error getting order counter:', error)
    return NextResponse.json({ error: 'Failed to get order counter' }, { status: 500 })
  }
}

// POST - Generate next order ID
export async function POST() {
  try {
    const currentCounter = await getCounter()
    const newCounter = currentCounter + 1
    await saveCounter(newCounter)
    
    // Format: ORD-0001, ORD-0002, etc.
    const orderId = `ORD-${String(newCounter).padStart(4, '0')}`
    
    return NextResponse.json({ 
      orderId,
      orderNumber: newCounter 
    })
  } catch (error) {
    console.error('Error generating order ID:', error)
    return NextResponse.json({ error: 'Failed to generate order ID' }, { status: 500 })
  }
}
