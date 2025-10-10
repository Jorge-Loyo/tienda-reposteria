// src/app/api/auth/login/route.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';
import { prisma } from '@/lib/prisma';
import { logError, sanitizeForLog } from '@/lib/logger';
import { isValidEmail, sanitizeText } from '@/lib/sanitizer';
import { rateLimit, getClientIP } from '@/lib/rate-limit';

// Validar que JWT_SECRET esté configurado
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
  try {
    // Rate limiting por IP
    const clientIP = getClientIP(request);
    const rateLimitResult = rateLimit(`login:${clientIP}`, 5, 300000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Demasiados intentos de inicio de sesión. Intenta de nuevo más tarde.' },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
          }
        }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    // Validación más estricta
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'El correo y la contraseña son requeridos' }, { status: 400 });
    }

    // Sanitizar y validar email
    const sanitizedEmail = sanitizeText(email);
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json({ error: 'Formato de email inválido' }, { status: 400 });
    }

    // Validar longitud de contraseña
    if (password.length < 6 || password.length > 128) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // 1. Buscar al usuario por su email
    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    // 2. Si no se encuentra el usuario o la contraseña no coincide, devolvemos el mismo error genérico por seguridad.
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // 3. Si las credenciales son válidas, creamos el token de sesión
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: '8h', // El token expira en 8 horas
      }
    );

    // 4. Creamos una cookie segura que solo el servidor puede leer
    const sessionCookie = serialize('sessionToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8, // 8 horas en segundos
      path: '/',
      sameSite: 'strict',
    });

    // 5. Enviamos la respuesta exitosa con la cookie
    const response = NextResponse.json({ message: 'Inicio de sesión exitoso' });
    response.headers.set('Set-Cookie', sessionCookie);
    return response;

  } catch (error) {
    logError('Error en el login', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}