'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { showToast } from '@/components/ui/toast';
import './AddToCartModal.css';

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
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(`${quantity} x ${product.name} agregado al carrito`, 'success');
    onClose();
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
    <div className="add-to-cart-modal-overlay" onClick={onClose}>
      <div className="add-to-cart-modal-panel" onClick={(e) => e.stopPropagation()}>
        <h2 className="add-to-cart-modal-title">{product.name}</h2>
        <div className="add-to-cart-modal-image">
            <Image src={product.imageUrl || '/placeholder.png'} alt={product.name} fill style={{ objectFit: 'cover' }} />
        </div>
        <p className="add-to-cart-modal-description">Selecciona la cantidad que deseas agregar al carrito.</p>
        
        <div className="add-to-cart-modal-quantity">
          <Button variant="outline" size="icon" className="add-to-cart-modal-quantity-btn" onClick={decrement} disabled={quantity <= 1}>-</Button>
          <span className="add-to-cart-modal-quantity-display">{quantity}</span>
          <Button variant="outline" size="icon" className="add-to-cart-modal-quantity-btn" onClick={increment} disabled={quantity >= product.stock}>+</Button>
        </div>
        
        <Button onClick={handleAddToCart} className="add-to-cart-modal-submit" size="lg">
          Agregar {quantity} al Carrito
        </Button>
        <p className="add-to-cart-modal-stock">Stock disponible: {product.stock}</p>
      </div>
    </div>
  );
}