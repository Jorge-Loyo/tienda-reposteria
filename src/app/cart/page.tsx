'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { formatToVes } from '@/lib/currency';
import { useCurrency } from '@/context/CurrencyContext';

// --- Icono de Carga (Spinner) ---
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-20">
      <svg className="animate-spin h-8 w-8 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );
}

// --- Icono para el Carrito Vacío ---
function EmptyCartIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-16 w-16 mx-auto text-gray-300 mb-4">
            <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
    );
}

// --- Icono de Papelera para Eliminar ---
function TrashIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
    );
}


export default function CartPage() {
  const { items, removeFromCart, updateQuantity } = useCartStore();
  const router = useRouter();
  const { bcvRate } = useCurrency();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalUsd = items.reduce((acc, item) => acc + (Number(item.priceUSD) || 0) * (Number(item.quantity) || 0), 0);
  const totalVes = bcvRate ? totalUsd * bcvRate : null;

  if (!isClient) {
    return (
        <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center items-center">
            <LoadingSpinner />
            <p className="text-lg text-gray-600">Cargando tu carrito...</p>
        </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 min-h-[calc(100vh-200px)] flex flex-col justify-center items-center bg-gray-50">
        <EmptyCartIcon />
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Tu carrito está vacío</h1>
        <p className="text-gray-500 mb-8">Parece que aún no has agregado productos.</p>
        <Button asChild size="lg"><Link href="/tienda">Explorar la tienda</Link></Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 text-center mb-12">Tu Carrito de Compras</h1>
            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                {/* Lista de Productos */}
                <section aria-labelledby="cart-heading" className="lg:col-span-8">
                    <h2 id="cart-heading" className="sr-only">Productos en tu carrito</h2>
                    <ul role="list" className="space-y-4">
                        {items.map((product) => (
                            <li key={product.id} className="flex p-4 bg-white rounded-lg shadow-sm items-start sm:items-center">
                                <div className="h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <Image src={product.imageUrl || '/placeholder.png'} alt={product.name} width={128} height={128} className="h-full w-full object-cover object-center" />
                                </div>
                                <div className="ml-4 flex flex-1 flex-col justify-between self-stretch">
                                    <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                            <h3>{product.name}</h3>
                                            <p className="ml-4">${((Number(product.priceUSD) || 0) * (Number(product.quantity) || 0)).toFixed(2)}</p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">${(Number(product.priceUSD) || 0).toFixed(2)} c/u</p>
                                    </div>
                                    <div className="flex items-end justify-between text-sm">
                                        <div className="flex items-center border border-gray-200 rounded-md">
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:bg-gray-100" onClick={() => updateQuantity(product.id, product.quantity - 1)} disabled={product.quantity <= 1}>-</Button>
                                            <span className="w-10 text-center text-gray-700 font-medium">{product.quantity}</span>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:bg-gray-100" onClick={() => updateQuantity(product.id, product.quantity + 1)}>+</Button>
                                        </div>
                                        <Button variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600 p-2" onClick={() => removeFromCart(product.id)}>
                                            <TrashIcon />
                                            <span className="sr-only">Eliminar</span>
                                        </Button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Resumen del Pedido */}
                <section aria-labelledby="summary-heading" className="mt-16 rounded-lg bg-white p-6 shadow-sm lg:col-span-4 lg:mt-0 lg:sticky lg:top-24">
                    <h2 id="summary-heading" className="text-xl font-bold text-gray-900">Resumen del Pedido</h2>
                    <dl className="mt-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <dt className="text-sm text-gray-600">Subtotal</dt>
                            <dd className="text-sm font-medium text-gray-900">${totalUsd.toFixed(2)}</dd>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                            <dt className="text-base font-medium text-gray-900">Total (USD)</dt>
                            <dd className="text-base font-medium text-gray-900">${totalUsd.toFixed(2)}</dd>
                        </div>
                        {totalVes && (
                            <div className="flex items-center justify-between text-sm text-gray-500 pt-2">
                                <dt className="font-medium">Equivalente (Bs.)</dt>
                                <dd className="font-medium">{formatToVes(totalVes)}</dd>
                            </div>
                        )}
                    </dl>
                    <div className="mt-8">
                        <Button onClick={() => router.push('/checkout')} className="w-full" size="lg">Proceder al Pago</Button>
                    </div>
                    <div className="mt-4 text-center">
                        <Button variant="link" asChild><Link href="/tienda">o Seguir Comprando</Link></Button>
                    </div>
                </section>
            </div>
        </div>
    </div>
  );
}