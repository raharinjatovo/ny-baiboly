/**
 * Rate limiting utility for API endpoints
 * Implements token bucket algorithm with Redis-like in-memory store
 */

import { NextRequest } from 'next/server';

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (request: NextRequest) => string;
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, {
  requests: number;
  resetTime: number;
}>();

// Default configuration
const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 60, // 60 requests
  windowMs: 60 * 1000, // per minute
};

/**
 * Get client identifier for rate limiting
 */
function getClientKey(request: NextRequest): string {
  // Try to get real IP from headers (behind proxy)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const connectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  const ip = forwarded?.split(',')[0] || realIp || connectingIp || 'unknown';
  
  return `rate_limit:${ip}`;
}

/**
 * Clean up expired entries from the store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (data.resetTime <= now) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Apply rate limiting to a request
 */
export async function rateLimit(
  request: NextRequest,
  config: Partial<RateLimitConfig> = {}
): Promise<RateLimitResult> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const key = finalConfig.keyGenerator?.(request) || getClientKey(request);
  const now = Date.now();
  
  // Clean up expired entries periodically
  if (Math.random() < 0.1) { // 10% chance
    cleanupExpiredEntries();
  }
  
  let rateLimitData = rateLimitStore.get(key);
  
  // Initialize or reset if window has expired
  if (!rateLimitData || rateLimitData.resetTime <= now) {
    rateLimitData = {
      requests: 1,
      resetTime: now + finalConfig.windowMs,
    };
    rateLimitStore.set(key, rateLimitData);
    
    return {
      success: true,
      remaining: finalConfig.maxRequests - 1,
      resetTime: rateLimitData.resetTime,
    };
  }
  
  // Check if limit exceeded
  if (rateLimitData.requests >= finalConfig.maxRequests) {
    const retryAfter = Math.ceil((rateLimitData.resetTime - now) / 1000);
    
    return {
      success: false,
      remaining: 0,
      resetTime: rateLimitData.resetTime,
      retryAfter,
    };
  }
  
  // Increment request count
  rateLimitData.requests++;
  rateLimitStore.set(key, rateLimitData);
  
  return {
    success: true,
    remaining: finalConfig.maxRequests - rateLimitData.requests,
    resetTime: rateLimitData.resetTime,
  };
}

/**
 * Rate limiting for search endpoints (stricter)
 */
export async function searchRateLimit(request: NextRequest): Promise<RateLimitResult> {
  return rateLimit(request, {
    maxRequests: 30, // 30 requests
    windowMs: 60 * 1000, // per minute
  });
}

/**
 * Rate limiting for general API endpoints
 */
export async function apiRateLimit(request: NextRequest): Promise<RateLimitResult> {
  return rateLimit(request, {
    maxRequests: 100, // 100 requests
    windowMs: 60 * 1000, // per minute
  });
}
