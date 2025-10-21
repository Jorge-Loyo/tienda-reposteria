import { getSessionData } from '@/lib/session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function MisReportes() {
  const session = await getSessionData();
  if (!session) return null;

  const tickets = await prisma.supportTicket.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'en_proceso': return 'bg-blue-100 text-blue-800';
      case 'resuelto': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgente': return 'text-red-600';
      case 'alta': return 'text-orange-600';
      case 'media': return 'text-yellow-600';
      case 'baja': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="glass p-8 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold gradient-text mb-6">Mis Reportes</h2>
      
      {tickets.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path>
            </svg>
          </div>
          <p className="text-gray-600">No tienes reportes de soporte</p>
          <p className="text-sm text-gray-500 mt-2">Tus reportes aparecerán aquí una vez que los envíes</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="p-4 bg-white/50 rounded-xl border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800">{ticket.subject}</h3>
                  <p className="text-sm text-gray-600">#{ticket.ticketNumber}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status === 'pendiente' ? 'Pendiente' : 
                     ticket.status === 'en_proceso' ? 'En Proceso' : 'Resuelto'}
                  </span>
                  <span className={`text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{ticket.description}</p>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  {new Date(ticket.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <a 
                  href={`/perfil/soporte/${ticket.id}`}
                  className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-3 py-1 rounded-lg text-xs font-medium hover:shadow-lg transition-all duration-200"
                >
                  Ver Conversación
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}