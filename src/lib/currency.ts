import * as cheerio from 'cheerio';
import https from 'https';
import axios from 'axios';

// Sistema de caché en memoria
let cachedRate: number | null = null;
let lastUpdate: Date | null = null;
let isUpdating = false;

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
    const response = await fetch('https://pydolarvenezuela.vercel.app/api/v1/dollar/bcv');

    if (!response.ok) {
      return null;
    }

    const data: BcvApiResponse = await response.json();
    const rate = data?.price;

    if (typeof rate === 'number' && rate > 0) {
      return rate;
    }
    
    return null;
  } catch (error) {
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
    const response = await axios.get('https://www.bcv.org.ve/', {
      httpsAgent,
      timeout: 10000
    });

    const html = response.data;
    const $ = cheerio.load(html);
    const rateText = $('#dolar strong').text().trim();

    if (!rateText) return null;

    const rate = parseFloat(rateText.replace(/\./g, '').replace(',', '.'));
    return isNaN(rate) || rate <= 0 ? null : rate;
  } catch (error) {
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
 * Verifica si necesita actualizar la tasa (primera vez o después de las 12 de la noche)
 */
function shouldUpdateRate(): boolean {
  if (!lastUpdate || cachedRate === null) return true;
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastUpdateDate = new Date(lastUpdate.getFullYear(), lastUpdate.getMonth(), lastUpdate.getDate());
  
  // Si es un día diferente y ya pasaron las 12 de la noche
  return today > lastUpdateDate;
}

/**
 * Actualiza la tasa en segundo plano
 */
async function updateRateInBackground(): Promise<void> {
  if (isUpdating) return;
  
  isUpdating = true;
  try {
    let rate = await getRateFromApi();
    if (rate === null) {
      rate = await getRateFromBcvWebsite();
    }
    
    if (rate !== null && rate > 0) {
      cachedRate = rate;
      lastUpdate = new Date();
      console.log('Tasa BCV actualizada exitosamente:', rate);
    } else {
      console.log('No se pudo obtener tasa válida del BCV');
    }
  } catch (error) {
    console.error('Error actualizando tasa BCV:', error);
  } finally {
    isUpdating = false;
  }
}

/**
 * Obtiene la tasa de cambio del BCV con caché inteligente
 */
export async function getBcvRate(): Promise<number | null> {
  // Si no hay tasa cacheada, obtenerla inmediatamente
  if (cachedRate === null) {
    await updateRateInBackground();
  }
  // Si necesita actualización, hazlo en segundo plano
  else if (shouldUpdateRate()) {
    updateRateInBackground(); // Sin await para no bloquear
  }
  
  return cachedRate;
}