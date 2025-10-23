import { NextRequest, NextResponse } from 'next/server';
import db from '@/db/db';

export async function POST(request: NextRequest) {
  try {
    const { name, imageUrl } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
    }

    const category = await db.category.create({
      data: {
        name: name.trim(),
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Error al crear categoría' }, { status: 500 });
  }
}