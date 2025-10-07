export const APP_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || 'tu-secreto-super-secreto',
  GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  COMPANY_LOCATION: {
    lat: 10.135122,
    lng: -64.682316,
    address: '48P9+23P, Calle Bolívar, Barcelona 6001, Anzoátegui, Venezuela'
  },
  CONTACT: {
    phone: '0424-8536954',
    email: 'contacto@casadulce.com'
  }
} as const;

export const ORDER_STATUS = {
  PENDING_PAYMENT: 'PENDIENTE_DE_PAGO',
  PAID: 'PAGADO',
  PREPARING: 'PREPARANDO',
  READY: 'LISTO',
  DELIVERED: 'ENTREGADO',
  CANCELLED: 'CANCELADO'
} as const;

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  ORDERS_USER: 'ORDERS_USER'
} as const;