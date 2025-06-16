// src/app/cart/page.tsx
'use client';

import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { formatToVes } from '@/lib/currency';
import { useCurrency } from '@/context/CurrencyContext'; // 1. Importamos nuestro nuevo hook

export default function CartPage() { // 2. Ya no necesita recibir props
  const { items, removeFromCart, updateQuantity } = useCartStore();
  const router = useRouter();
  const { bcvRate } = useCurrency(); // 3. Obtenemos la tasa desde el contexto

  const totalUsd = items.reduce((acc, item) => acc + (Number(item.priceUSD) || 0) * (Number(item.quantity) || 0), 0);
  const totalVes = bcvRate ? totalUsd * bcvRate : null;

  if (items.length === 0) {
    return (
      <div className="text-center py-20 min-h-[calc(100vh-128px)] flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
        <p className="text-gray-600 mb-8">Parece que aún no has agregado productos.</p>
        <Button asChild size="lg"><Link href="/tienda">Ir a la tienda</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center mb-10">Tu Carrito de Compras</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <ul role="list" className="divide-y divide-gray-200">
            {items.map((product) => {
              const subtotal = (Number(product.priceUSD) || 0) * (Number(product.quantity) || 0);
              return (
                <li key={product.id} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200"><Image src={product.imageUrl || '/placeholder.png'} alt={product.name} width={96} height={96} className="h-full w-full object-cover object-center" /></div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900"><h3>{product.name}</h3><p className="ml-4">${subtotal.toFixed(2)}</p></div>
                      <p className="mt-1 text-sm text-gray-500">${(Number(product.priceUSD) || 0).toFixed(2)} c/u</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center border border-gray-300 rounded"><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(product.id, product.quantity - 1)} disabled={product.quantity <= 1}>-</Button><span className="w-10 text-center">{product.quantity}</span><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(product.id, product.quantity + 1)}>+</Button></div>
                      <div className="flex"><Button variant="link" className="p-0 h-auto font-medium text-indigo-600 hover:text-indigo-500" onClick={() => removeFromCart(product.id)}>Eliminar</Button></div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="lg:col-span-1">
          <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-md">
            <h2 className="text-lg font-medium text-gray-900">Resumen del Pedido</h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between"><p className="text-sm text-gray-600">Subtotal</p><p className="text-sm font-medium text-gray-900">${totalUsd.toFixed(2)}</p></div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4"><p className="text-base font-medium text-gray-900">Total (USD)</p><p className="text-base font-medium text-gray-900">${totalUsd.toFixed(2)}</p></div>
              {totalVes && (<div className="flex items-center justify-between text-sm text-gray-600 pt-2"><p className="font-medium">Total (Bs.)</p><p className="font-medium">{formatToVes(totalVes)}</p></div>)}
            </div>
            <div className="mt-6"><Button onClick={() => router.push('/checkout')} className="w-full" size="lg">Ir a Pagar</Button></div>
          </div>
        </div>
      </div>
    </div>
  );
}