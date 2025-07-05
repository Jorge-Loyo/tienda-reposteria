'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';

// Definimos la forma del producto que espera este componente
interface Product {
  id: number;
  name: string;
  priceUSD: number;
  imageUrl: string | null;
  stock: number;
}

interface AddToCartModalProps {
  product: Product;
  onClose: () => void;
}

export default function AddToCartModal({ product, onClose }: AddToCartModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false); // Estado para mostrar confirmación
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true); // Mostramos el mensaje de confirmación
    // Cerramos el modal después de 2 segundos
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const increment = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    // Fondo oscuro semi-transparente
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      {/* Panel del Modal */}
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        {!isAdded ? (
          <>
            <h2 className="text-xl font-bold text-center mb-4">{product.name}</h2>
            <div className="relative w-32 h-32 mx-auto mb-4 rounded-md overflow-hidden">
                <Image src={product.imageUrl || '/placeholder.png'} alt={product.name} fill style={{ objectFit: 'cover' }} />
            </div>
            <p className="text-center text-gray-600 mb-4">Selecciona la cantidad que deseas agregar al carrito.</p>
            
            <div className="flex items-center justify-center gap-4 my-6">
              <Button variant="outline" size="icon" className="h-10 w-10" onClick={decrement} disabled={quantity <= 1}>-</Button>
              <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
              <Button variant="outline" size="icon" className="h-10 w-10" onClick={increment} disabled={quantity >= product.stock}>+</Button>
            </div>
            
            <Button onClick={handleAddToCart} className="w-full" size="lg">
              Agregar {quantity} al Carrito
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">Stock disponible: {product.stock}</p>
          </>
        ) : (
          // Vista de confirmación
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">¡Agregado!</h3>
            <p className="mt-1 text-sm text-gray-600">{quantity} x {product.name} en tu carrito.</p>
          </div>
        )}
      </div>
    </div>
  );
}