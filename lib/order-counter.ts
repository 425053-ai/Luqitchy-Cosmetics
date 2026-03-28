// ✅ Reliable order counter with Redis (Upstash) primary + file fallback

import { promises as fs } from 'fs'
import path from 'path'

const COUNTER_FILE = path.join(process.cwd(), 'data', 'order-counter.json')
const COUNTER_DIR = path.dirname(COUNTER_FILE)
const LOCK_FILE = `${COUNTER_FILE}.lock`

// In-memory cache for performance
let cachedCounter: number | null = null;
let lastReadTime = 0;
const CACHE_TTL = 50; // 50ms cache

// Redis (Upstash) configuration
const UPSTASH_REDIS_URL = (process.env.UPSTASH_REDIS_REST_URL || '').trim()
const UPSTASH_REDIS_TOKEN = (process.env.UPSTASH_REDIS_REST_TOKEN || '').trim()
const REDIS_AVAILABLE = UPSTASH_REDIS_URL && UPSTASH_REDIS_TOKEN

// Track last successful counter value for emergency fallback
let lastSuccessfulCounter: number | null = null;

interface CounterData {
  counter: number;
  updatedAt: string;
  version: number;
}

/**
 * Increment counter in Upstash Redis
 */
async function redisIncrement(): Promise<number | null> {
  if (!REDIS_AVAILABLE) return null;
  
  try {
    console.log('🔄 [Redis] Attempting to increment counter...');
    const response = await fetch(`${UPSTASH_REDIS_URL}/incr/luqitchy_order_counter`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${UPSTASH_REDIS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    } as any);

    if (!response.ok) {
      console.warn(`⚠️ [Redis] HTTP error: ${response.status}`);
      return null;
    }

    const data: any = await response.json();
    if (data.result === undefined || data.result === null) {
      console.warn('⚠️ [Redis] No result returned');
      return null;
    }

    const value = Number(data.result);
    if (!Number.isFinite(value) || value < 0) {
      console.warn(`⚠️ [Redis] Invalid counter value: ${value}`);
      return null;
    }

    console.log(`✅ [Redis] Counter incremented to: ${value}`);
    lastSuccessfulCounter = value;
    return Math.floor(value);
  } catch (error: any) {
    console.warn(`⚠️ [Redis] Connection failed: ${error.message}`);
    return null;
  }
}

/**
 * Get current counter from Upstash Redis
 */
async function redisGetCounter(): Promise<number | null> {
  if (!REDIS_AVAILABLE) return null;

  try {
    const response = await fetch(`${UPSTASH_REDIS_URL}/get/luqitchy_order_counter`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${UPSTASH_REDIS_TOKEN}`,
      },
      timeout: 5000,
    } as any);

    if (!response.ok) {
      return null;
    }

    const data: any = await response.json();
    const value = Number(data.result ?? 0);
    
    if (!Number.isFinite(value) || value < 0) {
      return 0;
    }

    lastSuccessfulCounter = Math.floor(value);
    return Math.floor(value);
  } catch (error) {
    console.warn(`⚠️ [Redis] Get failed: ${error}`);
    return null;
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
 * PRIMARY: Upstash Redis (if available)
 * FALLBACK: File-based system
 */
export async function getCurrentOrderCounter(): Promise<number> {
  try {
    const now = Date.now();
    
    // Use cache if fresh enough
    if (cachedCounter !== null && (now - lastReadTime) < CACHE_TTL) {
      return cachedCounter;
    }

    // Try Redis first
    if (REDIS_AVAILABLE) {
      const redisValue = await redisGetCounter();
      if (redisValue !== null) {
        cachedCounter = redisValue;
        lastReadTime = now;
        return redisValue;
      }
    }

    // Fall back to file system
    const fileValue = await readCounterFile();
    cachedCounter = fileValue;
    lastReadTime = now;
    return fileValue;
  } catch (error) {
    console.error('❌ Failed to get current counter:', error);
    return cachedCounter ?? lastSuccessfulCounter ?? 0;
  }
}

/**
 * Get next counter value (ATOMIC INCREMENT)
 * PRIMARY: Upstash Redis (if available)
 * FALLBACK: File-based system (never timestamp-based)
 */
export async function getNextOrderCounter(): Promise<number> {
  try {
    // STEP 1: Try Redis first (if configured)
    if (REDIS_AVAILABLE) {
      console.log('📡 [OrderCounter] Using Upstash Redis...');
      const redisValue = await redisIncrement();
      if (redisValue !== null && redisValue > 0) {
        return redisValue;
      }
      console.warn('⚠️ [OrderCounter] Redis failed, falling back to file system');
    }

    // STEP 2: Use file-based counter (with atomic locking)
    console.log('📁 [OrderCounter] Using file-based counter...');
    let lockAcquired = false;
    try {
      await acquireLock();
      lockAcquired = true;

      // Read current value
      const currentValue = await readCounterFile();

      // Increment
      const nextValue = currentValue + 1;

      // Write back
      await writeCounterFile(nextValue);

      console.log(`✅ [OrderCounter] File-based increment: ${currentValue} → ${nextValue}`);
      lastSuccessfulCounter = nextValue;
      return nextValue;
    } finally {
      if (lockAcquired) {
        await releaseLock().catch(() => {});
      }
    }
  } catch (error: any) {
    console.error('❌ [OrderCounter] All methods failed:', error);
    
    // CRITICAL: Never use timestamp-based fallback!
    // Instead, use last successful value or minimum
    const fallbackValue = (lastSuccessfulCounter ?? 0) + 1;
    console.warn(`⚠️ [OrderCounter] Emergency fallback to: ${fallbackValue}`);
    
    // Try to at least update the file with this value
    try {
      await writeCounterFile(fallbackValue).catch(() => {});
    } catch (e) {
      // Ignore write errors in fallback
    }

    lastSuccessfulCounter = fallbackValue;
    return Math.max(1, fallbackValue);
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
