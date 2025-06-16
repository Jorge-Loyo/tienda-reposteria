// src/components/CartIcon.tsx
'use client';

import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';

// Se elimina la prop 'bcvRate' ya que no se utiliza en este componente.
export default function CartIcon() {
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link href="/cart" className="relative group">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-xs text-white">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
