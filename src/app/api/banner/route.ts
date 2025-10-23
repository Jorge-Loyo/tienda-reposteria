import { NextRequest, NextResponse } from 'next/server';
import db from '@/db/db';

export async function POST(request: NextRequest) {
  try {
    const { title, alt, src, active } = await request.json();

    if (!alt || !src) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const banner = await db.banner.create({
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
    const banners = await db.banner.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ error: 'Error al obtener banners' }, { status: 500 });
  }
}