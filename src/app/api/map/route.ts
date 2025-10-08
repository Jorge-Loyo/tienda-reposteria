// src/app/api/map/route.ts
import { NextResponse } from 'next/server';
import { logError, logInfo } from '@/lib/logger';

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
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      return new Response('Latitude and longitude are required', { status: 400 });
    }

    // Validar coordenadas para prevenir SSRF
    if (!isValidCoordinate(lat, lon)) {
      return new Response('Invalid coordinates', { status: 400 });
    }

    // Obtenemos la clave de API desde las variables de entorno
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error('Google Maps API key is not configured');
      return new Response('Service configuration error', { status: 500 });
    }

    // Construir URL de forma segura con parámetros codificados
    const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';
    const params = new URLSearchParams({
      center: `${lat},${lon}`,
      zoom: '16',
      size: '400x200',
      maptype: 'roadmap',
      markers: `color:red|label:P|${lat},${lon}`,
      key: apiKey
    });
    
    const externalMapUrl = `${baseUrl}?${params.toString()}`;
    
    const imageResponse = await fetch(externalMapUrl, {
      timeout: 10000 // Timeout de 10 segundos
    });

    if (!imageResponse.ok) {
      logError('Google Maps API error', `HTTP ${imageResponse.status}`);
      return new Response('Failed to fetch map image', { status: 502 });
    }

    const imageBuffer = await imageResponse.arrayBuffer();

    // Devolvemos una nueva respuesta con los datos de la imagen y las cabeceras correctas
    // para que el navegador la interprete como una imagen PNG.
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });

  } catch (error) {
    logError('Map proxy error', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}