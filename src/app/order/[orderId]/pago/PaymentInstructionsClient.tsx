'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatToVes } from '@/lib/currency';
import OrderReceipt from '@/components/OrderReceipt';
import { showToast, ToastContainer } from '@/components/ui/toast';

function ZelleInstructions({ order }: { order: any }) {
  const [receiptNumber, setReceiptNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReceipt = async () => {
    if (!receiptNumber.trim()) {
      showToast('Por favor ingrese el número de comprobante', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders/receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId: order.id, 
          receiptNumber: receiptNumber.trim(),
          paymentMethod: 'ZELLE'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.whatsappURL) {
          window.open(data.whatsappURL, '_blank');
        }
        showToast('Comprobante enviado exitosamente', 'success');
        setReceiptNumber('');
      } else {
        throw new Error('Error al enviar comprobante');
      }
    } catch (error) {
      showToast('Error al enviar el comprobante', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Instrucciones para Zelle</h2>
      <p className="mb-4">Por favor, realiza la transferencia a la siguiente cuenta y envía el comprobante a nuestro WhatsApp.</p>
      <div className="bg-gray-100 p-4 rounded-md space-y-1 mb-4">
        <p><strong>Correo:</strong> Casadulceoriente@gmail.com</p>
        <p><strong>Nombre:</strong> CASA DULCE ORIENTE, LLC</p>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
        <h3 className="font-semibold mb-3">Confirmar Pago</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Comprobante
            </label>
            <input
              type="text"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              placeholder="Ingrese número de comprobante"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSubmitReceipt}
            disabled={isSubmitting || !receiptNumber.trim()}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Comprobante por WhatsApp'}
          </button>
        </div>
      </div>
    </div>
  );
}

function BanescoInstructions({ order }: { order: any }) {
  const [receiptNumber, setReceiptNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReceipt = async () => {
    if (!receiptNumber.trim()) {
      showToast('Por favor ingrese el número de comprobante', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders/receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId: order.id, 
          receiptNumber: receiptNumber.trim(),
          paymentMethod: 'BANESCO'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.whatsappURL) {
          window.open(data.whatsappURL, '_blank');
        }
        showToast('Comprobante enviado exitosamente', 'success');
        setReceiptNumber('');
      } else {
        throw new Error('Error al enviar comprobante');
      }
    } catch (error) {
      showToast('Error al enviar el comprobante', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Instrucciones para Banesco</h2>
      <p className="mb-4">Por favor, realiza la transferencia a la siguiente cuenta y envía el comprobante a nuestro WhatsApp.</p>
      <div className="bg-gray-100 p-4 rounded-md space-y-1 mb-4">
        <p><strong>Banco:</strong> Banesco</p>
        <p><strong>RIF:</strong> J-502235345</p>
        <p><strong>Teléfono:</strong> 0424-8536954</p>
        <p><strong>Nombre:</strong> COMERCIALIZADORA CASA DULCE ORIENTE</p>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
        <h3 className="font-semibold mb-3">Confirmar Pago</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Comprobante
            </label>
            <input
              type="text"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              placeholder="Ingrese número de comprobante"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSubmitReceipt}
            disabled={isSubmitting || !receiptNumber.trim()}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Comprobante por WhatsApp'}
          </button>
        </div>
      </div>
    </div>
  );
}

function BDVInstructions({ order }: { order: any }) {
  const [receiptNumber, setReceiptNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReceipt = async () => {
    if (!receiptNumber.trim()) {
      showToast('Por favor ingrese el número de comprobante', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders/receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId: order.id, 
          receiptNumber: receiptNumber.trim(),
          paymentMethod: 'BDV'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.whatsappURL) {
          window.open(data.whatsappURL, '_blank');
        }
        showToast('Comprobante enviado exitosamente', 'success');
        setReceiptNumber('');
      } else {
        throw new Error('Error al enviar comprobante');
      }
    } catch (error) {
      showToast('Error al enviar el comprobante', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Instrucciones para Banco de Venezuela</h2>
      <p className="mb-4">Por favor, realiza la transferencia a la siguiente cuenta y envía el comprobante a nuestro WhatsApp.</p>
      <div className="bg-gray-100 p-4 rounded-md space-y-1 mb-4">
        <p><strong>Banco:</strong> Banco de Venezuela</p>
        <p><strong>RIF:</strong> J-502235345</p>
        <p><strong>Teléfono:</strong> 0424-8536954</p>
        <p><strong>Nombre:</strong> COMERCIALIZADORA CASA DULCE ORIENTE</p>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
        <h3 className="font-semibold mb-3">Confirmar Pago</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Comprobante
            </label>
            <input
              type="text"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              placeholder="Ingrese número de comprobante"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSubmitReceipt}
            disabled={isSubmitting || !receiptNumber.trim()}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Comprobante por WhatsApp'}
          </button>
        </div>
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

export default function PaymentInstructionsClient({ order, bcvRate }: { order: any, bcvRate: number | null }) {
  const subtotal = order.items.reduce((acc: number, item: any) => {
    return acc + (item.price * item.quantity);
  }, 0);

  const shippingCost = order.total - subtotal;
  const total = order.total;
  const totalVes = bcvRate ? total * bcvRate : null;

  let instructionsComponent;
  switch (order.paymentMethod) {
    case 'ZELLE':
      instructionsComponent = <ZelleInstructions order={order} />;
      break;
    case 'BANESCO':
      instructionsComponent = <BanescoInstructions order={order} />;
      break;
    case 'BDV':
      instructionsComponent = <BDVInstructions order={order} />;
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
        
        <div className="text-left border-t my-6 pt-6">
          <h3 className="text-lg font-semibold mb-4">Resumen de tu Compra</h3>
          <ul className="space-y-2 text-sm">
            {order.items.map((item: any) => (
              <li key={item.id} className="flex justify-between">
                <span className="text-gray-600">{item.product.name} x {item.quantity}</span>
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t my-2"></div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Envío</span>
            <span className="font-medium">${shippingCost.toFixed(2)}</span>
          </div>
        </div>

        <div className="text-left border-t my-6 pt-6">
          <h3 className="text-lg font-semibold mb-2">Monto Total a Pagar</h3>
          <div className="bg-gray-50 p-4 rounded-md space-y-2">
            <div className="flex justify-between font-bold">
              <span>Total (USD)</span>
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
      <ToastContainer />
    </div>
  );
}