// src/app/api/orders/route.ts

import { PrismaClient, Prisma, Product } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Definimos interfaces claras para los datos que esperamos recibir
interface CartItem {
  id: number;
  quantity: number;
}

interface CustomerData {
  name: string;
  email: string;
  address: string;
}

export async function POST(request: Request) {
  try {
    // Usamos las interfaces para darle a TypeScript la información que necesita
    const { customerData, items }: { customerData: CustomerData; items: CartItem[] } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
    }

    const productIds = items.map((item) => item.id);
    
    const productsInDb = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    const productMap = new Map(productsInDb.map((p: Product) => [p.id, p]));

    let total = 0;
    for (const item of items) {
      const product = productMap.get(item.id);
      if (!product) {
        throw new Error(`Producto con ID ${item.id} no encontrado.`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para el producto: ${product.name}`);
      }
      total += product.priceUSD * item.quantity;
    }

    // Usamos el tipo 'Prisma.TransactionClient' para 'tx' para mayor seguridad
    const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const newOrder = await tx.order.create({
        data: {
          customerName: customerData.name,
          customerEmail: customerData.email,
          address: customerData.address,
          total: total,
        },
      });

      await tx.orderItem.createMany({
        data: items.map((item: CartItem) => {
          const product = productMap.get(item.id)!;
          return {
            orderId: newOrder.id,
            productId: item.id,
            quantity: item.quantity,
            price: product.priceUSD,
          };
        }),
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });

  } catch (error) {
    console.error("Error al crear el pedido:", error);
    const errorMessage = error instanceof Error ? error.message : "No se pudo crear el pedido.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
