'use client';

import { useState } from 'react';
import { updateTicketStatus, updateTicketPriority, addTicketResponse } from '@/app/admin/consultas/actions';

interface Ticket {
  id: number;
  ticketNumber: string;
  subject: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  orderNumber: string | null;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
}

interface TicketManagerProps {
  tickets: Ticket[];
}

export default function TicketManager({ tickets }: TicketManagerProps) {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusChange = async (ticketId: number, status: string) => {
    await updateTicketStatus(ticketId, status);
  };

  const handlePriorityChange = async (ticketId: number, priority: string) => {
    await updateTicketPriority(ticketId, priority);
  };

  const handleSendResponse = async () => {
    if (!selectedTicket || !response.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addTicketResponse(selectedTicket.id, response);
      setResponse('');
      setSelectedTicket(null);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div>
        <div className="glass p-6 rounded-2xl shadow-xl">
          <h2 className="text-xl font-bold gradient-text mb-6">Reportes de Soporte</h2>
          
          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay consultas pendientes</h3>
              <p className="text-gray-600">Las consultas de soporte de los usuarios aparecerán aquí</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div 
                  key={ticket.id} 
                  className="p-6 bg-white/70 rounded-xl border hover:bg-white hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{ticket.subject}</h3>
                      <p className="text-sm text-gray-600">
                        #{ticket.ticketNumber} - {ticket.user.name || ticket.user.email}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <select 
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="px-2 py-1 rounded text-xs bg-white text-gray-800 border"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en_proceso">En Proceso</option>
                        <option value="resuelto">Resuelto</option>
                      </select>
                      <select 
                        value={ticket.priority}
                        onChange={(e) => handlePriorityChange(ticket.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="px-2 py-1 rounded text-xs bg-white text-gray-800 border"
                      >
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                        <option value="urgente">Urgente</option>
                      </select>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{ticket.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                    <span>Tipo: {ticket.type}</span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                  {ticket.orderNumber && (
                    <p className="text-sm text-gray-600 mb-3">Pedido: {ticket.orderNumber}</p>
                  )}
                  <div className="flex justify-end">
                    <a 
                      href={`/admin/consultas/${ticket.id}`}
                      className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200"
                    >
                      Ver Conversación
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>


    </div>
  );
}