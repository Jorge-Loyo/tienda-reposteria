import { cookies } from 'next/headers';
import { jwtVerify, JWTPayload } from 'jose';
import { APP_CONFIG } from './constants';

// Extendemos el tipo JWTPayload para incluir los datos que guardamos en nuestro token
interface CustomJwtPayload extends JWTPayload {
  userId: number;
  email: string;
  role: string;
}

const JWT_SECRET = new TextEncoder().encode(APP_CONFIG.JWT_SECRET);

/**
 * Obtiene y verifica los datos de la sesión del usuario desde la cookie.
 * Puede ser usado de forma segura en Server Components y Server Actions.
 * @returns {Promise<CustomJwtPayload | null>} El payload del token si es válido, o null si no lo es.
 */
export async function getSessionData(): Promise<CustomJwtPayload | null> {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('sessionToken')?.value;

  if (!sessionToken) {
    return null; // No hay token, por lo tanto no hay sesión
  }

  try {
    // Verificamos el token usando la clave secreta
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    
    // Validar que el payload tenga los campos requeridos
    const customPayload = payload as CustomJwtPayload;
    if (!customPayload.userId || !customPayload.email || !customPayload.role) {
      console.error('Token payload missing required fields');
      return null;
    }
    
    return customPayload;
  } catch (error) {
    // Log seguro sin exponer detalles del token
    console.error('Session token verification failed:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}