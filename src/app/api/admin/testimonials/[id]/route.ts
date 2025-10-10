import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdminAuth } from '@/lib/auth-middleware';

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await verifyAdminAuth(request);
  if (authResult instanceof NextResponse) return authResult;

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