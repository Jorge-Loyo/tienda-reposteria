'use server';

import { PrismaClient } from '@prisma/client';
import { getSessionData } from '@/lib/session';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function addUserResponse(ticketId: number, message: string) {
  try {
    const session = await getSessionData();
    if (!session) {
      throw new Error('No autorizado');
    }

    // Verificar que el ticket pertenece al usuario
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId, userId: session.userId }
    });

    if (!ticket) {
      throw new Error('Ticket no encontrado');
    }

    if (ticket.status === 'resuelto') {
      throw new Error('No se puede responder a un ticket resuelto');
    }

    // Crear la respuesta del usuario
    await prisma.ticketResponse.create({
      data: {
        ticketId,
        message: message.trim(),
        isFromUser: true
      }
    });

    // Actualizar el timestamp del ticket
    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { updatedAt: new Date() }
    });

    revalidatePath(`/perfil/soporte/${ticketId}`);
    revalidatePath('/admin/consultas');
    return { success: true };
  } catch (error) {
    console.error('Error adding user response:', error);
    throw error;
  }
}