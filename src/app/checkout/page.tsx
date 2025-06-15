// src/app/checkout/page.tsx
'use client';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  const [customerData, setCustomerData] = useState({ name: '', email: '', address: '' });
  const [isLoading, setIsLoading] = useState(false);

  const total = items.reduce((acc, item) => acc + item.priceUSD * item.quantity, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomerData({ ...customerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerData, items }),
      });
      const order = await response.json();
      if (!response.ok) {
        throw new Error(order.error || 'Error al crear el pedido');
      }
      clearCart();
      router.push(`/order/success/${order.id}`);
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0 && !isLoading) {
    return <div className="text-center py-20"><h1 className="text-xl">Tu carrito está vacío. No puedes proceder al pago.</h1></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-10">Finalizar Compra</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Tus Datos</h2>
          <div><label htmlFor="name" className="block text-sm font-medium">Nombre Completo</label><input type="text" name="name" id="name" required onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
          <div><label htmlFor="email" className="block text-sm font-medium">Correo Electrónico</label><input type="email" name="email" id="email" required onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
          <div><label htmlFor="address" className="block text-sm font-medium">Dirección de Envío</label><textarea name="address" id="address" required onChange={handleChange} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Resumen de tu Pedido</h2>
          <div className="mt-4 space-y-2">
            {items.map(item => ( <div key={item.id} className="flex justify-between text-sm"><span>{item.name} x {item.quantity}</span><span>${(item.priceUSD * item.quantity).toFixed(2)}</span></div> ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <button type="submit" disabled={isLoading} className="mt-6 w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded hover:bg-indigo-700 disabled:bg-gray-400">{isLoading ? 'Procesando...' : 'Realizar Pedido'}</button>
        </div>
      </form>
    </div>
  );
}