// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Asegúrate de que la clave secreta aquí coincida con la de tu API de login y tu archivo .env
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'tu-secreto-super-secreto');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('sessionToken')?.value;

  // --- Caso 1: Usuario ya logueado intenta acceder a la página de login ---
  if (sessionToken && pathname.startsWith('/login')) {
    try {
      // Verificamos que el token sea válido
      await jwtVerify(sessionToken, JWT_SECRET);
      // Si es válido, lo redirigimos a su dashboard
      return NextResponse.redirect(new URL('/admin', request.url));
    } catch {
      // Si el token es inválido (expirado, etc.), dejamos que proceda a la página de login
      // para que pueda iniciar sesión de nuevo.
      return NextResponse.next();
    }
  }

  // --- Caso 2: Usuario NO logueado intenta acceder a rutas protegidas ---
  if (!sessionToken && pathname.startsWith('/admin')) {
    // Lo redirigimos a la página de login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // --- Caso 3: Usuario logueado intenta acceder a rutas protegidas ---
  if (sessionToken && pathname.startsWith('/admin')) {
    try {
      // Verificamos la validez del token
      const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
      const userRole = payload.role as string;
      
      // Aplicamos la lógica de roles
      // Si el usuario es de tipo 'ORDERS_USER' y no está en la página de pedidos, lo redirigimos.
      if (userRole === 'ORDERS_USER' && !pathname.startsWith('/admin/orders')) {
        return NextResponse.redirect(new URL('/admin/orders', request.url));
      }
      
      // Si es ADMIN o un ORDERS_USER en la página correcta, permitimos el acceso.
      return NextResponse.next();
      
    } catch {
      // Si el token es inválido, lo borramos y redirigimos al login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.set('sessionToken', '', { maxAge: -1 }); // Borra la cookie inválida
      return response;
    }
  }

  // Para cualquier otro caso (ej: usuario no logueado yendo a /login), permitimos el acceso.
  return NextResponse.next();
}

// El 'matcher' se mantiene igual, protege las rutas correctas.
export const config = {
  matcher: ['/admin/:path*', '/login'],
};