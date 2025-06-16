// src/app/api/orders/[id]/route.ts
import { PrismaClient, Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Esta función maneja las peticiones PUT para actualizar un pedido
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = Number(params.id);
    if (isNaN(orderId)) {
      return NextResponse.json({ error: "ID de pedido inválido." }, { status: 400 });
    }

    const data = await request.json();

    // Creamos un objeto de actualización dinámico para que solo actualice
    // los campos que se envían en la petición.
    const updateData: any = {};
    if (data.status) {
      updateData.status = data.status;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No se proporcionaron datos para actualizar." }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    return NextResponse.json(updatedOrder);

  } catch (error) {
    console.error("Error al actualizar el pedido:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: "Pedido no encontrado para actualizar." }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}