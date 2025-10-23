import { getSessionData } from '@/lib/session';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import TicketManager from '@/components/TicketManager';

const prisma = new PrismaClient();

export default async function ConsultasPage() {
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

  const ticketsData = await prisma.supportTicket.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const tickets = ticketsData.map(ticket => ({
    ...ticket,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString()
  }));

  const stats = {
    urgentes: tickets.filter(t => t.priority === 'urgente' && t.status === 'pendiente').length,
    alta: tickets.filter(t => t.priority === 'alta' && t.status === 'pendiente').length,
    pendientes: tickets.filter(t => t.status === 'pendiente').length,
    resueltas: ticketsData.filter(t => t.status === 'resuelto' && t.updatedAt.toDateString() === new Date().toDateString()).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end mb-12">
          <a href="/perfil" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            ← Volver al Perfil
          </a>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">Consultas de Soporte</h1>
          <p className="text-gray-600">Gestiona y responde las consultas de los usuarios</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass p-6 rounded-2xl shadow-xl text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{stats.urgentes}</div>
            <div className="text-sm text-gray-600">Urgentes</div>
          </div>
          <div className="glass p-6 rounded-2xl shadow-xl text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{stats.alta}</div>
            <div className="text-sm text-gray-600">Alta Prioridad</div>
          </div>
          <div className="glass p-6 rounded-2xl shadow-xl text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.pendientes}</div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>
          <div className="glass p-6 rounded-2xl shadow-xl text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.resueltas}</div>
            <div className="text-sm text-gray-600">Resueltas Hoy</div>
          </div>
        </div>

        <TicketManager tickets={tickets} />
      </div>
    </div>
  );
}