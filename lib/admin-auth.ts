import crypto from 'crypto'

export const ADMIN_COOKIE_NAME = 'luqitchy_admin_session'
const ADMIN_FALLBACK_PASSWORD = '1592003'

function getAdminSecret() {
  return (process.env.ADMIN_DASHBOARD_KEY || process.env.ADMIN_SECRET || ADMIN_FALLBACK_PASSWORD).trim()
}

export function isAdminPasswordValid(password: string) {
  const secret = getAdminSecret()
  if (!secret) {
    return false
  }
  return password === secret
}

export function createAdminSessionToken() {
  const secret = getAdminSecret()
  if (!secret) {
    throw new Error('Admin secret is not configured')
  }

  const payload = {
    iat: Date.now(),
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
    nonce: crypto.randomBytes(12).toString('hex'),
  }

  const payloadBase64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  const signature = crypto.createHmac('sha256', secret).update(payloadBase64).digest('base64url')
  return `${payloadBase64}.${signature}`
}

export function isAdminSessionTokenValid(token?: string | null) {
  if (!token) {
    return false
  }

  const secret = getAdminSecret()
  if (!secret) {
    return false
  }

  const parts = token.split('.')
  if (parts.length !== 2) {
    return false
  }

  const [payloadBase64, signature] = parts
  const expectedSignature = crypto.createHmac('sha256', secret).update(payloadBase64).digest('base64url')
  if (signature !== expectedSignature) {
    return false
  }

  try {
    const payloadRaw = Buffer.from(payloadBase64, 'base64url').toString('utf8')
    const payload = JSON.parse(payloadRaw) as { exp?: number }
    if (!payload.exp || Date.now() > payload.exp) {
      return false
    }
    return true
  } catch {
    return false
  }
}
