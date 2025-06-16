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

    // Desde nuestro servidor, llamamos a la API de Nominatim para obtener la dirección en texto.
    const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
      headers: {
        // Es una buena práctica enviar un User-Agent para identificarnos.
        'User-Agent': 'CasaDulceOriente/1.0 (tutienda.com)', 
      },
    });

    if (!geoResponse.ok) {
      console.error('Nominatim API responded with an error:', await geoResponse.text());
      return NextResponse.json({ error: 'Failed to fetch from geocoding service' }, { status: 502 });
    }

    const geoData = await geoResponse.json();
    const addressString = geoData.display_name || 'No se pudo determinar la dirección.';
    
    // Construimos la URL a nuestro propio proxy de mapas.
    // De esta forma, el navegador del cliente solo le pedirá la imagen a nuestro servidor.
    const mapUrl = `/api/map?lat=${lat}&lon=${lon}`;

    // Devolvemos la dirección en texto y la URL a nuestro proxy de mapa al frontend.
    return NextResponse.json({ addressString, mapUrl });

  } catch (error) {
    console.error('Geocoding API proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}