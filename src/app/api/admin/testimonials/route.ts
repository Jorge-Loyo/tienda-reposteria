import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(testimonials);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}