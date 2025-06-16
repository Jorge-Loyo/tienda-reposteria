// src/store/cartStore.ts
import { create } from 'zustand';

export interface CartItem {
  id: number;
  name: string;
  priceUSD: number;
  imageUrl: string | null;
  quantity: number;
}

// 1. Se actualiza la "forma" de la función addToCart para aceptar dos argumentos
interface CartState {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  // 2. Se actualiza la lógica de la función para usar el segundo argumento 'quantityToAdd'
  addToCart: (product, quantityToAdd) => set((state) => {
    const existingItem = state.items.find((item) => item.id === product.id);

    if (existingItem) {
      // Si el producto ya existe, sumamos la nueva cantidad a la que ya tenía
      const updatedItems = state.items.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
      );
      return { items: updatedItems };
    } else {
      // Si es un producto nuevo, lo agregamos al carrito con la cantidad especificada
      return { items: [...state.items, { ...product, quantity: quantityToAdd }] };
    }
  }),
  removeFromCart: (itemId) => set((state) => ({
    items: state.items.filter((item) => item.id !== itemId),
  })),
  updateQuantity: (itemId, quantity) => set((state) => ({
    items: state.items.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    ).filter(item => item.quantity > 0),
  })),
  clearCart: () => set({ items: [] }),
}));