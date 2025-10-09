// Simple in-memory rate limiter
interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private requests = new Map<string, RateLimitEntry>()
  private readonly maxRequests: number
  private readonly windowMs: number

  constructor(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  isAllowed(key: string): boolean {
    const now = Date.now()
    const entry = this.requests.get(key)

    if (!entry) {
      this.requests.set(key, {
        count: 1,
        resetTime: now + this.windowMs
      })
      return true
    }

    if (now > entry.resetTime) {
      // Reset the window
      this.requests.set(key, {
        count: 1,
        resetTime: now + this.windowMs
      })
      return true
    }

    if (entry.count >= this.maxRequests) {
      return false
    }

    entry.count++
    return true
  }

  getRemainingRequests(key: string): number {
    const entry = this.requests.get(key)
    if (!entry) return this.maxRequests

    const now = Date.now()
    if (now > entry.resetTime) {
      return this.maxRequests
    }

    return Math.max(0, this.maxRequests - entry.count)
  }

  getResetTime(key: string): number {
    const entry = this.requests.get(key)
    if (!entry) return Date.now() + this.windowMs

    return entry.resetTime
  }

  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key)
      }
    }
  }
}

// Create rate limiter instances
export const apiRateLimiter = new RateLimiter(100, 15 * 60 * 1000) // 100 requests per 15 minutes
export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000) // 5 login attempts per 15 minutes
export const chatRateLimiter = new RateLimiter(50, 5 * 60 * 1000) // 50 chat messages per 5 minutes

// Cleanup old entries every 5 minutes
setInterval(() => {
  apiRateLimiter.cleanup()
  authRateLimiter.cleanup()
  chatRateLimiter.cleanup()
}, 5 * 60 * 1000)

export function getClientIP(request: Request): string {
  // Try to get real IP from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  // Fallback to a default IP (for local development)
  return '127.0.0.1'
}
