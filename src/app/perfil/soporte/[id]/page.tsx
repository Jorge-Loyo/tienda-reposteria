import { getSessionData } from '@/lib/session';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import ProfileLayout from '@/components/ProfileLayout';
import UserTicketConversation from '@/components/UserTicketConversation';

const prisma = new PrismaClient();

export default async function UserTicketDetailPage({ params }: { params: { id: string } }) {
  const session = await getSessionData();
  if (!session) {
    redirect('/login');
  }

  const ticket = await prisma.supportTicket.findUnique({
    where: { 
      id: parseInt(params.id),
      userId: session.userId // Solo mostrar tickets del usuario actual
    },
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
    redirect('/perfil/soporte');
  }

  return (
    <ProfileLayout currentPage="soporte">
      <div className="mb-6">
        <a href="/perfil/soporte" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          ← Volver a Soporte
        </a>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Ticket #{ticket.ticketNumber}</h1>
        <p className="text-gray-600">{ticket.subject}</p>
      </div>

      <UserTicketConversation ticket={ticket} />
    </ProfileLayout>
  );
}