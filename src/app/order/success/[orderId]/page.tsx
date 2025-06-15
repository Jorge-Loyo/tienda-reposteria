// src/app/order/success/[orderId]/page.tsx
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

async function getOrder(id: number) {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) notFound();
  return order;
}

export default async function OrderSuccessPage({ params }: { params: { orderId: string } }) {
  const orderId = Number(params.orderId);
  if (isNaN(orderId)) notFound();
  const order = await getOrder(orderId);
  
  return (
    <div className="text-center py-20 max-w-2xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-green-600 mb-4">¡Gracias por tu compra!</h1>
      <p className="text-gray-700">Tu pedido con ID <span className="font-bold">#{order.id}</span> ha sido recibido.</p>
      <p className="mt-2 text-gray-600">Recibirás un correo electrónico de confirmación en <span className="font-bold">{order.customerEmail}</span>.</p>
      <div className="mt-8 p-6 bg-gray-100 rounded-lg text-left">
        <h2 className="text-lg font-semibold mb-2">Instrucciones de Pago</h2>
        <p className="text-sm text-gray-800">
          Para completar tu pedido, por favor realiza una transferencia bancaria a la siguiente cuenta:
          <br />
          - <strong>Banco:</strong> [Nombre de tu Banco]
          <br />
          - <strong>CBU/Alias:</strong> [Tu CBU o Alias]
          <br />
          - <strong>Titular:</strong> [Nombre del Titular de la Cuenta]
          <br />
          - <strong>Monto Total:</strong> <span className="font-bold">${order.total.toFixed(2)} USD</span>
          <br /><br />
          Una vez realizado el pago, envía el comprobante a nuestro WhatsApp o correo para que validemos tu pedido.
        </p>
      </div>
    </div>
  );
}