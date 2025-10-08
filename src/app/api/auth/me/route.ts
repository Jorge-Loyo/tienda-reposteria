//src/app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify, JWTPayload } from 'jose';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/logger';
import { sanitizeText } from '@/lib/sanitizer';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Función para sanitizar datos de salida
function sanitizeUserData(user: any) {
  return {
    name: user.name ? sanitizeText(user.name) : '',
    email: user.email ? sanitizeText(user.email) : '',
    role: user.role ? sanitizeText(user.role) : '',
    instagram: user.instagram ? sanitizeText(user.instagram) : '',
    phoneNumber: user.phoneNumber ? sanitizeText(user.phoneNumber) : '',
    address: user.address ? sanitizeText(user.address) : '',
    identityCard: user.identityCard ? sanitizeText(user.identityCard) : ''
  };
}

interface CustomJwtPayload extends JWTPayload {
  userId: number;
  email: string;
  role: string;
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('sessionToken')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    const { userId } = payload as CustomJwtPayload;

    if (!userId || typeof userId !== 'number') {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        role: true,
        instagram: true,
        phoneNumber: true,
        address: true,
        identityCard: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Sanitizar datos antes de enviar
    const sanitizedUser = sanitizeUserData(user);
    return NextResponse.json(sanitizedUser);
  } catch (error) {
    logError('Error en /api/auth/me', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
