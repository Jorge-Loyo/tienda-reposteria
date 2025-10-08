import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { orderId, receiptNumber, paymentMethod } = await request.json();

    if (!orderId || !receiptNumber) {
      return NextResponse.json({ error: 'Datos requeridos faltantes' }, { status: 400 });
    }

    // Obtener información del pedido
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: {
        items: {
          include: {
            product: {
              select: { name: true }
            }
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    // Crear mensaje de WhatsApp con información del pedido
    const itemsList = order.items.map(item => 
      `• ${item.product.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    // Mapeo de métodos de pago
    const paymentMethodNames: { [key: string]: string } = {
      'ZELLE': 'Transferencia Zelle',
      'BANESCO': 'Transferencia Banesco', 
      'BDV': 'Banco de Venezuela'
    };

    const message = `🧾 *COMPROBANTE DE PAGO RECIBIDO*

📋 *Pedido:* #${order.id}
💳 *Número de Comprobante:* ${receiptNumber}
👤 *Cliente:* ${order.customerName}
📧 *Email:* ${order.customerEmail}
📱 *Teléfono:* ${order.phone || 'No especificado'}

🛍️ *Productos:*
${itemsList}

💰 *Total:* $${order.total.toFixed(2)}
🏦 *Método de Pago:* ${paymentMethodNames[paymentMethod] || order.paymentMethod}

📍 *Dirección de Entrega:*
${order.address || 'No especificada'}

✅ El cliente ha reportado el pago con el comprobante: *${receiptNumber}*`;

    // Actualizar el pedido con el número de comprobante
    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { receiptNumber: receiptNumber.trim() }
    });

    const whatsappURL = `https://wa.me/584248536954?text=${encodeURIComponent(message)}`;

    return NextResponse.json({ 
      success: true, 
      whatsappURL,
      message: 'Comprobante procesado exitosamente' 
    });

  } catch (error) {
    console.error('Error al procesar comprobante:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}