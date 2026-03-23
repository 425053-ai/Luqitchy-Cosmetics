export type AnalyticsEventType = 
  | 'visit' 
  | 'page_view' 
  | 'product_viewed' 
  | 'add_to_cart' 
  | 'remove_from_cart'
  | 'checkout_started' 
  | 'order_completed'
  | 'session_ended'

export interface AnalyticsEventInput {
  type: AnalyticsEventType
  sessionId: string
  metadata?: Record<string, unknown>
}

export async function ensureAnalyticsTable(prisma: any) {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id BIGSERIAL PRIMARY KEY,
      type VARCHAR(50) NOT NULL,
      session_id VARCHAR(120) NOT NULL,
      metadata JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS idx_analytics_events_type_created ON analytics_events(type, created_at DESC)`
  )
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS idx_analytics_events_session_created ON analytics_events(session_id, created_at DESC)`
  )
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id)`
  )
}

export async function insertAnalyticsEvent(prisma: any, input: AnalyticsEventInput) {
  await ensureAnalyticsTable(prisma)
  await prisma.$executeRawUnsafe(
    `INSERT INTO analytics_events (type, session_id, metadata) VALUES ($1, $2, $3::jsonb)`,
    input.type,
    input.sessionId,
    JSON.stringify(input.metadata || {})
  )
}

export async function getAnalyticsEvents(prisma: any, since?: Date) {
  await ensureAnalyticsTable(prisma)

  if (!since) {
    return prisma.$queryRawUnsafe(
      `SELECT id, type, session_id, metadata, created_at FROM analytics_events ORDER BY created_at ASC`
    )
  }

  return prisma.$queryRawUnsafe(
    `SELECT id, type, session_id, metadata, created_at FROM analytics_events WHERE created_at >= $1 ORDER BY created_at ASC`,
    since.toISOString()
  )
}

export async function getSessionDetails(prisma: any, sessionId: string) {
  await ensureAnalyticsTable(prisma)
  
  return prisma.$queryRawUnsafe(
    `SELECT id, type, session_id, metadata, created_at FROM analytics_events WHERE session_id = $1 ORDER BY created_at ASC`,
    sessionId
  )
}
