import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdminAuth } from '@/lib/auth-middleware';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const authResult = await verifyAdminAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(testimonials);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener testimonios' }, { status: 500 });
  }
}