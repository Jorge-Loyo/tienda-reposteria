//src/app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify, JWTPayload } from 'jose';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Función para sanitizar datos de salida
function sanitizeUserData(user: any) {
  return {
    name: user.name?.toString().replace(/[<>"'&]/g, '') || '',
    email: user.email?.toString().replace(/[<>"'&]/g, '') || '',
    role: user.role?.toString().replace(/[<>"'&]/g, '') || '',
    instagram: user.instagram?.toString().replace(/[<>"'&]/g, '') || '',
    phoneNumber: user.phoneNumber?.toString().replace(/[<>"'&]/g, '') || '',
    address: user.address?.toString().replace(/[<>"'&]/g, '') || '',
    identityCard: user.identityCard?.toString().replace(/[<>"'&]/g, '') || ''
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
    console.error('Error en /api/auth/me:', error instanceof Error ? error.message : 'Error desconocido');
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
