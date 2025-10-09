import { NextRequest } from 'next/server'
import { apiRateLimiter, authRateLimiter, chatRateLimiter, getClientIP } from './rate-limiter'

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .slice(0, 1000) // Limit length
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number (Turkish format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Rate limiting middleware
export function withRateLimit(
  request: NextRequest,
  limiter: typeof apiRateLimiter,
  endpoint: string
) {
  const clientIP = getClientIP(request)
  const key = `${clientIP}:${endpoint}`
  
  if (!limiter.isAllowed(key)) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: limiter.getResetTime(key)
    }
  }
  
  return {
    allowed: true,
    remaining: limiter.getRemainingRequests(key),
    resetTime: limiter.getResetTime(key)
  }
}

// CORS headers
export function getCORSHeaders() {
  return {
    'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
      ? 'https://tumsiad-dashboard.vercel.app' 
      : 'http://localhost:3000',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  }
}

// Security headers
export function getSecurityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  }
}

// SQL injection protection (basic)
export function sanitizeSQL(input: string): string {
  return input
    .replace(/[';]/g, '') // Remove single quotes and semicolons
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove block comment start
    .replace(/\*\//g, '') // Remove block comment end
    .replace(/union/gi, '') // Remove UNION keyword
    .replace(/select/gi, '') // Remove SELECT keyword
    .replace(/insert/gi, '') // Remove INSERT keyword
    .replace(/update/gi, '') // Remove UPDATE keyword
    .replace(/delete/gi, '') // Remove DELETE keyword
    .replace(/drop/gi, '') // Remove DROP keyword
}

// Validate and sanitize form data
export function validateFormData(data: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value)
    } else if (typeof value === 'number') {
      // Ensure numbers are within reasonable bounds
      if (value > 1000000 || value < -1000000) {
        throw new Error(`Value for ${key} is out of bounds`)
      }
      sanitized[key] = value
    } else if (typeof value === 'boolean') {
      sanitized[key] = Boolean(value)
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeInput(item) : item
      )
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized
}

// API key validation (for future use)
export function validateAPIKey(apiKey: string): boolean {
  // In production, validate against your API key store
  if (process.env.NODE_ENV === 'development') {
    return apiKey === 'dev-key'
  }
  
  // For production, implement proper API key validation
  return Boolean(apiKey && apiKey.length > 20)
}

// Request logging
export function logSecurityEvent(
  event: string,
  details: Record<string, any>,
  request: NextRequest
) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: getClientIP(request),
    userAgent: request.headers.get('user-agent'),
    url: request.url,
    method: request.method
  }
  
  console.log('Security Event:', JSON.stringify(logEntry))
  
  // In production, send to security monitoring service
  // e.g., Sentry, DataDog, or custom security dashboard
}
