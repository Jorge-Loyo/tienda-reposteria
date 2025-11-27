import { NextRequest, NextResponse } from 'next/server';
import db from '@/db/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, imageUrl } = await request.json();
    const id = parseInt(params.id);

    if (!name?.trim()) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
    }

    const category = await db.category.update({
      where: { id },
      data: {
        name: name.trim(),
        imageUrl: imageUrl || null,
        icon: imageUrl || null, // Guardar el emoji en el campo icon
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Error al actualizar categoría' }, { status: 500 });
  }
}