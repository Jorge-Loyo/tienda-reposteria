'use server';

import { PrismaClient } from '@prisma/client';
import { getSessionData } from '@/lib/session';

const prisma = new PrismaClient();

export async function createSupportTicket(formData: FormData) {
  const session = await getSessionData();
  if (!session) {
    throw new Error('No autorizado');
  }

  const ticketNumber = `TK-${Date.now().toString().slice(-6)}`;
  
  const ticket = await prisma.supportTicket.create({
    data: {
      ticketNumber,
      userId: session.userId,
      type: formData.get('type') as string,
      subject: formData.get('subject') as string,
      description: formData.get('description') as string,
      orderNumber: formData.get('orderNumber') as string || null,
      priority: formData.get('priority') as string || 'media'
    }
  });

  return { success: true, ticketNumber: ticket.ticketNumber };
}