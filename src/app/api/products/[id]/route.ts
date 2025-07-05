// src/app/api/products/[id]/route.ts
import { PrismaClient, Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Función para manejar la actualización de un producto (PUT)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const productId = Number(params.id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: "ID de producto inválido." }, { status: 400 });
    }

    const data = await request.json();
    const updateData: any = {};
    
    // Construcción dinámica del objeto de actualización
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.priceUSD !== undefined) updateData.priceUSD = data.priceUSD;
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.sku !== undefined) updateData.sku = data.sku;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.published !== undefined) updateData.published = data.published;
    // --- NUEVO ---
    // Se añade el categoryId al objeto de actualización si está presente
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No se proporcionaron datos para actualizar." }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: "Producto no encontrado para actualizar." }, { status: 404 });
    }
    return NextResponse.json({ error: "Error interno del servidor al actualizar." }, { status: 500 });
  }
}

// Función para manejar la eliminación de un producto (DELETE)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
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
    console.error("Error al eliminar el producto:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: "Producto no encontrado para eliminar." }, { status: 404 });
    }
    return NextResponse.json({ error: "Error interno del servidor al eliminar." }, { status: 500 });
  }
}