// src/app/api/products/[id]/route.ts
import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/logger';
import { sanitizeText } from '@/lib/sanitizer';
import { getSessionData } from '@/lib/session';

// Función para manejar la actualización de un producto (PUT)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verificar autenticación y permisos
    const session = await getSessionData();
    if (!session || !['ADMINISTRADOR', 'MASTER'].includes(session.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const productId = Number(params.id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: "ID de producto inválido." }, { status: 400 });
    }

    const data = await request.json();
    const updateData: any = {};
    
    // Construcción dinámica del objeto de actualización con sanitización
    if (data.name !== undefined) updateData.name = sanitizeText(data.name);
    if (data.description !== undefined) updateData.description = data.description ? sanitizeText(data.description) : null;
    if (data.priceUSD !== undefined) {
      const price = Number(data.priceUSD);
      if (isNaN(price) || price < 0) {
        return NextResponse.json({ error: "Precio inválido." }, { status: 400 });
      }
      updateData.priceUSD = price;
    }
    if (data.stock !== undefined) {
      const stock = Number(data.stock);
      if (isNaN(stock) || stock < 0) {
        return NextResponse.json({ error: "Stock inválido." }, { status: 400 });
      }
      updateData.stock = stock;
    }
    if (data.sku !== undefined) updateData.sku = data.sku ? sanitizeText(data.sku) : null;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl ? sanitizeText(data.imageUrl) : null;
    if (data.published !== undefined) updateData.published = Boolean(data.published);
    if (data.categoryId !== undefined) {
      const categoryId = Number(data.categoryId);
      if (isNaN(categoryId) || categoryId <= 0) {
        return NextResponse.json({ error: "ID de categoría inválido." }, { status: 400 });
      }
      updateData.categoryId = categoryId;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No se proporcionaron datos para actualizar." }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    logError('Error al actualizar el producto', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: "Producto no encontrado para actualizar." }, { status: 404 });
    }
    return NextResponse.json({ error: "Error interno del servidor al actualizar." }, { status: 500 });
  }
}

// Función para manejar la eliminación de un producto (DELETE)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verificar autenticación y permisos
    const session = await getSessionData();
    if (!session || !['ADMINISTRADOR', 'MASTER'].includes(session.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const productId = Number(params.id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: "ID de producto inválido." }, { status: 400 });
    }
    
    // --- MEJORA ---
    // Primero, eliminamos las líneas de pedido (OrderItems) asociadas a este producto.
    // Esto es crucial para evitar errores de restricción de clave externa en la base de datos.
    await prisma.orderItem.deleteMany({
        where: { productId: productId },
    });

    // Ahora sí, eliminamos el producto de forma segura.
    await prisma.product.delete({
      where: { id: productId }
    });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logError('Error al eliminar el producto', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: "Producto no encontrado para eliminar." }, { status: 404 });
    }
    return NextResponse.json({ error: "Error interno del servidor al eliminar." }, { status: 500 });
  }
}