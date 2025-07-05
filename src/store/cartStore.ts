import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. La interfaz del producto en el carrito ahora usa un campo 'price' genérico.
// Este guardará el precio final (ya sea el normal o el de oferta).
export interface CartItem {
  id: number;
  name: string;
  price: number; 
  imageUrl: string | null;
  quantity: number;
}

// Interfaz para el objeto de producto completo que recibiremos
interface Product {
    id: number;
    name: string;
    priceUSD: number;
    imageUrl: string | null;
    isOfferActive?: boolean;
    offerPriceUSD?: number | null;
    offerEndsAt?: Date | null;
}

interface CartState {
  items: CartItem[];
  paymentMethod: string;
  // 2. La función 'addToCart' ahora espera recibir el objeto de producto completo.
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  setPaymentMethod: (method: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      paymentMethod: '',
      // 3. Lógica de 'addToCart' actualizada
      addToCart: (product, quantityToAdd) => set((state) => {
        const now = new Date();
        // Se determina si la oferta es válida en el momento de agregar al carrito
        const onSale = 
            !!product.isOfferActive && 
            product.offerPriceUSD != null && 
            (!product.offerEndsAt || new Date(product.offerEndsAt) > now);
        
        // Se establece el precio correcto a guardar en el carrito
        const priceToAdd = onSale ? product.offerPriceUSD! : product.priceUSD;

        const existingItem = state.items.find((item) => item.id === product.id);

        if (existingItem) {
          // Si el producto ya existe, solo actualizamos la cantidad
          const updatedItems = state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
          );
          return { items: updatedItems };
        } else {
          // Si es un producto nuevo, lo creamos con el precio correcto
          const newItem: CartItem = {
            id: product.id,
            name: product.name,
            price: priceToAdd, // Se usa el precio de oferta si aplica
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
      clearCart: () => set({ items: [], paymentMethod: '' }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
