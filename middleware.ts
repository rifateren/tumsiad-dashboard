import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware - Request/Response işleme
 * 
 * Authentication eklendiğinde burası güncellenecek
 */
export function middleware(request: NextRequest) {
  // CORS headers
  const response = NextResponse.next()
  
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  
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
