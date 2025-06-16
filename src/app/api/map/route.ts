// src/app/api/map/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      return new Response('Latitude and longitude are required', { status: 400 });
    }

    // Obtenemos la clave de API desde las variables de entorno
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      throw new Error('Google Maps API key is not configured.');
    }

    // Construimos la URL para la API de Google Maps Static
    const externalMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&zoom=16&size=400x200&maptype=roadmap&markers=color:red%7Clabel:P%7C${lat},${lon}&key=${apiKey}`;

    // La lógica para obtener y servir la imagen es la misma
    const imageResponse = await fetch(externalMapUrl);

    if (!imageResponse.ok) {
      console.error("Google Maps API error:", await imageResponse.text());
      throw new Error('Failed to fetch map image from Google Maps service.');
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
    console.error('Map proxy error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}