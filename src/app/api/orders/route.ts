//src/app/api/orders/route.ts

import { PrismaClient, Prisma, Product } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

interface CartItem {
  id: number;
  quantity: number;
  price: number; // El precio ya puede ser el de oferta
}

interface CustomerData {
  name: string;
  email: string;
  address: string;
  identityCard: string;
  phone: string;
  instagram?: string;
}

// 1. La petición ahora recibe el resumen completo del pedido
interface RequestBody {
    customerData: CustomerData;
    items: CartItem[];
    paymentMethod: string;
    shippingZone: string;
    shippingCost: number;
    total: number; // Este es el 'grandTotal' que incluye el envío
}

export async function POST(request: Request) {
  try {
    // 2. Obtenemos todos los datos del cuerpo de la petición
    const { customerData, items, paymentMethod, shippingZone, shippingCost, total }: RequestBody = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
    }
    
    if (!paymentMethod) {
        return NextResponse.json({ error: "El método de pago es requerido." }, { status: 400 });
    }
    
    if (!shippingZone) {
        return NextResponse.json({ error: "La zona de envío es requerida." }, { status: 400 });
    }

    const productIds = items.map((item) => item.id);
    
    const productsInDb = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(productsInDb.map((p: Product) => [p.id, p]));

    // Verificación de stock (la lógica de cálculo de total se elimina de aquí)
    for (const item of items) {
      const product = productMap.get(item.id);
      if (!product) {
        throw new Error(`Producto con ID ${item.id} no encontrado.`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para el producto: ${product.name}`);
      }
    }

    const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const newOrder = await tx.order.create({
        data: {
          customerName: customerData.name,
          customerEmail: customerData.email,
          address: customerData.address,
          // 3. Usamos el 'total' final recibido desde el checkout
          total: total, 
          identityCard: customerData.identityCard,
          phone: customerData.phone,
          instagram: customerData.instagram,
          paymentMethod: paymentMethod,
          shippingZoneIdentifier: shippingZone, // Guardamos la zona de envío
        },
      });

      await tx.orderItem.createMany({
        data: items.map((item: CartItem) => {
          return {
            orderId: newOrder.id,
            productId: item.id,
            quantity: item.quantity,
            // Guardamos el precio unitario con el que se hizo la compra (puede ser de oferta)
            price: item.price, 
          };
        }),
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
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