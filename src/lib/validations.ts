import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

export const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  priceUSD: z.number().positive('El precio debe ser positivo'),
  stock: z.number().int().min(0, 'El stock no puede ser negativo'),
  sku: z.string().optional(),
  categoryId: z.number().int().positive('Categoría requerida'),
  isOfferActive: z.boolean().default(false),
  offerPriceUSD: z.number().positive().optional(),
  offerEndsAt: z.string().datetime().optional()
});

export const orderSchema = z.object({
  customerName: z.string().min(1, 'Nombre requerido'),
  customerEmail: z.string().email('Email inválido'),
  address: z.string().optional(),
  identityCard: z.string().optional(),
  phone: z.string().optional(),
  instagram: z.string().optional(),
  paymentMethod: z.string().optional(),
  shippingZoneIdentifier: z.string().optional(),
  items: z.array(z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive(),
    price: z.number().positive()
  })).min(1, 'Al menos un producto es requerido')
});

export const userSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['ADMIN', 'ORDERS_USER']).default('ORDERS_USER'),
  instagram: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  identityCard: z.string().optional()
});