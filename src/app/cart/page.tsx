// src/app/cart/page.tsx
'use client';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity } = useCartStore();
  const router = useRouter();
  const total = items.reduce((acc, item) => acc + item.priceUSD * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-20 min-h-[calc(100vh-128px)] flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
        <p className="text-gray-600 mb-8">Parece que aún no has agregado productos.</p>
        <Link href="/tienda" className="bg-indigo-600 text-white font-bold py-3 px-6 rounded hover:bg-indigo-700 transition-colors">Ir a la tienda</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center mb-10">Tu Carrito de Compras</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ul role="list" className="divide-y divide-gray-200 border-t border-b border-gray-200">
            {items.map((product) => (
              <li key={product.id} className="flex py-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <Image src={product.imageUrl || '/placeholder.png'} alt={product.name} width={96} height={96} className="h-full w-full object-cover object-center" />
                </div>
                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900"><h3>{product.name}</h3><p className="ml-4">${(product.priceUSD * product.quantity).toFixed(2)}</p></div>
                    <p className="mt-1 text-sm text-gray-500">${product.priceUSD.toFixed(2)} c/u</p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button onClick={() => updateQuantity(product.id, product.quantity - 1)} className="px-3 py-1">-</button>
                      <span className="px-4 py-1">{product.quantity}</span>
                      <button onClick={() => updateQuantity(product.id, product.quantity + 1)} className="px-3 py-1">+</button>
                    </div>
                    <div className="flex"><button type="button" onClick={() => removeFromCart(product.id)} className="font-medium text-indigo-600 hover:text-indigo-500">Eliminar</button></div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-1">
          <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Resumen del Pedido</h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between"><p className="text-sm text-gray-600">Subtotal</p><p className="text-sm font-medium text-gray-900">${total.toFixed(2)}</p></div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4"><p className="text-base font-medium text-gray-900">Total del Pedido</p><p className="text-base font-medium text-gray-900">${total.toFixed(2)}</p></div>
            </div>
            <div className="mt-6"><button onClick={() => router.push('/checkout')} className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Ir a Pagar</button></div>
          </div>
        </div>
      </div>
    </div>
  );
}