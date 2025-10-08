// Rate limiting simple en memoria (para producción usar Redis)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export function rateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minuto
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  // Limpiar entradas expiradas
  if (entry && now > entry.resetTime) {
    rateLimitMap.delete(identifier);
  }

  const currentEntry = rateLimitMap.get(identifier);

  if (!currentEntry) {
    // Primera solicitud
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    });
    return {
      success: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs
    };
  }

  if (currentEntry.count >= maxRequests) {
    // Límite excedido
    return {
      success: false,
      remaining: 0,
      resetTime: currentEntry.resetTime
    };
  }

  // Incrementar contador
  currentEntry.count++;
  rateLimitMap.set(identifier, currentEntry);

  return {
    success: true,
    remaining: maxRequests - currentEntry.count,
    resetTime: currentEntry.resetTime
  };
}

export function getClientIP(request: Request): string {
  // Intentar obtener IP real del cliente
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