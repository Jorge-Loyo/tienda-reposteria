// src/app/api/geocode/route.ts
import { NextResponse } from 'next/server';

// Función para validar coordenadas
function isValidCoordinate(lat: string, lon: string): boolean {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  
  return !isNaN(latitude) && !isNaN(longitude) &&
         latitude >= -90 && latitude <= 90 &&
         longitude >= -180 && longitude <= 180;
}

// Función para sanitizar texto
function sanitizeText(text: string): string {
  return text.replace(/[<>"'&]/g, '').substring(0, 500);
}

export async function GET(request: Request) {
  try {
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
    
    const geoResponse = await fetch(url, {
      headers: {
        'User-Agent': 'CasaDulceOriente/1.0 (tutienda.com)', 
      },
      timeout: 5000, // Timeout de 5 segundos
    });

    if (!geoResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch from geocoding service' }, { status: 502 });
    }

    const geoData = await geoResponse.json();
    const rawAddress = geoData.display_name || 'No se pudo determinar la dirección.';
    
    // Sanitizar la dirección antes de devolverla
    const addressString = sanitizeText(rawAddress);
    
    return NextResponse.json({ addressString });

  } catch (error) {
    // Log seguro sin exponer detalles del error
    console.error('Geocoding API proxy error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}