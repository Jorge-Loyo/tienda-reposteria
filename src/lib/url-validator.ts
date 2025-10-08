// Utilidad para validar URLs y prevenir SSRF
export function isValidExternalUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    
    // Solo permitir HTTP y HTTPS
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }
    
    // Bloquear IPs privadas y localhost
    const hostname = parsedUrl.hostname.toLowerCase();
    
    // Bloquear localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
      return false;
    }
    
    // Bloquear rangos de IP privadas
    const privateRanges = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^169\.254\./, // Link-local
      /^224\./, // Multicast
    ];
    
    for (const range of privateRanges) {
      if (range.test(hostname)) {
        return false;
      }
    }
    
    return true;
  } catch {
    return false;
  }
}

export function sanitizeUrl(url: string): string | null {
  if (!isValidExternalUrl(url)) {
    return null;
  }
  return url;
}