'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function updateTicketStatus(ticketId: number, status: string) {
  await prisma.supportTicket.update({
    where: { id: ticketId },
    data: { status }
  });
  
  revalidatePath('/admin/consultas');
}

export async function updateTicketPriority(ticketId: number, priority: string) {
  await prisma.supportTicket.update({
    where: { id: ticketId },
    data: { priority }
  });
  
  revalidatePath('/admin/consultas');
}

export async function addTicketResponse(ticketId: number, message: string) {
  // Crear la respuesta del soporte
  await prisma.ticketResponse.create({
    data: {
      ticketId,
      message,
      isFromUser: false
    }
  });

  // Actualizar el estado del ticket
  await prisma.supportTicket.update({
    where: { id: ticketId },
    data: { 
      status: 'en_proceso',
      updatedAt: new Date()
    }
  });
  
  revalidatePath('/admin/consultas');
  revalidatePath(`/admin/consultas/${ticketId}`);
  return { success: true };
}