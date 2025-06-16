// src/app/api/auth/login/route.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-secreto'; // ¡Deberías poner esto en tu .env!

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Buscar al usuario por su email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // 2. Comparar la contraseña enviada con la encriptada en la BD
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // 3. Si las credenciales son válidas, crear un token de sesión (JWT)
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

    // 4. Guardar el token en una cookie segura (HttpOnly)
    const cookie = serialize('sessionToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8, // 8 horas en segundos
      path: '/',
    });

    const response = NextResponse.json({ message: 'Inicio de sesión exitoso' });
    response.headers.set('Set-Cookie', cookie);
    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}