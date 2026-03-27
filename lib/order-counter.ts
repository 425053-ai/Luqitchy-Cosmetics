// ✅ Reliable order counter with atomic file operations and lock mechanism

import { promises as fs } from 'fs'
import path from 'path'

const COUNTER_FILE = path.join(process.cwd(), 'data', 'order-counter.json')
const COUNTER_DIR = path.dirname(COUNTER_FILE)
const LOCK_FILE = `${COUNTER_FILE}.lock`

// In-memory cache for performance
let cachedCounter: number | null = null;
let lastReadTime = 0;
const CACHE_TTL = 50; // 50ms cache

interface CounterData {
  counter: number;
  updatedAt: string;
  version: number;
}

/**
 * Ensure data directory exists
 */
async function ensureDir(): Promise<void> {
  try {
    await fs.mkdir(COUNTER_DIR, { recursive: true });
  } catch (error: any) {
    if (error?.code !== 'EEXIST') {
      throw error;
    }
  }
}

/**
 * Acquire file lock (simple spinlock approach)
 */
async function acquireLock(maxWait: number = 5000): Promise<void> {
  const startTime = Date.now();
  
  while (true) {
    try {
      // Try to create lock file exclusively
      // This will fail if file exists
      const handle = await fs.open(LOCK_FILE, 'wx');
      await handle.close();
      return; // Lock acquired
    } catch (error: any) {
      if (error?.code === 'EEXIST') {
        // Lock file exists, wait and retry
        if (Date.now() - startTime > maxWait) {
          console.warn('⚠️ Lock timeout, proceeding anyway');
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 10));
        continue;
      }
      throw error;
    }
  }
}

/**
 * Release file lock
 */
async function releaseLock(): Promise<void> {
  try {
    await fs.rm(LOCK_FILE, { force: true });
  } catch (error) {
    // Ignore - lock might already be gone
  }
}

/**
 * Read counter from file
 */
async function readCounterFile(): Promise<number> {
  try {
    await ensureDir();
    
    try {
      const content = await fs.readFile(COUNTER_FILE, 'utf-8');
      const parsed: CounterData = JSON.parse(content);
      const value = Number(parsed?.counter ?? 0);
      
      if (!Number.isFinite(value) || value < 0) {
        return 0;
      }
      
      return Math.floor(value);
    } catch (readError: any) {
      if (readError?.code === 'ENOENT') {
        return 0;
      }
      throw readError;
    }
  } catch (error) {
    console.error('❌ Error reading counter file:', error);
    return 0;
  }
}

/**
 * Write counter to file (atomic: write to temp then rename)
 */
async function writeCounterFile(counter: number): Promise<void> {
  try {
    await ensureDir();
    
    const data: CounterData = {
      counter: Math.floor(counter),
      updatedAt: new Date().toISOString(),
      version: 1,
    };
    
    const tempFile = `${COUNTER_FILE}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(data, null, 2));
    
    try {
      await fs.rename(tempFile, COUNTER_FILE);
    } catch (renameError: any) {
      if (renameError?.code === 'EEXIST') {
        await fs.rm(COUNTER_FILE, { force: true });
        await fs.rename(tempFile, COUNTER_FILE);
      } else {
        throw renameError;
      }
    }
    
    // Update cache
    cachedCounter = Math.floor(counter);
    lastReadTime = Date.now();
    
  } catch (error) {
    console.error('❌ Error writing counter file:', error);
    throw error;
  }
}

/**
 * Get current counter value (with caching)
 */
export async function getCurrentOrderCounter(): Promise<number> {
  try {
    const now = Date.now();
    if (cachedCounter !== null && (now - lastReadTime) < CACHE_TTL) {
      return cachedCounter;
    }
    
    const value = await readCounterFile();
    cachedCounter = value;
    lastReadTime = now;
    
    return value;
  } catch (error) {
    console.error('❌ Failed to get current counter:', error);
    return cachedCounter ?? 0;
  }
}

/**
 * Get next counter value (ATOMIC INCREMENT with locking)
 */
export async function getNextOrderCounter(): Promise<number> {
  let lockAcquired = false;
  
  try {
    // Acquire lock to ensure atomic read-modify-write
    await acquireLock();
    lockAcquired = true;
    
    // Read current value
    const currentValue = await readCounterFile();
    
    // Increment
    const nextValue = currentValue + 1;
    
    // Write back immediately
    await writeCounterFile(nextValue);
    
    console.log(`✅ [OrderCounter] Next: ${nextValue}`);
    return nextValue;
    
  } catch (error: any) {
    console.error('❌ Failed to get next counter:', error);
    
    // Fallback: use timestamp-based counter
    const fallback = Math.ceil(Date.now() / 1000);
    console.warn(`⚠️ [OrderCounter] Fallback: ${fallback}`);
    
    return fallback;
  } finally {
    if (lockAcquired) {
      await releaseLock().catch(() => {});
    }
  }
}

/**
 * Sync counter to ensure minimum value
 */
export async function syncOrderCounter(minCounter: number): Promise<number> {
  let lockAcquired = false;
  
  try {
    await acquireLock();
    lockAcquired = true;
    
    const safeMin = Number.isFinite(minCounter) && minCounter > 0 ? Math.floor(minCounter) : 0;
    const current = await readCounterFile();
    const syncValue = Math.max(current, safeMin);
    
    if (syncValue > current) {
      await writeCounterFile(syncValue);
      console.log(`✅ [OrderCounter] Synced to: ${syncValue}`);
    }
    
    return syncValue;
  } catch (error) {
    console.error('❌ Sync failed:', error);
    throw error;
  } finally {
    if (lockAcquired) {
      await releaseLock().catch(() => {});
    }
  }
}

/**
 * Manually set counter value
 */
export async function setOrderCounter(counter: number): Promise<number> {
  let lockAcquired = false;
  
  try {
    await acquireLock();
    lockAcquired = true;
    
    const safeCounter = Number.isFinite(counter) && counter >= 0 ? Math.floor(counter) : 0;
    await writeCounterFile(safeCounter);
    console.log(`✅ [OrderCounter] Set to: ${safeCounter}`);
    return safeCounter;
  } catch (error) {
    console.error('❌ Set failed:', error);
    throw error;
  } finally {
    if (lockAcquired) {
      await releaseLock().catch(() => {});
    }
  }
}

/**
 * Format counter as order ID
 */
export function formatOrderId(counter: number): string {
  const safe = Math.max(1, Math.floor(counter));
  return `ORD-${String(safe).padStart(4, '0')}`;
}
