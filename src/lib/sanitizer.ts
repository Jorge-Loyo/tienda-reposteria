// Utilidad para sanitizar contenido y prevenir XSS
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Escapar caracteres HTML peligrosos
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remover caracteres de control y limitar longitud
  return input
    .replace(/[\x00-\x1F\x7F]/g, '') // Remover caracteres de control
    .trim()
    .substring(0, 1000); // Limitar longitud
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/;
  return phoneRegex.test(phone);
}