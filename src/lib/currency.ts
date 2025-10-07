import { unstable_cache as cache } from 'next/cache';
import * as cheerio from 'cheerio';
import https from 'https'; // Módulo para el agente HTTPS
import axios from 'axios'; // Nueva librería para peticiones HTTP

/**
 * Interfaz que define la estructura esperada de la respuesta de la API para la tasa del BCV.
 */
interface BcvApiResponse {
  title: string;
  price: number;
  last_update: string;
}

/**
 * Agente HTTPS personalizado para ignorar errores de verificación de certificados SSL.
 * Esto es necesario para sitios como el del BCV que pueden tener problemas de certificado.
 */
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

/**
 * Intenta obtener la tasa de cambio desde la API principal.
 * @returns {Promise<number | null>} La tasa de cambio o null si falla.
 */
async function getRateFromApi(): Promise<number | null> {
  try {
    console.log('Intentando obtener la tasa del BCV desde la API...');
    const response = await fetch('https://pydolarvenezuela.vercel.app/api/v1/dollar/bcv', {
      next: { revalidate: 21600 }, // Cache de 6 horas
    });

    if (!response.ok) {
      console.error('API falló con estado:', response.status);
      return null;
    }

    const data: BcvApiResponse = await response.json();
    const rate = data?.price;

    if (typeof rate === 'number') {
      console.log('Tasa obtenida de la API exitosamente:', rate);
      return rate;
    }
    
    console.error('El formato de la tasa en la respuesta de la API no es el esperado.');
    return null;
  } catch (error) {
    console.error('Error al contactar la API:', error instanceof Error ? error.message : 'Error desconocido');
    return null;
  }
}

/**
 * Extrae la tasa de cambio directamente desde la página web del BCV usando Axios.
 * Este es el método de respaldo, más robusto para problemas de SSL.
 * @returns {Promise<number | null>} La tasa de cambio o null si falla.
 */
async function getRateFromBcvWebsite(): Promise<number | null> {
  try {
    console.log('FALLBACK: Intentando obtener la tasa directamente del sitio web del BCV con Axios...');
    // Hacemos la petición con Axios, pasándole nuestro agente HTTPS personalizado.
    const response = await axios.get('https://www.bcv.org.ve/', {
      httpsAgent,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const rateText = $('#dolar strong').text().trim();

    if (!rateText) {
      console.error('No se pudo encontrar el elemento de la tasa en el HTML del BCV.');
      return null;
    }

    const rate = parseFloat(rateText.replace(/\./g, '').replace(',', '.'));

    if (isNaN(rate)) {
      console.error('No se pudo convertir el texto de la tasa a un número.');
      return null;
    }

    console.log('Tasa obtenida del sitio web del BCV exitosamente:', rate);
    return rate;
  } catch (error) {
    console.error('Error durante el web scraping al sitio del BCV con Axios:', error instanceof Error ? error.message : 'Error desconocido');
    return null;
  }
}

/**
 * Formatea un valor numérico a una cadena de texto en formato de moneda de Bolívares (Bs.).
 * Utiliza la API de internacionalización del navegador para un formato correcto.
 * @param amount El monto a formatear.
 * @returns Una cadena de texto con el formato de moneda, por ejemplo "1.234,56 Bs.".
 */
export function formatToVes(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'Monto inválido';
  }

  // Usamos 'es-VE' para las convenciones de formato de Venezuela.
  const formatter = new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Reemplazamos el código de moneda 'VES' por el símbolo más común 'Bs.'
  return formatter.format(amount).replace('VES', 'Bs.');
}


/**
 * Obtiene la tasa de cambio actual del Dólar (USD) según el BCV con un sistema de fallback.
 * Primero intenta con una API y si falla, hace web scraping al sitio oficial del BCV.
 * La función está cacheada por Next.js para optimizar el rendimiento.
 *
 * @returns {Promise<number | null>} Una promesa que se resuelve con la tasa, o `null` si ambos métodos fallan.
 */
export const getBcvRate = cache(
  async (): Promise<number | null> => {
    let rate = await getRateFromApi();

    if (rate === null) {
      rate = await getRateFromBcvWebsite();
    }

    if (rate === null) {
        console.error('FALLO TOTAL: No se pudo obtener la tasa del BCV por ninguna de las vías.');
    }

    return rate;
  },
  ['bcv-exchange-rate-v2'], // Cambiamos la clave para invalidar el caché anterior
  {
    tags: ['exchange-rate', 'bcv'],
  }
);