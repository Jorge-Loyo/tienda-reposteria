  // src/components/ProductPurchaseControls.tsx
  'use client';

  import { useState } from 'react';
  import { useCartStore } from '@/store/cartStore';
  import { Button } from '@/components/ui/button';
  import { showToast } from '@/components/ui/toast';

  // Definimos la forma del producto que espera este componente
  interface Product {
    id: number;
    name: string;
    priceUSD: number;
    imageUrl: string | null;
    stock: number;
  }

  export default function ProductPurchaseControls({ product }: { product: Product }) {
    // Estado local para manejar la cantidad seleccionada
    const [quantity, setQuantity] = useState(1);
    const addToCart = useCartStore((state) => state.addToCart);

    const handleAddToCart = () => {
      // Llamamos a la nueva función addToCart con la cantidad
      addToCart(product, quantity);
      showToast(`${quantity} x ${product.name} agregado al carrito`, 'success');
    };

    const increment = () => {
      // No permitir agregar más que el stock disponible
      if (quantity < product.stock) {
        setQuantity(quantity + 1);
      }
    };

    const decrement = () => {
      // No permitir bajar de 1
      if (quantity > 1) {
        setQuantity(quantity - 1);
      }
    };
    
    if (product.stock === 0) {
      return (
        <div className="glass p-6 rounded-2xl text-center">
          <Button className="w-full" size="lg" disabled>
            😔 Producto Agotado
          </Button>
        </div>
      );
    }

    return (
      <div className="glass p-6 rounded-2xl space-y-6">
        <div className="flex items-center justify-between">
          <label htmlFor="quantity" className="text-lg font-semibold gradient-text">
            Cantidad:
          </label>
          <div className="flex items-center glass rounded-xl border border-white/20">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-12 w-12 hover:bg-pink-100 transition-colors" 
              onClick={decrement} 
              disabled={quantity <= 1}
            >
              <span className="text-xl font-bold text-pink-600">-</span>
            </Button>
            <span id="quantity" className="w-16 text-center font-bold text-xl text-gray-800">
              {quantity}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-12 w-12 hover:bg-pink-100 transition-colors" 
              onClick={increment} 
              disabled={quantity >= product.stock}
            >
              <span className="text-xl font-bold text-pink-600">+</span>
            </Button>
          </div>
        </div>
        <Button
          onClick={handleAddToCart}
          variant="gradient"
          className="w-full text-lg py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          size="lg"
        >
          🛍️ Agregar al Carrito
        </Button>
      </div>
    );
  }
