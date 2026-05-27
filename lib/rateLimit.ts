// Simple in-memory rate limiter — resets on server restart (fine for Vercel serverless)
// Limits: 5 requests per IP per 60 seconds per endpoint

const store = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(ip: string, endpoint: string, limit = 5, windowMs = 60_000): boolean {
  const key = `${endpoint}:${ip}`
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return true // allowed
  }

  if (entry.count >= limit) return false // blocked

  entry.count++
  return true // allowed
}
