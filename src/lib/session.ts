import { cookies } from 'next/headers';
import { jwtVerify, JWTPayload } from 'jose';

// Extendemos el tipo JWTPayload para incluir los datos que guardamos en nuestro token
interface CustomJwtPayload extends JWTPayload {
  userId: number;
  email: string;
  role: string;
}

// Es crucial que esta clave secreta sea la misma que usas en tu endpoint de login
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'tu-secreto-super-secreto');

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
    // Devolvemos el payload con los datos del usuario (userId, email, role)
    return payload as CustomJwtPayload;
  } catch (error) {
    // Si el token es inválido o ha expirado, la verificación fallará
    console.error("Fallo al verificar el token de sesión:", error);
    return null;
  }
}