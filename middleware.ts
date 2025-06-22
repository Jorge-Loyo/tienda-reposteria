// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// La clave debe ser la misma que usas para firmar el token en la API de login y tu archivo .env
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET as string);

/**
 * Función para verificar la validez de un token JWT.
 * Devuelve el payload del token si es válido, o null si es inválido.
 */
async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch { // --- CORRECCIÓN: Se omite el parámetro 'error' ya que no se usa.
    // Si el token no se puede verificar (expirado, malformado, etc.), devuelve null.
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('sessionToken')?.value;

  // --- Caso 1: Usuario intenta acceder a rutas de ADMIN ---
  if (pathname.startsWith('/admin')) {
    // Si NO tiene token, es redirigido inmediatamente al login.
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Si tiene un token, lo verificamos.
    const payload = await verifyToken(sessionToken);

    // Si el token es inválido (o nulo), lo redirigimos al login y borramos la cookie mala.
    if (!payload) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('sessionToken');
      return response;
    }

    // Si el token es válido, aplicamos la lógica de roles.
    const userRole = payload.role as string;
    if (userRole === 'ORDERS_USER' && !pathname.startsWith('/admin/orders')) {
      // Si es un usuario de "pedidos" e intenta ir a otro sitio, lo forzamos a ir a /admin/orders.
      return NextResponse.redirect(new URL('/admin/orders', request.url));
    }

    // Si es ADMIN, o un usuario de pedidos en la ruta correcta, lo dejamos pasar.
    return NextResponse.next();
  }

  // --- Caso 2: Usuario intenta acceder a la PÁGINA DE LOGIN ---
  if (pathname.startsWith('/login')) {
    // Si tiene un token válido, ya no debería estar aquí. Lo redirigimos al admin.
    if (sessionToken && (await verifyToken(sessionToken))) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // Para cualquier otro caso (rutas públicas o usuario sin token yendo a /login), permitimos el acceso.
  return NextResponse.next();
}

// El 'matcher' se mantiene igual, protege las rutas correctas.
export const config = {
  matcher: ['/admin/:path*', '/login'],
};