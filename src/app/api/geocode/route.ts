// src/app/api/geocode/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
    }

    // Desde nuestro servidor, llamamos a la API de Nominatim para obtener la dirección.
    const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
      headers: {
        'User-Agent': 'CasaDulceOriente/1.0 (tutienda.com)', 
      },
    });

    if (!geoResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch from geocoding service' }, { status: 502 });
    }

    const geoData = await geoResponse.json();
    const addressString = geoData.display_name || 'No se pudo determinar la dirección.';
    
    // Devolvemos la dirección en texto. Ya no devolvemos la URL del mapa.
    return NextResponse.json({ addressString });

  } catch (error) {
    console.error('Geocoding API proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}