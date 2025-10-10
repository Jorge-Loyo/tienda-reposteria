import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Configurar headers de seguridad
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy mejorado
  const csp = [
    "default-src 'self'",
    "script-src 'self' https://maps.googleapis.com",
    "style-src 'self' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.cloudinary.com https://maps.googleapis.com https://nominatim.openstreetmap.org",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'"
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);

  // Rate limiting básico para rutas sensibles
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith('/api/auth/') || pathname.startsWith('/api/orders') || pathname.startsWith('/api/admin/')) {
    // Los rate limits específicos se manejan en cada endpoint
    response.headers.set('X-RateLimit-Policy', 'active');
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};