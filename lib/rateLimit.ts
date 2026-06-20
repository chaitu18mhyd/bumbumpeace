// Simple in-memory rate limiter
// For production, consider using Redis or a dedicated service like Upstash

type RateLimitEntry = {
  count: number;
  resetTime: number;
};

const store = new Map<string, RateLimitEntry>();

/**
 * Check if a request from an IP should be rate-limited.
 * Returns { allowed: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(
  ip: string,
  maxRequests: number = 60,
  windowMs: number = 60 * 1000 // 1 minute in milliseconds
) {
  const now = Date.now();
  const entry = store.get(ip);

  // If no entry exists or window has reset, create a new one
  if (!entry || now > entry.resetTime) {
    const newEntry = {
      count: 1,
      resetTime: now + windowMs,
    };
    store.set(ip, newEntry);
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: newEntry.resetTime,
    };
  }

  // Increment the count
  entry.count++;

  const allowed = entry.count <= maxRequests;
  const remaining = Math.max(0, maxRequests - entry.count);

  return {
    allowed,
    remaining,
    resetTime: entry.resetTime,
  };
}

/**
 * Clean up old entries periodically (called once on app startup)
 */
export function startCleanupInterval(intervalMs: number = 60 * 1000) {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of store.entries()) {
      if (now > entry.resetTime) {
        store.delete(ip);
      }
    }
  }, intervalMs);
}
