import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function verifyAdminAuth(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('sessionToken')?.value;
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    const { userId, role } = payload as any;

    if (!userId || (role !== 'MASTER' && role !== 'MARKETING')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, isActive: true }
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Usuario inválido' }, { status: 401 });
    }

    return { user, error: null };
  } catch (error) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}