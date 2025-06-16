// src/app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'tu-secreto-super-secreto');

export async function GET() {
  // Se accede a las cookies de la forma correcta
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('sessionToken')?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    return NextResponse.json({ email: payload.email, role: payload.role });
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}
