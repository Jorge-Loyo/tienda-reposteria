//src/components/OrderReceipt.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Order, OrderItem, Product } from '@prisma/client';

type OrderWithDetails = Order & {
    items: (OrderItem & {
        product: {
            name: string;
        };
    })[];
}

interface OrderReceiptProps {
  order: OrderWithDetails;
}

export default function OrderReceipt({ order }: OrderReceiptProps) {
  
  const generateAndDownloadReceipt = () => {
    // ***** INICIO DE LA CORRECCIÓN *****

    // 1. Calcular el subtotal real sumando el precio de cada artículo por su cantidad.
    const subtotal = order.items.reduce((acc, item) => {
        return acc + (item.price * item.quantity);
    }, 0);

    // 2. Deducir el costo de envío restando el subtotal del total general.
    const shippingCost = order.total - subtotal;

    // ***** FIN DE LA CORRECCIÓN *****

    let receiptContent = `COMPROBANTE DE PEDIDO - CASA DULCE ORIENTE\n`;
    receiptContent += `(Esto no es una factura fiscal)\n`;
    receiptContent += `----------------------------------------\n\n`;
    receiptContent += `ID del Pedido: #${order.id}\n`;
    receiptContent += `Fecha: ${new Date(order.createdAt).toLocaleDateString()}\n`;
    receiptContent += `Cliente: ${order.customerName}\n`;
    receiptContent += `Email: ${order.customerEmail}\n\n`;
    receiptContent += `--- Artículos ---\n`;
    
    order.items.forEach(item => {
        const itemSubtotal = (item.price * item.quantity).toFixed(2);
        receiptContent += `${item.product.name} (x${item.quantity}) - $${itemSubtotal}\n`;
    });

    receiptContent += `\n----------------------------------------\n`;
    // Usar las variables calculadas para el comprobante
    receiptContent += `Subtotal: $${subtotal.toFixed(2)}\n`;
    receiptContent += `Envío: $${shippingCost.toFixed(2)}\n`;
    receiptContent += `TOTAL A PAGAR: $${order.total.toFixed(2)}\n`;
    receiptContent += `----------------------------------------\n\n`;
    receiptContent += `¡Gracias por tu compra!`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `comprobante_pedido_${order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" onClick={generateAndDownloadReceipt}>
      Descargar Comprobante
    </Button>
  );
}
