// Simple rate limiting utility
const requests = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(identifier: string, limit: number = 10, windowMs: number = 60000) {
  const now = Date.now();
  const key = identifier;
  
  const record = requests.get(key);
  
  if (!record || now > record.resetTime) {
    requests.set(key, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }
  
  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }
  
  record.count++;
  return { success: true, remaining: limit - record.count };
}

export function getRateLimitHeaders(identifier: string, limit: number = 10, windowMs: number = 60000) {
  const result = rateLimit(identifier, limit, windowMs);
  return {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(Date.now() + windowMs).toISOString()
  };
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}