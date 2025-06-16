// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  // Para cerrar sesión, simplemente le decimos al navegador que la cookie
  // ha expirado en el pasado, lo que la elimina efectivamente.
  const cookie = serialize('sessionToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: -1, // Fecha en el pasado para expirar la cookie
    path: '/',
  });

  const response = NextResponse.json({ message: 'Cierre de sesión exitoso' });
  response.headers.set('Set-Cookie', cookie);
  return response;
}
