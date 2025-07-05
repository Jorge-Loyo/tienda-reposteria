import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify, JWTPayload } from 'jose';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'tu-secreto-super-secreto');

interface CustomJwtPayload extends JWTPayload {
  userId: number;
  email: string;
  role: string;
}

export async function GET() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('sessionToken')?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    const { userId } = payload as CustomJwtPayload;

    // CORRECCIÓN: Se añaden los campos faltantes a la consulta
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        role: true,
        instagram: true,
        phoneNumber: true,
        address: true,
      }
    });

    if (!user) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Ahora la respuesta incluye todos los datos del perfil
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}