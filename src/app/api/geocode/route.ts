// src/app/api/geocode/route.ts
import { NextResponse } from 'next/server';
import { logError } from '@/lib/logger';
import { sanitizeText } from '@/lib/sanitizer';
import { rateLimit, getClientIP } from '@/lib/rate-limit';

// Función para validar coordenadas
function isValidCoordinate(lat: string, lon: string): boolean {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  
  return !isNaN(latitude) && !isNaN(longitude) &&
         latitude >= -90 && latitude <= 90 &&
         longitude >= -180 && longitude <= 180;
}



export async function GET(request: Request) {
  try {
    // Rate limiting por IP
    const clientIP = getClientIP(request);
    const rateLimitResult = rateLimit(`geocode:${clientIP}`, 20, 60000); // 20 requests por minuto
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
    }

    // Validar coordenadas
    if (!isValidCoordinate(lat, lon)) {
      return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
    }

    // Validar que solo llamemos a Nominatim (prevenir SSRF)
    const allowedHost = 'nominatim.openstreetmap.org';
    const url = `https://${allowedHost}/reverse?format=json&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const geoResponse = await fetch(url, {
      headers: {
        'User-Agent': 'CasaDulceOriente/1.0 (tutienda.com)', 
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!geoResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch from geocoding service' }, { status: 502 });
    }

    const geoData = await geoResponse.json();
    const rawAddress = geoData.display_name || 'No se pudo determinar la dirección.';
    
    // Sanitizar la dirección antes de devolverla
    const addressString = sanitizeText(rawAddress);
    
    return NextResponse.json({ addressString });

  } catch (error) {
    logError('Geocoding API proxy error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}