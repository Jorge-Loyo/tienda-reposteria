import { getSessionData } from '@/lib/session';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import TicketConversation from '@/components/TicketConversation';

const prisma = new PrismaClient();

export default async function TicketDetailPage({ params }: { params: { id: string } }) {
  const session = await getSessionData();
  if (!session) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true },
  });

  if (!user || !['MASTER', 'ADMINISTRADOR', 'MARKETING'].includes(user.role)) {
    redirect('/');
  }

  const ticket = await prisma.supportTicket.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      responses: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });


  if (!ticket) {
    redirect('/admin/consultas');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-12">
          <a href="/admin/consultas" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            ← Volver a Consultas
          </a>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold gradient-text mb-2">Ticket #{ticket.ticketNumber}</h1>
          <p className="text-gray-600">{ticket.subject}</p>
        </div>

        <TicketConversation ticket={ticket} />
      </div>
    </div>
  );
}