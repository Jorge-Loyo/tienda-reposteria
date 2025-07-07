import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const prisma = new PrismaClient();

// --- Componentes para cada método de pago ---

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
          <p><strong>Nombre:</strong> MERCIALIZADORA CASA DULCE ORIENTE</p>
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
          <p><strong>Nombre:</strong> MERCIALIZADORA CASA DULCE ORIENTE</p>
        </div>
      </div>
    );
}

function CashInstructions({ orderTotal }: { orderTotal: number }) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">Instrucciones para Pago en Efectivo</h2>
        <p className="mb-4">Tu pedido ha sido confirmado. Por favor, ten el monto exacto de <strong className="text-lg">${orderTotal.toFixed(2)}</strong> listo para cuando retires tu pedido o para el momento de la entrega.</p>
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

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    notFound();
  }
  
  // Decidimos qué componente de instrucciones mostrar
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
        instructionsComponent = <CashInstructions orderTotal={order.total} />;
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
        
        <div className="text-left border-t my-6 pt-6">
            {instructionsComponent}
        </div>

        <p className="text-sm text-gray-500 mt-6">Recibirás una confirmación por correo electrónico en breve. Si tienes alguna pregunta, no dudes en contactarnos.</p>
        
        <Button asChild className="mt-6">
            <Link href="/">Volver a la tienda</Link>
        </Button>
      </div>
    </div>
  );
}
