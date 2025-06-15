import { create } from 'zustand';

export interface CartItem {
  id: number;
  name: string;
  priceUSD: number;
  imageUrl: string | null;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addToCart: (product) => set((state) => {
    const existingItem = state.items.find((item) => item.id === product.id);
    if (existingItem) {
      const updatedItems = state.items.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      return { items: updatedItems };
    } else {
      return { items: [...state.items, { ...product, quantity: 1 }] };
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