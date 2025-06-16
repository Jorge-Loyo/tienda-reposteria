// src/lib/currency.ts
import { unstable_cache as cache } from 'next/cache';

// Esta función obtiene la tasa de cambio y la guarda en un caché
// para evitar llamar a la API externa en cada carga de página.
export const getBcvRate = cache(
  async () => {
    try {
      console.log('Fetching new BCV rate from API...');
      
      // --- INICIO DE LA CORRECCIÓN ---
      // Llamamos al endpoint principal que devuelve TODOS los monitores.
      const response = await fetch('https://pydolarvenezuela.vercel.app/api/v1/dollar/', {
        next: {
          revalidate: 43200, // Revalidar cada 12 horas (en segundos)
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch BCV rates, API responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Buscamos dentro de la respuesta el monitor específico para el BCV.
      const bcvMonitor = data.monitors?.BCV;
      
      if (!bcvMonitor || typeof bcvMonitor.price !== 'number') {
        throw new Error('BCV monitor not found or has invalid format in API response');
      }

      const rate: number = bcvMonitor.price;
      // --- FIN DE LA CORRECCIÓN ---
      
      console.log(`Successfully fetched rate: ${rate}`);
      return rate;
    } catch (error) {
      console.error('Could not fetch BCV rate:', error);
      // Si algo falla, devolvemos null para no romper la tienda.
      return null;
    }
  },
  ['bcv-rate'], // Clave única para identificar este caché.
  { 
    revalidate: 43200,
    tags: ['rates'],
  }
);

// Función de ayuda para formatear números a la moneda de Bolívares.
export function formatToVes(amount: number) {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}