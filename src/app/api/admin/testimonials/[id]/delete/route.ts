import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdminAuth } from '@/lib/auth-middleware';

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await verifyAdminAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const id = parseInt(params.id);
    
    await prisma.testimonial.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Testimonio eliminado' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar testimonio' }, { status: 500 });
  }
}