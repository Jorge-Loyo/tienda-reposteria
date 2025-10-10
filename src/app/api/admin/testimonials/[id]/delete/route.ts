import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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