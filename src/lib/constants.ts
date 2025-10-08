// Validar variables de entorno críticas
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export const APP_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
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
  MASTER: 'MASTER',
  ADMINISTRADOR: 'ADMINISTRADOR',
  CLIENTE: 'CLIENTE',
  CLIENTE_VIP: 'CLIENTE_VIP',
  MARKETING: 'MARKETING',
  OPERARIO: 'OPERARIO'
} as const;

export const SECURITY_CONFIG = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
  BCRYPT_ROUNDS: 12,
  RATE_LIMIT_WINDOW: 300000, // 5 minutos
  MAX_LOGIN_ATTEMPTS: 5,
  MAX_REQUESTS_PER_MINUTE: 60
} as const;