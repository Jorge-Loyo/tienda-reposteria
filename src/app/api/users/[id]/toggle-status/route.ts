import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSessionData } from '@/lib/session';

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionData();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'ID de usuario inválido' }, { status: 400 });
    }

    // Obtener el usuario actual
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isActive: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Cambiar el estado
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Usuario ${!user.isActive ? 'habilitado' : 'deshabilitado'} exitosamente` 
    });

  } catch (error) {
    console.error('Error cambiando estado del usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}