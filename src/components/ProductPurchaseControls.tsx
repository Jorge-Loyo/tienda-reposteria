  // src/components/ProductPurchaseControls.tsx
  'use client';

  import { useState } from 'react';
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

  export default function ProductPurchaseControls({ product }: { product: Product }) {
    // Estado local para manejar la cantidad seleccionada
    const [quantity, setQuantity] = useState(1);
    const addToCart = useCartStore((state) => state.addToCart);

    const handleAddToCart = () => {
      // Llamamos a la nueva función addToCart con la cantidad
      addToCart(product, quantity);
      alert(`${quantity} x ${product.name} ha sido agregado al carrito!`);
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
    
    // Si no hay stock, mostramos un mensaje diferente
    if (product.stock === 0) {
      return (
        <div className="mt-10">
          <Button className="w-full" size="lg" disabled>
            Producto Agotado
          </Button>
        </div>
      );
    }

    return (
      <div className="mt-10 space-y-4">
        <div className="flex items-center gap-4">
          <label htmlFor="quantity" className="text-sm font-medium">Cantidad:</label>
          <div className="flex items-center rounded-md border border-gray-300">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={decrement} disabled={quantity <= 1}>
              <span className="text-xl">-</span>
            </Button>
            <span id="quantity" className="w-12 text-center font-medium">{quantity}</span>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={increment} disabled={quantity >= product.stock}>
              <span className="text-xl">+</span>
            </Button>
          </div>
        </div>
        <Button
          onClick={handleAddToCart}
          className="w-full"
          size="lg"
        >
          Agregar al Carrito
        </Button>
      </div>
    );
  }
