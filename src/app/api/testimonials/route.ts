import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const testimonialSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  role: z.string().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'El comentario debe tener al menos 10 caracteres')
});

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(testimonials);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = testimonialSchema.parse(body);
    
    const testimonial = await prisma.testimonial.create({
      data: validatedData
    });
    
    return NextResponse.json({ message: 'Testimonio enviado para revisión', testimonial });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error al crear testimonio' }, { status: 500 });
  }
}