'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AddToCartModal from './AddToCartModal';

// 1. Actualizamos la interfaz para que coincida con la de ProductCard
interface Product {
  id: number;
  name: string;
  priceUSD: number;
  imageUrl: string | null;
  stock: number;
  isOfferActive?: boolean;
  offerPriceUSD?: number | null;
  offerEndsAt?: Date | null;
}

export default function QuickAddToCart({ product }: { product: Product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (product.stock === 0) {
    return (
        <Button disabled className="w-full mt-4">Agotado</Button>
    );
  }

  return (
    <>
      <Button 
        onClick={(e) => {
          e.preventDefault();
          setIsModalOpen(true);
        }} 
        className="w-full mt-4"
      >
        Agregar al Carrito
      </Button>

      {isModalOpen && (
        <AddToCartModal 
          product={product} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}
 