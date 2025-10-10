import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { approved } = await request.json();
    const id = parseInt(params.id);

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: { approved }
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar testimonio' }, { status: 500 });
  }
}