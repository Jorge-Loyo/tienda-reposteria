import { PrismaClient, Prisma, Product } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

interface CartItem {
  id: number;
  quantity: number;
}

interface CustomerData {
  name: string;
  email: string;
  address: string;
  identityCard: string;
  phone: string;
  instagram?: string;
}

// La petición ahora también recibirá el método de pago
interface RequestBody {
    customerData: CustomerData;
    items: CartItem[];
    paymentMethod: string;
}

export async function POST(request: Request) {
  try {
    const { customerData, items, paymentMethod }: RequestBody = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
    }
    
    if (!paymentMethod) {
        return NextResponse.json({ error: "El método de pago es requerido." }, { status: 400 });
    }

    const productIds = items.map((item) => item.id);
    
    const productsInDb = await prisma.product.findMany({
      where: { id: { in: productIds } },
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

    const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const newOrder = await tx.order.create({
        data: {
          customerName: customerData.name,
          customerEmail: customerData.email,
          address: customerData.address,
          total: total,
          identityCard: customerData.identityCard,
          phone: customerData.phone,
          instagram: customerData.instagram,
          paymentMethod: paymentMethod, // Guardamos el método de pago
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