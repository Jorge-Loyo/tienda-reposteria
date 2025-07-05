'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCurrency } from '@/context/CurrencyContext';
import { formatToVes } from '@/lib/currency';

// Mapeo de métodos de pago a nombres más amigables
const paymentMethodNames: { [key: string]: string } = {
  EFECTIVO_USD: 'Efectivo (Dólares)',
  EFECTIVO_BS: 'Efectivo (Bolívares)',
  ZELLE: 'Transferencia Zelle',
  BANESCO: 'Transferencia Banesco',
  BDV: 'Transferencia Banco de Venezuela',
};

export default function CheckoutPage() {
  const { items, clearCart, paymentMethod } = useCartStore();
  const router = useRouter();
  const { bcvRate } = useCurrency();

  const [customerData, setCustomerData] = useState({ name: '', email: '', identityCard: '', phone: '', instagram: '', address: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');
  const [mapImageUrl, setMapImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setCustomerData(prev => ({
            ...prev,
            name: userData.name || '',
            email: userData.email || '',
            instagram: userData.instagram || '',
            phone: userData.phoneNumber || '',
            address: userData.address || '',
          }));
        }
      } catch (error) {
        console.log("No hay sesión de usuario activa, se procederá como invitado.");
      }
    };

    fetchUserData();
  }, []);

  // CORRECCIÓN: Se cambia 'item.priceUSD' por 'item.price' para calcular el total.
  const totalUsd = items.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
  const totalVes = bcvRate ? totalUsd * bcvRate : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomerData({ ...customerData, [e.target.name]: e.target.value });
  };
  
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setLocationMessage('Obteniendo ubicación...');
      setMapImageUrl(null);
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`/api/geocode?lat=${latitude}&lon=${longitude}`);
          if (!response.ok) throw new Error('El servidor no pudo obtener la dirección.');
          const data = await response.json();
          setCustomerData(prev => ({ ...prev, address: data.addressString }));
          const mapProxyUrl = `/api/map?lat=${latitude}&lon=${longitude}`;
          setMapImageUrl(mapProxyUrl);
          setLocationMessage('¡Ubicación y dirección encontradas!');
        } catch (error) {
          console.error("Error fetching address via proxy:", error);
          setLocationMessage('No se pudo obtener la dirección.');
        }
      }, (error) => {
        console.error("Geolocation browser error:", error);
        setLocationMessage('No se pudo obtener la ubicación desde el navegador.');
      }, { timeout: 10000 });
    } else {
      setLocationMessage('Geolocalización no es soportada por este navegador.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/orders', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ customerData, items, paymentMethod }), 
      });
      const order = await response.json();
      if (!response.ok) { throw new Error(order.error || 'Error al crear el pedido'); }
      clearCart();
      router.push(`/order/${order.id}/pago`);
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0 && !isLoading) {
    return <div className="text-center py-20"><h1 className="text-xl">Tu carrito está vacío.</h1></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-10">Finalizar Compra</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Tus Datos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label htmlFor="name">Nombre Completo</Label><Input type="text" name="name" id="name" required onChange={handleChange} value={customerData.name} /></div>
            <div className="space-y-1.5"><Label htmlFor="identityCard">Cédula de Identidad</Label><Input type="text" name="identityCard" id="identityCard" required onChange={handleChange} value={customerData.identityCard} /></div>
          </div>
          <div className="space-y-1.5"><Label htmlFor="email">Correo Electrónico</Label><Input type="email" name="email" id="email" required onChange={handleChange} value={customerData.email} disabled={!!customerData.email} className={customerData.email ? "bg-gray-100" : ""} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label htmlFor="phone">Nº de Teléfono</Label><Input type="tel" name="phone" id="phone" required onChange={handleChange} value={customerData.phone} /></div>
            <div className="space-y-1.5"><Label htmlFor="instagram">Instagram / Alias (Opcional)</Label><Input type="text" name="instagram" id="instagram" onChange={handleChange} value={customerData.instagram} /></div>
          </div>
          <div className="space-y-1.5"><Label htmlFor="address">Dirección de Envío</Label><Textarea name="address" id="address" required onChange={handleChange} rows={3} value={customerData.address}/></div>
          <Button type="button" variant="outline" className="w-full" onClick={handleGetLocation}>Usar Ubicación Actual (GPS)</Button>
          {locationMessage && <p className="text-sm text-center text-gray-600">{locationMessage}</p>}
          {mapImageUrl && (
            <div className="mt-4 rounded-md overflow-hidden border">
              <img src={mapImageUrl} alt="Mapa de la ubicación" width="400" height="200" className="w-full" style={{ objectFit: 'cover' }}/>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg self-start">
          <h2 className="text-xl font-semibold">Resumen de tu Pedido</h2>
          <div className="mt-4 space-y-2">
            {/* CORRECCIÓN: Se usa 'item.price' para mostrar el subtotal de cada producto */}
            {items.map(item => ( <div key={item.id} className="flex justify-between text-sm"><span>{item.name} x {item.quantity}</span><span>${(item.price * item.quantity).toFixed(2)}</span></div> ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg"><span>Total (USD)</span><span>${totalUsd.toFixed(2)}</span></div>
          {totalVes && (<div className="flex items-center justify-between text-sm text-gray-600 pt-2"><p className="font-medium">Total Aprox. (Bs.)</p><p className="font-medium">{formatToVes(totalVes)}</p></div>)}
          
          <div className="border-t mt-4 pt-4">
            <h3 className="text-sm font-medium text-gray-500">Método de Pago</h3>
            <p className="text-sm font-semibold text-gray-900">{paymentMethodNames[paymentMethod] || 'No seleccionado'}</p>
          </div>

          <Button type="submit" disabled={isLoading} className="mt-6 w-full">{isLoading ? 'Procesando...' : 'Realizar Pedido'}</Button>
        </div>
      </form>
    </div>
  );
}
