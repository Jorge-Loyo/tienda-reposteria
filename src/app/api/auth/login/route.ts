// src/app/api/auth/login/route.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

const prisma = new PrismaClient();

// Asegúrate de tener esta variable en tu archivo .env
const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-secreto-por-defecto';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'El correo y la contraseña son requeridos' }, { status: 400 });
    }

    // 1. Buscar al usuario por su email
    const user = await prisma.user.findUnique({
      where: { email },
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
    console.error('Error en el login:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}