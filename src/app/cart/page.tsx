'use client';

import { useState, useEffect, useMemo } from 'react';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { formatToVes } from '@/lib/currency';
import { useCurrency } from '@/context/CurrencyContext';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShippingZone } from '@prisma/client';

// --- Componentes de Iconos (Corregidos) ---
function LoadingSpinner() {
    // CORRECCIÓN: Se añade el código SVG para que el componente retorne un elemento válido.
    return (
        <div className="flex justify-center items-center py-20">
            <svg className="animate-spin h-8 w-8 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    );
}

function EmptyCartIcon() {
    // CORRECCIÓN: Se añade el código SVG para que el componente retorne un elemento válido.
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-16 w-16 mx-auto text-gray-300 mb-4">
            <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
    );
}

function TrashIcon() {
    // CORRECCIÓN: Se añade el código SVG para que el componente retorne un elemento válido.
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
    );
}

function ArrowLeftIcon() {
    // CORRECCIÓN: Se añade el código SVG para que el componente retorne un elemento válido.
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
        </svg>
    );
}

// --- Nuevo Componente para la Información de Envío ---
function ShippingInfo({ subtotal, zone }: { subtotal: number, zone: ShippingZone | null }) {
    if (!zone) return null;

    if (zone.identifier === 'NACIONAL') {
        return (
            <div className="mt-4 text-sm text-center text-gray-600 p-3 bg-blue-50 border border-blue-200 rounded-md">
                El costo para Envíos Nacionales se cotizará por separado.
            </div>
        );
    }

    const { freeShippingThreshold } = zone;

    if (freeShippingThreshold && subtotal >= freeShippingThreshold) {
        return (
            <div className="mt-4 text-sm text-center font-semibold text-green-600 p-3 bg-green-50 border border-green-200 rounded-md">
                ¡Felicidades! Tu envío es GRATIS.
            </div>
        );
    }

    if (freeShippingThreshold) {
        const remaining = freeShippingThreshold - subtotal;
        const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
        return (
            <div className="mt-4 space-y-2 text-sm">
                <p className="text-center">
                    Te faltan <span className="font-bold">${remaining.toFixed(2)}</span> para el envío gratis.
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        );
    }

    return null;
}

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, setOrderSummary } = useCartStore();
  const router = useRouter();
  const { bcvRate } = useCurrency();
  const [isClient, setIsClient] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [shippingZone, setShippingZone] = useState('');
  const [allShippingZones, setAllShippingZones] = useState<ShippingZone[]>([]);

  useEffect(() => {
    setIsClient(true);
    const fetchZones = async () => {
        try {
            const response = await fetch('/api/shipping-zones');
            if (!response.ok) throw new Error('Failed to fetch zones');
            const zones = await response.json();
            setAllShippingZones(zones);
        } catch (error) {
            console.error(error);
        }
    };
    fetchZones();
  }, []);

  const subtotal = useMemo(() =>
    items.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0),
  [items]);

  const selectedZoneData = useMemo(() =>
    allShippingZones.find(zone => zone.identifier === shippingZone) || null,
  [allShippingZones, shippingZone]);

  const shippingCost = useMemo(() => {
    if (!selectedZoneData || selectedZoneData.identifier === 'NACIONAL') return 0;
    if (selectedZoneData.freeShippingThreshold && subtotal >= selectedZoneData.freeShippingThreshold) return 0;
    return selectedZoneData.cost;
  }, [selectedZoneData, subtotal]);

  const grandTotal = subtotal + shippingCost;
  const totalVes = bcvRate ? grandTotal * bcvRate : null;

  const handleCheckout = () => {
    setOrderSummary({
        paymentMethod,
        shippingZone,
        shippingCost,
        grandTotal
    });
    router.push('/checkout');
  };

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
            <div className="flex items-center gap-4 mb-12">
                <Button variant="outline" size="icon" className="h-10 w-10 flex-shrink-0" onClick={() => router.back()}>
                    <ArrowLeftIcon />
                </Button>
                <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900">Tu Carrito de Compras</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                <section aria-labelledby="cart-heading" className="lg:col-span-8">
                    <ul role="list" className="space-y-4">
                        {items.map((product) => {
                            const subtotal = (Number(product.price) || 0) * (Number(product.quantity) || 0);
                            return (
                                <li key={product.id} className="flex p-4 bg-white rounded-lg shadow-sm items-start sm:items-center">
                                    <div className="h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                        <Image src={product.imageUrl || '/placeholder.png'} alt={product.name} width={128} height={128} className="h-full w-full object-cover object-center" />
                                    </div>
                                    <div className="ml-4 flex flex-1 flex-col justify-between self-stretch">
                                        <div>
                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                <h3>{product.name}</h3>
                                                <p className="ml-4">${subtotal.toFixed(2)}</p>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500">${(Number(product.price) || 0).toFixed(2)} c/u</p>
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
                            );
                        })}
                    </ul>
                </section>

                <section aria-labelledby="summary-heading" className="mt-16 rounded-lg bg-white p-6 shadow-sm lg:col-span-4 lg:mt-0 lg:sticky lg:top-24">
                    <h2 id="summary-heading" className="text-xl font-bold text-gray-900">Resumen del Pedido</h2>
                    <dl className="mt-6 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <dt className="text-gray-600">Subtotal</dt>
                            <dd className="font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
                        </div>
                        {selectedZoneData && selectedZoneData.identifier !== 'NACIONAL' && (
                             <div className="flex items-center justify-between text-sm">
                                <dt className="text-gray-600">Envío</dt>
                                <dd className="font-medium text-gray-900">${shippingCost.toFixed(2)}</dd>
                            </div>
                        )}
                        <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4">
                            <dt className="text-base font-medium text-gray-900">Total (USD)</dt>
                            <dd className="text-base font-medium text-gray-900">${grandTotal.toFixed(2)}</dd>
                        </div>
                        {totalVes && (
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <dt className="font-medium">Equivalente (Bs.)</dt>
                                <dd className="font-medium">{formatToVes(totalVes)}</dd>
                            </div>
                        )}
                    </dl>

                    <ShippingInfo subtotal={subtotal} zone={selectedZoneData} />

                    <div className="mt-6 space-y-2">
                        <Label htmlFor="shipping-zone" className="text-base font-medium text-gray-900">Zona de Envío</Label>
                        <Select onValueChange={setShippingZone} value={shippingZone}>
                            <SelectTrigger id="shipping-zone">
                                <SelectValue placeholder="Selecciona una zona" />
                            </SelectTrigger>
                            <SelectContent>
                                {allShippingZones.map(zone => (
                                    <SelectItem key={zone.identifier} value={zone.identifier}>{zone.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="mt-4 space-y-2">
                        <Label htmlFor="payment-method" className="text-base font-medium text-gray-900">Método de Pago</Label>
                        <Select onValueChange={setPaymentMethod} value={paymentMethod}>
                            <SelectTrigger id="payment-method">
                                <SelectValue placeholder="Selecciona una opción" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="EFECTIVO_USD">Efectivo (Dólares)</SelectItem>
                                <SelectItem value="EFECTIVO_BS">Efectivo (Bolívares)</SelectItem>
                                <SelectItem value="ZELLE">Transferencia Zelle</SelectItem>
                                <SelectItem value="BANESCO">Transferencia Banesco</SelectItem>
                                <SelectItem value="BDV">Transferencia Banco de Venezuela</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="mt-6">
                        <Button onClick={handleCheckout} className="w-full" size="lg" disabled={!paymentMethod || !shippingZone}>
                            Proceder al Pago
                        </Button>
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
