// src/app/api/orders/[id]/route.ts
import { PrismaClient, Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

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
    if (data.receiptNumber) {
      updateData.receiptNumber = data.receiptNumber;
    }
    
    // Si se está confirmando el pago, obtener el usuario actual
    if (data.includeConfirmedBy && data.status === 'PAGADO') {
      try {
        const cookieStore = cookies();
        const sessionToken = cookieStore.get('sessionToken')?.value;
        
        if (sessionToken && process.env.JWT_SECRET) {
          const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET) as any;
          const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { name: true, email: true }
          });
          
          if (user) {
            updateData.confirmedBy = user.name || user.email;
          }
        }
      } catch (error) {
        console.error('Error al obtener usuario:', error);
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No se proporcionaron datos para actualizar." }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    // Si el pedido se marca como PAGADO, actualizar el contador de ventas
    if (data.status === 'PAGADO') {
      try {
        // Obtener los items del pedido
        const orderItems = await prisma.orderItem.findMany({
          where: { orderId: orderId },
          select: { productId: true, quantity: true }
        });

        // Actualizar el salesCount de cada producto
        for (const item of orderItems) {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              salesCount: {
                increment: item.quantity
              }
            }
          });
        }
      } catch (error) {
        console.error('Error al actualizar contador de ventas:', error);
        // No fallar la actualización del pedido por este error
      }
    }

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