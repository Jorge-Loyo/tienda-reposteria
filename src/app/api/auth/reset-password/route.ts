// src/app/api/auth/reset-password/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Faltan datos requeridos.' }, { status: 400 });
    }

    // 1. Encriptamos el token recibido para poder compararlo con el de la BD
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
      
    // 2. Buscamos un usuario con ese token Y que no haya expirado
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: {
          gte: new Date(), // 'gte' significa "mayor o igual que" la fecha actual
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'El token es inválido o ha expirado.' }, { status: 400 });
    }

    // 3. Si el token es válido, encriptamos la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Actualizamos la contraseña y limpiamos los campos de reseteo
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null, // Limpiamos el token para que no se pueda reusar
        passwordResetExpires: null,
      },
    });

    return NextResponse.json({ message: '¡Contraseña actualizada con éxito!' });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}