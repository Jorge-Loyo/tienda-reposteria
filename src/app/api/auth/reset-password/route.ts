// src/app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { logError, logInfo } from '@/lib/logger';
import { rateLimit, getClientIP } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    // Rate limiting por IP
    const clientIP = getClientIP(request);
    const rateLimitResult = rateLimit(`reset-password:${clientIP}`, 3, 300000); // 3 intentos por 5 minutos
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Demasiados intentos de reseteo. Intenta de nuevo más tarde.' },
        { status: 429 }
      );
    }

    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Faltan datos requeridos.' }, { status: 400 });
    }

    // Validar longitud de contraseña
    if (password.length < 6 || password.length > 128) {
      return NextResponse.json({ error: 'La contraseña debe tener entre 6 y 128 caracteres.' }, { status: 400 });
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
    const hashedPassword = await bcrypt.hash(password, 12); // Aumentamos el costo a 12

    // 4. Actualizamos la contraseña y limpiamos los campos de reseteo
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null, // Limpiamos el token para que no se pueda reusar
        passwordResetExpires: null,
      },
    });

    logInfo('Password reset successful for user', user.id);
    return NextResponse.json({ message: '¡Contraseña actualizada con éxito!' });

  } catch (error) {
    logError('Error en reset password', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}