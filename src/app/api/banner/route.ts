import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { title, alt, src, active } = await request.json();

    if (!alt || !src) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        alt,
        src,
        active,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json({ error: 'Error al crear banner' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ error: 'Error al obtener banners' }, { status: 500 });
  }
}