'use client';
import { useCartStore } from '@/store/cartStore';
interface Product { id: number; name: string; priceUSD: number; imageUrl: string | null; stock: number; }
export default function AddToCartButton({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const handleAddToCart = () => {
    addToCart({ id: product.id, name: product.name, priceUSD: product.priceUSD, imageUrl: product.imageUrl },1);
    alert(`${product.name} ha sido agregado al carrito!`);
  };
  return ( <button onClick={handleAddToCart} disabled={product.stock === 0} className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"> Agregar al Carrito </button> );
}