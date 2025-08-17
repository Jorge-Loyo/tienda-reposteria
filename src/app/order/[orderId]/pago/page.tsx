//src/app/order/[orderId]/pago/page.tsx

import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getBcvRate, formatToVes } from '@/lib/currency';
import OrderReceipt from '@/components/OrderReceipt';

const prisma = new PrismaClient();

// --- Componentes para cada método de pago (sin cambios) ---
function ZelleInstructions() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Instrucciones para Zelle</h2>
      <p className="mb-4">Por favor, realiza la transferencia a la siguiente cuenta y envía el comprobante a nuestro WhatsApp.</p>
      <div className="bg-gray-100 p-4 rounded-md space-y-1">
        <p><strong>Correo:</strong> Casadulceoriente@gmail.com</p>
        <p><strong>Nombre:</strong> CASA DULCE ORIENTE, LLC</p>
      </div>
    </div>
  );
}

function BanescoInstructions() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Instrucciones para Banesco</h2>
      <p className="mb-4">Por favor, realiza la transferencia a la siguiente cuenta y envía el comprobante a nuestro WhatsApp.</p>
      <div className="bg-gray-100 p-4 rounded-md space-y-1">
        <p><strong>Banco:</strong> Banesco</p>
        <p><strong>RIF:</strong> J-502235345</p>
        <p><strong>Teléfono:</strong> 0424-8536954</p>
        <p><strong>Nombre:</strong> COMERCIALIZADORA CASA DULCE ORIENTE</p>
      </div>
    </div>
  );
}

function BDVInstructions() {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">Instrucciones para Banco de Venezuela</h2>
        <p className="mb-4">Por favor, realiza la transferencia a la siguiente cuenta y envía el comprobante a nuestro WhatsApp.</p>
        <div className="bg-gray-100 p-4 rounded-md space-y-1">
          <p><strong>Banco:</strong> Banco de Venezuela</p>
          <p><strong>RIF:</strong> J-502235345</p>
          <p><strong>Teléfono:</strong> 0424-8536954</p>
          <p><strong>Nombre:</strong> COMERCIALIZADORA CASA DULCE ORIENTE</p>
        </div>
      </div>
    );
}

function CashInstructions() {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">Instrucciones para Pago en Efectivo</h2>
        <p className="mb-4">Tu pedido ha sido confirmado. Por favor, ten el monto exacto listo para cuando retires tu pedido o para el momento de la entrega.</p>
        <p>Si necesitas cambio, por favor contáctanos por WhatsApp para coordinar.</p>
      </div>
    );
}


// --- Página Principal ---
export default async function PaymentInstructionsPage({ params }: { params: { orderId: string } }) {
  const orderId = Number(params.orderId);
  if (isNaN(orderId)) {
    notFound();
  }

  // Se actualiza la consulta para incluir los detalles de los artículos del pedido
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            select: { name: true },
          },
        },
      },
    },
  });

  const bcvRate = await getBcvRate();

  if (!order) {
    notFound();
  }
  
  // ***** INICIO DE LA CORRECCIÓN *****

  // 1. Calcular el subtotal real sumando el precio de cada artículo por su cantidad.
  const subtotal = order.items.reduce((acc, item) => {
    return acc + (item.price * item.quantity);
  }, 0);

  // 2. Deducir el costo de envío. Como el `order.total` es el gran total (subtotal + envío),
  //    podemos calcular el envío restando el subtotal que acabamos de calcular.
  //    Esto soluciona el problema si `shippingCost` no se guarda correctamente en la base de datos.
  const shippingCost = order.total - subtotal;

  // 3. El total final es simplemente el `order.total` que ya viene de la base de datos.
  const total = order.total;

  // 4. Calcular el monto en Bolívares usando el total correcto.
  const totalVes = bcvRate ? total * bcvRate : null;

  // ***** FIN DE LA CORRECCIÓN *****

  let instructionsComponent;
  switch (order.paymentMethod) {
    case 'ZELLE':
      instructionsComponent = <ZelleInstructions />;
      break;
    case 'BANESCO':
      instructionsComponent = <BanescoInstructions />;
      break;
    case 'BDV':
        instructionsComponent = <BDVInstructions />;
        break;
    case 'EFECTIVO_USD':
    case 'EFECTIVO_BS':
        instructionsComponent = <CashInstructions />;
        break;
    default:
      instructionsComponent = <p>Método de pago no reconocido. Por favor, contáctanos.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-2xl font-bold mt-4">¡Gracias por tu pedido!</h1>
        <p className="text-gray-600 mt-2">Tu orden con el ID <span className="font-semibold">#{order.id}</span> ha sido recibida.</p>
        
        {/* Resumen de la Compra con desglose de envío */}
        <div className="text-left border-t my-6 pt-6">
            <h3 className="text-lg font-semibold mb-4">Resumen de tu Compra</h3>
            <ul className="space-y-2 text-sm">
                {order.items.map(item => (
                    <li key={item.id} className="flex justify-between">
                        <span className="text-gray-600">{item.product.name} x {item.quantity}</span>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                ))}
            </ul>
            <div className="border-t my-2"></div>
            <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                {/* Usar la variable subtotal calculada */}
                <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-gray-600">Envío</span>
                {/* Usar la variable shippingCost deducida */}
                <span className="font-medium">${shippingCost.toFixed(2)}</span>
            </div>
        </div>

        <div className="text-left border-t my-6 pt-6">
            <h3 className="text-lg font-semibold mb-2">Monto Total a Pagar</h3>
            <div className="bg-gray-50 p-4 rounded-md space-y-2">
                <div className="flex justify-between font-bold">
                    <span>Total (USD)</span>
                    {/* Usar la variable total (que es igual a order.total) */}
                    <span>${total.toFixed(2)}</span>
                </div>
                {totalVes && (
                    <div className="flex justify-between text-gray-600">
                        <span>Total Aprox. (Bs.)</span>
                        <span>{formatToVes(totalVes)}</span>
                    </div>
                )}
            </div>
        </div>

        <div className="text-left border-t my-6 pt-6">
            {instructionsComponent}
        </div>

        <p className="text-sm text-gray-500 mt-6">Recibirás una confirmación por correo electrónico en breve.</p>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
                <Link href="/">Volver a la tienda</Link>
            </Button>
            <OrderReceipt order={order} />
        </div>
      </div>
    </div>
  );
}