import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // 1. Importamos el middleware 'persist'

export interface CartItem {
  id: number;
  name: string;
  priceUSD: number;
  imageUrl: string | null;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
}

// 2. Envolvemos nuestra definición del store con el middleware 'persist'
export const useCartStore = create<CartState>()(
  persist(
   (set) => ({
      items: [],
      addToCart: (product, quantityToAdd) => set((state) => {
       const existingItem = state.items.find((item) => item.id === product.id);

        if (existingItem) {
          const updatedItems = state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
          );
         return { items: updatedItems };
       } else {
        return { items: [...state.items, { ...product, quantity: quantityToAdd }] };
       }
      }),
     removeFromCart: (itemId) => set((state) => ({
        items: state.items.filter((item) => item.id !== itemId),
      })),
      updateQuantity: (itemId, quantity) => set((state) => ({
       items: state.items.map((item) =>
       item.id === itemId ? { ...item, quantity } : item
     ).filter(item => item.quantity > 0), // Mantenemos esta lógica para eliminar si la cantidad es 0
     })),
    clearCart: () => set({ items: [] }),
}),
    {
      // 3. Opciones de configuración para la persistencia
     name: 'cart-storage', // Nombre de la clave que se usará en localStorage
    }
  )
);