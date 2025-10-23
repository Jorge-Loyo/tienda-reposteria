// Simple logger utility
export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(`[INFO] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  }
};

// Export individual functions for compatibility
export function logInfo(message: string, ...args: any[]) {
  console.log(`[INFO] ${message}`, ...args);
}

export function logError(message: string, ...args: any[]) {
  console.error(`[ERROR] ${message}`, ...args);
}

export function logWarn(message: string, ...args: any[]) {
  console.warn(`[WARN] ${message}`, ...args);
}

export function sanitizeForLog(data: any): string {
  if (typeof data === 'string') return data.replace(/[^\w\s-]/g, '');
  return JSON.stringify(data).replace(/[^\w\s-{}":,]/g, '');
}