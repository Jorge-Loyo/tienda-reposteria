// lib/security.ts
// Utilidades de seguridad centralizadas

/**
 * Sanitiza texto para prevenir XSS
 */
export function sanitizeText(text: string): string {
  if (typeof text !== 'string') return '';
  return text
    .replace(/[<>\"'&]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .substring(0, 1000); // Limitar longitud
}

/**
 * Valida que una URL sea segura para redirección
 */
export function isValidRedirectUrl(url: string, baseUrl: string): boolean {
  try {
    const redirectUrl = new URL(url, baseUrl);
    const base = new URL(baseUrl);
    return redirectUrl.origin === base.origin;
  } catch {
    return false;
  }
}

/**
 * Valida coordenadas geográficas
 */
export function isValidCoordinate(lat: string, lon: string): boolean {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  
  return !isNaN(latitude) && !isNaN(longitude) &&
         latitude >= -90 && latitude <= 90 &&
         longitude >= -180 && longitude <= 180;
}

/**
 * Valida formato de email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Logging seguro que no expone información sensible
 */
export function secureLog(message: string, error?: unknown): void {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error(`[${timestamp}] ${message}:`, errorMessage);
}

/**
 * Valida que un dominio esté en la lista de permitidos
 */
export function isAllowedDomain(url: string, allowedDomains: string[]): boolean {
  try {
    const urlObj = new URL(url);
    return allowedDomains.includes(urlObj.hostname);
  } catch {
    return false;
  }
}

/**
 * Sanitiza datos de usuario para respuestas API
 */
export function sanitizeUserData(user: any) {
  return {
    name: sanitizeText(user.name || ''),
    email: sanitizeText(user.email || ''),
    role: sanitizeText(user.role || ''),
    instagram: sanitizeText(user.instagram || ''),
    phoneNumber: sanitizeText(user.phoneNumber || ''),
    address: sanitizeText(user.address || ''),
    identityCard: sanitizeText(user.identityCard || '')
  };
}