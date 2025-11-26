// src/app/api/auth/login/route.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';
import db from '@/db/db';
import { isValidEmail, sanitizeText } from '@/lib/sanitizer';

// Validar que JWT_SECRET esté configurado
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
  try {


    let email, password;
    
    // Manejar tanto JSON como form-data
    const contentType = request.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const body = await request.json();
      email = body.email;
      password = body.password;
    } else {
      const formData = await request.formData();
      email = formData.get('email') as string;
      password = formData.get('password') as string;
    }

    // Validación más estricta
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.redirect(new URL('/login?error=missing_fields', request.url));
    }

    // Sanitizar y validar email (convertir a minúsculas)
    const sanitizedEmail = sanitizeText(email).toLowerCase();
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.redirect(new URL('/login?error=invalid_email', request.url));
    }

    // Validar longitud de contraseña
    if (password.length < 6 || password.length > 128) {
      return NextResponse.redirect(new URL('/login?error=invalid_credentials', request.url));
    }

    // 1. Buscar al usuario por su email
    const user = await db.user.findUnique({
      where: { email: sanitizedEmail },
    });

// 2. Verificar si el usuario existe
if (!user) {
  // Log del intento fallido sin exponer información sensible
  console.error('Login attempt failed - User not found for email:', sanitizedEmail);
  return NextResponse.redirect(new URL('/login?error=invalid_credentials', request.url));
}

    // 3. Verificar si el usuario está activo
    if (!user.isActive) {
      console.error('Login attempt failed - Inactive user attempted login:', sanitizedEmail);
      return NextResponse.redirect(new URL('/login?error=account_disabled', request.url));
    }

    // 4. Verificar la contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.error('Login attempt failed - Invalid password for user:', sanitizedEmail);
      return NextResponse.redirect(new URL('/login?error=invalid_credentials', request.url));
    }

    // 5. Login exitoso - crear token de sesión
    console.log('Login successful - User logged in:', sanitizedEmail, 'with role:', user.role);
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

    // 6. Creamos una cookie segura que solo el servidor puede leer
    const sessionCookie = serialize('sessionToken', token, {
      httpOnly: true,
      secure:false, //process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8, // 8 horas en segundos
      path: '/',
      sameSite: 'strict',
    });

    // 7. Enviamos la respuesta exitosa con la cookie
    // Obtener la URL base (que ya configuraste en el .env)
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    // Todos los usuarios se redirigen a perfil
    const redirectPath = '/perfil';

    // Crear la URL absoluta de redirección
    const redirectUrl = new URL(redirectPath, BASE_URL);

    // Enviar la respuesta con la cookie y la URL absoluta
    const response = NextResponse.redirect(redirectUrl);
    response.headers.set('Set-Cookie', sessionCookie);
    return response;

  } catch (error) {
    console.error('Error en el login:', error);
    return NextResponse.redirect(new URL('/login?error=server_error', request.url));
  }
}
