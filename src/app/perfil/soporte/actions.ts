'use server';

import { PrismaClient } from '@prisma/client';
import { getSessionData } from '@/lib/session';

const prisma = new PrismaClient();

export async function createSupportTicket(formData: FormData) {
  try {
    const session = await getSessionData();
    if (!session) {
      throw new Error('No autorizado');
    }

    const type = formData.get('type') as string;
    const subject = formData.get('subject') as string;
    const description = formData.get('description') as string;
    const orderNumber = formData.get('orderNumber') as string;
    const priority = formData.get('priority') as string;

    // Validaciones
    if (!type || !subject || !description) {
      throw new Error('Todos los campos obligatorios deben ser completados');
    }

    if (subject.length > 200) {
      throw new Error('El asunto no puede exceder 200 caracteres');
    }

    if (description.length > 2000) {
      throw new Error('La descripción no puede exceder 2000 caracteres');
    }

    // Obtener el siguiente número de ticket
    const lastTicket = await prisma.supportTicket.findFirst({
      orderBy: { id: 'desc' },
      select: { id: true }
    });
    
    const nextNumber = (lastTicket?.id || 0) + 1;
    const ticketNumber = `TK-${nextNumber.toString().padStart(6, '0')}`;
    
    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        userId: session.userId,
        type: type.trim(),
        subject: subject.trim(),
        description: description.trim(),
        orderNumber: orderNumber?.trim() || null,
        priority: priority || 'media'
      }
    });

    return { success: true, ticketNumber: ticket.ticketNumber };
  } catch (error) {
    console.error('Error creating support ticket:', error);
    throw error;
  }
}