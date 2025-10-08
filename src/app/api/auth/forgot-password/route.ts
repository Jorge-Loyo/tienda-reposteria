// src/app/api/auth/forgot-password/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import crypto from 'crypto';
import { logError, logInfo, sanitizeForLog } from '@/lib/logger';

const prisma = new PrismaClient();

if (!process.env.RESEND_API_KEY) {
  throw new Error('La variable de entorno RESEND_API_KEY no está configurada.');
}
const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    logInfo('FORGOT-PASSWORD: Solicitud recibida', sanitizeForLog(email));

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      logInfo('FORGOT-PASSWORD: Email no encontrado, enviando respuesta genérica');
      return NextResponse.json({ message: 'Si existe una cuenta con este correo, se ha enviado un enlace de recuperación.' });
    }
    
    logInfo('FORGOT-PASSWORD: Usuario encontrado, generando token');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hora desde ahora

    await prisma.user.update({
      where: { email },
      data: {
        passwordResetToken,
        passwordResetExpires,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;
    logInfo('FORGOT-PASSWORD: Enlace generado');
    logInfo('FORGOT-PASSWORD: Enviando email');

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: user.email,
      subject: 'Recuperación de Contraseña - Casa Dulce Oriente',
      html: `<p>Haz clic <a href="${resetUrl}">aquí</a> para resetear tu contraseña.</p>`,
    });

    if (error) {
      logError('FORGOT-PASSWORD: Error de Resend', error);
      throw new Error('El servicio de correo no pudo enviar el email.');
    }

    logInfo('FORGOT-PASSWORD: Email enviado con éxito', data?.id);
    return NextResponse.json({ message: 'Si existe una cuenta con este correo, se ha enviado un enlace de recuperación.' });

  } catch (error) {
    logError('FORGOT-PASSWORD: Error en el proceso', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
