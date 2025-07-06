import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  name: string;
  price: number; 
  imageUrl: string | null;
  quantity: number;
}

interface Product {
    id: number;
    name: string;
    priceUSD: number;
    imageUrl: string | null;
    isOfferActive?: boolean;
    offerPriceUSD?: number | null;
    offerEndsAt?: Date | null;
}

// 1. Añadimos shippingCost y grandTotal para guardar el resumen del pedido
interface CartState {
  items: CartItem[];
  paymentMethod: string;
  shippingZone: string;
  shippingCost: number; // Guardará el costo de envío calculado
  grandTotal: number;   // Guardará el total final (subtotal + envío)
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  // 2. Creamos una única función para guardar todo el resumen de la orden
  setOrderSummary: (summary: { 
    paymentMethod: string; 
    shippingZone: string; 
    shippingCost: number; 
    grandTotal: number; 
  }) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      paymentMethod: '',
      shippingZone: '',
      shippingCost: 0,
      grandTotal: 0,
      addToCart: (product, quantityToAdd) => set((state) => {
        const now = new Date();
        const onSale = 
            !!product.isOfferActive && 
            product.offerPriceUSD != null && 
            (!product.offerEndsAt || new Date(product.offerEndsAt) > now);
        
        const priceToAdd = onSale ? product.offerPriceUSD! : product.priceUSD;

        const existingItem = state.items.find((item) => item.id === product.id);

        if (existingItem) {
          const updatedItems = state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
          );
          return { items: updatedItems };
        } else {
          const newItem: CartItem = {
            id: product.id,
            name: product.name,
            price: priceToAdd,
            imageUrl: product.imageUrl,
            quantity: quantityToAdd,
          };
          return { items: [...state.items, newItem] };
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
      clearCart: () => set({ 
          items: [], 
          paymentMethod: '', 
          shippingZone: '',
          shippingCost: 0,
          grandTotal: 0,
      }),
      // 3. Implementación de la nueva función de resumen
      setOrderSummary: (summary) => set({
          paymentMethod: summary.paymentMethod,
          shippingZone: summary.shippingZone,
          shippingCost: summary.shippingCost,
          grandTotal: summary.grandTotal,
      }),
    }),
    {
      name: 'cart-storage',
    }
  )
);