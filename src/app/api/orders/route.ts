//src/app/api/orders/route.ts

import { Prisma, Product } from '@prisma/client';
import { NextResponse } from 'next/server';
import { sendNewOrderNotification } from '@/lib/whatsapp';
import { prisma } from '@/lib/prisma';
import { logError, logInfo } from '@/lib/logger';
import { sanitizeText, isValidEmail, isValidPhoneNumber } from '@/lib/sanitizer';
import { rateLimit, getClientIP } from '@/lib/rate-limit';

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
    // Rate limiting por IP
    const clientIP = getClientIP(request);
    const rateLimitResult = rateLimit(`orders:${clientIP}`, 10, 300000); // 10 pedidos por 5 minutos
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' },
        { status: 429 }
      );
    }

    // 2. Obtenemos todos los datos del cuerpo de la petición
    const { customerData, items, paymentMethod, shippingZone, shippingCost, total }: RequestBody = await request.json();
    
    // Validar y sanitizar datos del cliente
    if (!customerData.name || !customerData.email || !customerData.phone) {
      return NextResponse.json({ error: "Datos del cliente incompletos." }, { status: 400 });
    }
    
    const sanitizedCustomerData = {
      name: sanitizeText(customerData.name),
      email: sanitizeText(customerData.email),
      address: sanitizeText(customerData.address),
      identityCard: sanitizeText(customerData.identityCard),
      phone: sanitizeText(customerData.phone),
      instagram: customerData.instagram ? sanitizeText(customerData.instagram) : undefined
    };
    
    // Validaciones adicionales
    if (!isValidEmail(sanitizedCustomerData.email)) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    }
    
    if (!isValidPhoneNumber(sanitizedCustomerData.phone)) {
      return NextResponse.json({ error: "Número de teléfono inválido." }, { status: 400 });
    }

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

    // Recalcular total en servidor para prevenir manipulación
    let calculatedTotal = shippingCost;
    for (const item of items) {
      const product = productMap.get(item.id);
      if (!product) {
        throw new Error(`Producto con ID ${item.id} no encontrado.`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para el producto: ${product.name}`);
      }
      
      // Usar precio de oferta si está activo, sino precio normal
      const now = new Date();
      const effectivePrice = product.isOfferActive && 
                            product.offerPriceUSD && 
                            product.offerEndsAt && 
                            product.offerEndsAt > now
                            ? product.offerPriceUSD 
                            : product.priceUSD;
      
      calculatedTotal += effectivePrice * item.quantity;
    }
    
    // Verificar que el total enviado coincida con el calculado (tolerancia de $0.01)
    if (Math.abs(total - calculatedTotal) > 0.01) {
      return NextResponse.json({ error: "Total inválido." }, { status: 400 });
    }

    const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const newOrder = await tx.order.create({
        data: {
          customerName: sanitizedCustomerData.name,
          customerEmail: sanitizedCustomerData.email,
          address: sanitizedCustomerData.address,
          total: calculatedTotal, 
          identityCard: sanitizedCustomerData.identityCard,
          phone: sanitizedCustomerData.phone,
          instagram: sanitizedCustomerData.instagram,
          paymentMethod: sanitizeText(paymentMethod),
          shippingZoneIdentifier: sanitizeText(shippingZone),
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

    // Generar notificación WhatsApp para el administrador
    try {
      const orderItems = items.map(item => {
        const product = productMap.get(item.id);
        return {
          name: product?.name || 'Producto',
          quantity: item.quantity,
          price: item.price
        };
      });

      const whatsappURL = sendNewOrderNotification(
        order.id,
        customerData.name,
        customerData.email,
        customerData.phone,
        total,
        orderItems
      );

      logInfo('WhatsApp notification generated for order', order.id);
    } catch (whatsappError) {
      logError('Error generando notificación WhatsApp', whatsappError);
      // No fallar el pedido por error de WhatsApp
    }

    return NextResponse.json({ ...order, whatsappURL: sendNewOrderNotification(
      order.id,
      customerData.name,
      customerData.email,
      customerData.phone,
      total,
      items.map(item => {
        const product = productMap.get(item.id);
        return {
          name: product?.name || 'Producto',
          quantity: item.quantity,
          price: item.price
        };
      })
    ) }, { status: 201 });

  } catch (error) {
    logError('Error al crear el pedido', error);
    return NextResponse.json({ error: "No se pudo crear el pedido." }, { status: 500 });
  }
}