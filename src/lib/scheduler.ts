import { getBcvRate } from './currency';

let schedulerInitialized = false;

/**
 * Programa la actualización automática de la tasa BCV a las 12:00 AM
 */
export function initializeScheduler() {
  if (schedulerInitialized) return;
  
  schedulerInitialized = true;
  
  // Calcular tiempo hasta las 12:00 AM del siguiente día
  function getTimeUntilMidnight(): number {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Siguiente medianoche
    return midnight.getTime() - now.getTime();
  }
  
  // Programar primera actualización a medianoche
  setTimeout(() => {
    getBcvRate(); // Actualizar tasa
    
    // Programar actualizaciones diarias
    setInterval(() => {
      getBcvRate();
    }, 24 * 60 * 60 * 1000); // Cada 24 horas
    
  }, getTimeUntilMidnight());
  
  console.log('Scheduler BCV inicializado - próxima actualización a las 12:00 AM');
}