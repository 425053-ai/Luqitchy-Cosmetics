import fs from 'fs'
import path from 'path'

const COUNTER_FILE = path.join(process.cwd(), 'data', 'order-counter.json')

let memoryCounter = 0

function readCounterFile(): number {
  try {
    if (!fs.existsSync(COUNTER_FILE)) {
      return 0
    }

    const content = fs.readFileSync(COUNTER_FILE, 'utf-8')
    const parsed = JSON.parse(content)
    const value = Number(parsed?.counter || 0)

    if (!Number.isFinite(value) || value < 0) {
      return 0
    }

    return Math.floor(value)
  } catch {
    return 0
  }
}

function writeCounterFile(counter: number) {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  fs.writeFileSync(
    COUNTER_FILE,
    JSON.stringify({ counter, updatedAt: new Date().toISOString() }, null, 2)
  )
}

export function getCurrentOrderCounter(): number {
  const fileCounter = readCounterFile()
  memoryCounter = Math.max(memoryCounter, fileCounter)
  return memoryCounter
}

export function getNextOrderCounter(): number {
  const fileCounter = readCounterFile()
  memoryCounter = Math.max(memoryCounter, fileCounter) + 1
  writeCounterFile(memoryCounter)
  return memoryCounter
}

export function syncOrderCounter(minCounter: number): number {
  const safeMin = Number.isFinite(minCounter) && minCounter > 0 ? Math.floor(minCounter) : 0
  const fileCounter = readCounterFile()
  memoryCounter = Math.max(memoryCounter, fileCounter, safeMin)
  writeCounterFile(memoryCounter)
  return memoryCounter
}

export function setOrderCounter(counter: number): number {
  const safeCounter = Number.isFinite(counter) && counter >= 0 ? Math.floor(counter) : 0
  memoryCounter = safeCounter
  writeCounterFile(memoryCounter)
  return memoryCounter
}

export function formatOrderId(counter: number): string {
  return `ORD-${String(counter).padStart(4, '0')}`
}
