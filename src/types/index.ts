export interface Product {
  id: number;
  name: string;
  description?: string;
  priceUSD: number;
  stock: number;
  sku?: string;
  imageUrl?: string;
  published: boolean;
  isOfferActive: boolean;
  offerPriceUSD?: number;
  offerEndsAt?: Date;
  categoryId: number;
  category: Category;
}

export interface Category {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name?: string;
  email: string;
  role: string;
  instagram?: string;
  phoneNumber?: string;
  address?: string;
  identityCard?: string;
}

export interface Order {
  id: number;
  total: number;
  customerName: string;
  customerEmail: string;
  address?: string;
  identityCard?: string;
  phone?: string;
  instagram?: string;
  paymentMethod?: string;
  shippingZoneIdentifier?: string;
  shippingCost: number;
  status: string;
  createdAt: Date;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface CartItem {
  id: number;
  name: string;
  priceUSD: number;
  quantity: number;
  imageUrl?: string;
  stock: number;
}