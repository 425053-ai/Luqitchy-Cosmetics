// Script to reset Upstash Redis order counter
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

async function resetCounter() {
  await redis.set('luqitchy:order_counter', 0)
  console.log('Order counter reset to 0')
}

resetCounter()
