// security.config.js
// Configuración de seguridad para la aplicación

const securityConfig = {
  // Headers de seguridad
  securityHeaders: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://nominatim.openstreetmap.org https://maps.googleapis.com https://pydolarvenezuela.vercel.app;"
  },

  // Dominios permitidos para requests externos
  allowedExternalDomains: [
    'nominatim.openstreetmap.org',
    'maps.googleapis.com',
    'pydolarvenezuela.vercel.app',
    'www.bcv.org.ve'
  ],

  // Configuración de rate limiting
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por ventana
    message: 'Demasiadas solicitudes, intenta de nuevo más tarde.'
  },

  // Configuración de CORS
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://tudominio.com'] 
      : ['http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200
  }
};

module.exports = securityConfig;