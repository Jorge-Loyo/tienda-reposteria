// Utilidad para logging seguro
export function sanitizeForLog(input: unknown): string {
  if (typeof input === 'string') {
    // Remover caracteres peligrosos para logs
    return input.replace(/[\r\n\t]/g, '_').substring(0, 100);
  }
  if (typeof input === 'object' && input !== null) {
    return '[Object]';
  }
  return String(input).substring(0, 100);
}

export function logError(message: string, error?: unknown): void {
  const sanitizedMessage = sanitizeForLog(message);
  if (error instanceof Error) {
    console.error(`${sanitizedMessage}: ${sanitizeForLog(error.message)}`);
  } else {
    console.error(sanitizedMessage);
  }
}

export function logInfo(message: string, data?: unknown): void {
  const sanitizedMessage = sanitizeForLog(message);
  if (data) {
    console.log(`${sanitizedMessage}: ${sanitizeForLog(data)}`);
  } else {
    console.log(sanitizedMessage);
  }
}