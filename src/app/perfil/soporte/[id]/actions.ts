'use server';

import { PrismaClient } from '@prisma/client';
import { getSessionData } from '@/lib/session';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function addUserResponse(ticketId: number, message: string) {
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

  // Crear la respuesta del usuario
  await prisma.ticketResponse.create({
    data: {
      ticketId,
      message,
      isFromUser: true
    }
  });

  revalidatePath(`/perfil/soporte/${ticketId}`);
  return { success: true };
}