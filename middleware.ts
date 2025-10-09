import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withRateLimit, getSecurityHeaders, getCORSHeaders, logSecurityEvent } from './lib/security'
import { apiRateLimiter, authRateLimiter } from './lib/rate-limiter'

/**
 * Middleware - Request/Response işleme
 * 
 * Authentication eklendiğinde burası güncellenecek
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Add security headers
  Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  // Add CORS headers
  Object.entries(getCORSHeaders()).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const endpoint = request.nextUrl.pathname
    let limiter = apiRateLimiter
    
    // Use stricter rate limiting for auth endpoints
    if (endpoint.includes('/auth/') || endpoint.includes('/login')) {
      limiter = authRateLimiter
    }
    
    const rateLimitResult = withRateLimit(request, limiter, endpoint)
    
    if (!rateLimitResult.allowed) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', {
        endpoint,
        remaining: rateLimitResult.remaining,
        resetTime: rateLimitResult.resetTime
      }, request)
      
      return new NextResponse('Rate limit exceeded', { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
        }
      })
    }
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', '100')
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
    response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString())
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { 
      status: 200,
      headers: response.headers
    })
  }
  
  return response
}

// Middleware'in çalışacağı route'lar
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

/**
 * Authentication middleware örneği (NextAuth.js ile)
 * 
 * import { withAuth } from "next-auth/middleware"
 * 
 * export default withAuth(
 *   function middleware(req) {
 *     // Authenticated requests için ek logic
 *   },
 *   {
 *     callbacks: {
 *       authorized: ({ token, req }) => {
 *         // Dashboard'a erişim için authentication gerekli
 *         if (req.nextUrl.pathname.startsWith('/dashboard')) {
 *           return !!token
 *         }
 *         return true
 *       },
 *     },
 *   }
 * )
 * 
 * export const config = {
 *   matcher: ['/dashboard/:path*']
 * }
 */
