// src/app/api/auth/forgot-password/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import crypto from 'crypto';

const prisma = new PrismaClient();

if (!process.env.RESEND_API_KEY) {
  throw new Error('La variable de entorno RESEND_API_KEY no está configurada.');
}
const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    console.log(`[FORGOT-PASSWORD] Solicitud recibida para el email: ${email}`);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`[FORGOT-PASSWORD] Email no encontrado en la base de datos. Enviando respuesta genérica.`);
      return NextResponse.json({ message: 'Si existe una cuenta con este correo, se ha enviado un enlace de recuperación.' });
    }
    
    console.log(`[FORGOT-PASSWORD] Usuario encontrado. Generando token...`);
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
    console.log(`[FORGOT-PASSWORD] Enlace de reseteo generado: ${resetUrl}`);
    console.log(`[FORGOT-PASSWORD] Intentando enviar email a ${user.email} desde ${fromEmail}...`);

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: user.email,
      subject: 'Recuperación de Contraseña - Casa Dulce Oriente',
      html: `<p>Haz clic <a href="${resetUrl}">aquí</a> para resetear tu contraseña.</p>`,
    });

    if (error) {
      // Si Resend devuelve un error, lo mostramos claramente en la consola del servidor.
      console.error('[FORGOT-PASSWORD] Error devuelto por Resend:', error);
      throw new Error('El servicio de correo no pudo enviar el email.');
    }

    console.log('[FORGOT-PASSWORD] Email enviado con éxito, ID de Resend:', data?.id);
    return NextResponse.json({ message: 'Si existe una cuenta con este correo, se ha enviado un enlace de recuperación.' });

  } catch (error) {
    console.error("[FORGOT-PASSWORD] Error en el bloque catch:", error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
