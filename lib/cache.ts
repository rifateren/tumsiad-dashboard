// Simple in-memory cache implementation
interface CacheEntry<T> {
  value: T
  expires: number
  hits: number
}

class Cache<T> {
  private cache = new Map<string, CacheEntry<T>>()
  private readonly defaultTTL: number
  private readonly maxSize: number

  constructor(defaultTTL: number = 5 * 60 * 1000, maxSize: number = 1000) {
    this.defaultTTL = defaultTTL
    this.maxSize = maxSize
  }

  set(key: string, value: T, ttl?: number): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
    }

    const expires = Date.now() + (ttl || this.defaultTTL)
    this.cache.set(key, {
      value,
      expires,
      hits: 0
    })
  }

  get(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    if (Date.now() > entry.expires) {
      this.cache.delete(key)
      return null
    }

    entry.hits++
    return entry.value
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }

  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.cache.delete(key)
      }
    }
  }

  getStats(): { size: number; hitRate: number; totalHits: number } {
    let totalHits = 0
    for (const entry of this.cache.values()) {
      totalHits += entry.hits
    }
    
    return {
      size: this.cache.size,
      hitRate: this.cache.size > 0 ? totalHits / this.cache.size : 0,
      totalHits
    }
  }
}

// Create cache instances for different data types
export const memberCache = new Cache(10 * 60 * 1000) // 10 minutes
export const eventCache = new Cache(5 * 60 * 1000) // 5 minutes
export const analyticsCache = new Cache(15 * 60 * 1000) // 15 minutes
export const competitorCache = new Cache(30 * 60 * 1000) // 30 minutes

// Cleanup expired entries every 5 minutes
setInterval(() => {
  memberCache.cleanup()
  eventCache.cleanup()
  analyticsCache.cleanup()
  competitorCache.cleanup()
}, 5 * 60 * 1000)

// Cache key generators
export function getCacheKey(prefix: string, ...parts: (string | number)[]): string {
  return `${prefix}:${parts.join(':')}`
}

export function getMemberCacheKey(id: string): string {
  return getCacheKey('member', id)
}

export function getEventCacheKey(id: string): string {
  return getCacheKey('event', id)
}

export function getAnalyticsCacheKey(type: string, period?: string): string {
  return getCacheKey('analytics', type, period || 'all')
}

export function getCompetitorCacheKey(name: string): string {
  return getCacheKey('competitor', name.toLowerCase())
}

// Cache helper functions
export async function getCachedOrFetch<T>(
  cache: Cache<T>,
  key: string,
  fetchFn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  const cached = cache.get(key)
  if (cached !== null) {
    return cached
  }

  const data = await fetchFn()
  cache.set(key, data, ttl)
  return data
}

// Cache invalidation patterns
export function invalidateMemberCache(id?: string): void {
  if (id) {
    memberCache.delete(getMemberCacheKey(id))
  } else {
    memberCache.clear()
  }
}

export function invalidateEventCache(id?: string): void {
  if (id) {
    eventCache.delete(getEventCacheKey(id))
  } else {
    eventCache.clear()
  }
}

export function invalidateAnalyticsCache(): void {
  analyticsCache.clear()
}

export function invalidateCompetitorCache(): void {
  competitorCache.clear()
}
