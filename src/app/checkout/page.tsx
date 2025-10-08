//src/app/checkout/page.tsx
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
import { sanitizeText } from '@/lib/sanitizer';
import dynamic from 'next/dynamic';

const LocationMap = dynamic(() => import('@/components/LocationMap'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">Cargando mapa...</div>
});

// Mapeo de métodos de pago a nombres más amigables
const paymentMethodNames: { [key: string]: string } = {
  EFECTIVO_USD: 'Efectivo (Dólares)',
  EFECTIVO_BS: 'Efectivo (Bolívares)',
  ZELLE: 'Transferencia Zelle',
  BANESCO: 'Transferencia Banesco',
  BDV: 'Transferencia Banco de Venezuela',
};

export default function CheckoutPage() {
  // 1. Obtenemos los datos completos del resumen del pedido desde el store
  const { items, clearCart, paymentMethod, shippingCost, grandTotal, shippingZone } = useCartStore();
  const router = useRouter();
  const { bcvRate } = useCurrency();

  const [customerData, setCustomerData] = useState({ name: '', email: '', identityCard: '', phone: '', instagram: '', address: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');
  const [mapImageUrl, setMapImageUrl] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{lat: number, lon: number} | null>(null);

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
            identityCard: userData.identityCard || '',
          }));
        }
      } catch (error) {
        // Usuario invitado, continuar sin datos precargados
      }
    };

    fetchUserData();
  }, []);

  // 2. Calculamos el subtotal solo de los productos
  const subtotal = items.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
  // El total en Bolívares ahora se basa en el 'grandTotal'
  const totalVes = bcvRate ? grandTotal * bcvRate : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeText(value);
    setCustomerData({ ...customerData, [name]: sanitizedValue });
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
          
          // Guardar coordenadas y mostrar indicador
          setCoordinates({ lat: latitude, lon: longitude });
          setMapImageUrl('GPS_COORDINATES');
          setLocationMessage('¡Ubicación y dirección encontradas!');
          console.log('Mostrando coordenadas:', latitude, longitude);
        } catch (error) {
          console.error('Error completo:', error);
          setLocationMessage('No se pudo obtener la dirección.');
        }
      }, (error) => {
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
      // 3. Nos aseguramos de enviar el 'grandTotal' correcto a la API
      const response = await fetch('/api/orders', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ 
              customerData, 
              items, 
              paymentMethod,
              shippingZone,
              shippingCost,
              total: grandTotal // Enviamos el total final
          }), 
      });
      const order = await response.json();
      if (!response.ok) { throw new Error(order.error || 'Error al crear el pedido'); }
      
      // Abrir WhatsApp con notificación al administrador
      if (order.whatsappURL) {
        window.open(order.whatsappURL, '_blank');
      }
      
      clearCart();
      router.push(`/order/${order.id}/pago`);
    } catch (error) {
      alert((error as Error).message || 'Error al procesar el pedido');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50 flex items-center justify-center">
        <div className="glass p-12 rounded-3xl text-center">
          <h1 className="text-2xl font-bold gradient-text">Tu carrito está vacío</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">Finalizar Compra</h1>
          <p className="text-gray-600">Completa tus datos para procesar el pedido</p>
        </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="glass p-8 rounded-2xl shadow-xl space-y-6">
          <h2 className="text-2xl font-bold gradient-text">Tus Datos</h2>
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
          {mapImageUrl === 'GPS_COORDINATES' && coordinates && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
              <div className="text-center mb-3">
                <div className="text-2xl mb-1">📍</div>
                <div className="text-sm font-medium text-gray-700">Ubicación GPS Detectada</div>
                <div className="text-xs text-gray-500 font-mono">
                  {coordinates.lat.toFixed(6)}, {coordinates.lon.toFixed(6)}
                </div>
              </div>
              <LocationMap lat={coordinates.lat} lon={coordinates.lon} />
            </div>
          )}
        </div>
        
        <div className="glass p-8 rounded-2xl shadow-xl self-start">
          <h2 className="text-2xl font-bold gradient-text mb-6">Resumen de tu Pedido</h2>
          <div className="mt-4 space-y-2">
            {items.map(item => ( <div key={item.id} className="flex justify-between text-sm"><span>{item.name} x {item.quantity}</span><span>${(item.price * item.quantity).toFixed(2)}</span></div> ))}
          </div>
          {/* 4. Resumen de precios actualizado */}
          <dl className="border-t mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
                <dt className="text-gray-600">Subtotal</dt>
                <dd className="text-gray-900">${subtotal.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between text-sm">
                <dt className="text-gray-600">Envío</dt>
                <dd className="text-gray-900">${shippingCost.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2">
                <dt>Total (USD)</dt>
                <dd>${grandTotal.toFixed(2)}</dd>
            </div>
            {totalVes && (
                <div className="flex justify-between text-sm text-gray-600">
                    <dt>Total (Bs.)</dt>
                    <dd>{formatToVes(totalVes)}</dd>
                </div>
            )}
          </dl>
          
          <div className="border-t mt-4 pt-4">
            <h3 className="text-sm font-medium text-gray-500">Método de Pago</h3>
            <p className="text-sm font-semibold text-gray-900">{paymentMethodNames[paymentMethod] || 'No seleccionado'}</p>
          </div>

          <Button type="submit" disabled={isLoading} className="mt-6 w-full">{isLoading ? 'Procesando...' : 'Realizar Pedido'}</Button>
        </div>
        </form>
      </div>
    </div>
  );
}
