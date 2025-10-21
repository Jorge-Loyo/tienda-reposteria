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
  responses: {
    id: number;
    message: string;
    isFromUser: boolean;
    createdAt: string;
  }[];
}

interface TicketConversationProps {
  ticket: Ticket;
}

export default function TicketConversation({ ticket }: TicketConversationProps) {
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusChange = async (status: string) => {
    await updateTicketStatus(ticket.id, status);
  };

  const handlePriorityChange = async (priority: string) => {
    await updateTicketPriority(ticket.id, priority);
  };

  const handleSendResponse = async () => {
    if (!response.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addTicketResponse(ticket.id, response);
      setResponse('');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Información del ticket */}
      <div className="glass p-6 rounded-2xl shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Información del Usuario</h3>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Nombre:</strong> {ticket.user.name || 'No especificado'}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Email:</strong> {ticket.user.email}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Tipo:</strong> {ticket.type}
            </p>
            {ticket.orderNumber && (
              <p className="text-sm text-gray-600">
                <strong>Pedido:</strong> {ticket.orderNumber}
              </p>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Estado del Ticket</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select 
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="resuelto">Resuelto</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                <select 
                  value={ticket.priority}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conversación */}
      <div className="glass p-6 rounded-2xl shadow-xl">
        <h3 className="text-xl font-bold gradient-text mb-6">Conversación</h3>
        
        <div className="space-y-4 mb-6">
          {/* Mensaje inicial del usuario */}
          <div className="flex justify-start">
            <div className="max-w-3xl">
              <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-sm">
                <p className="text-gray-800">{ticket.description}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-2">
                {ticket.user.name || ticket.user.email} - {new Date(ticket.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* Respuestas del soporte */}
          {ticket.responses && ticket.responses.length > 0 ? (
            ticket.responses.map((response) => (
              <div key={response.id} className={`flex ${response.isFromUser ? 'justify-start' : 'justify-end'}`}>
                <div className="max-w-3xl">
                  <div className={`p-4 rounded-2xl ${response.isFromUser ? 'bg-gray-100 rounded-bl-sm' : 'bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-br-sm'}`}>
                    <p>{response.message}</p>
                  </div>
                  <p className={`text-xs text-gray-500 mt-1 ${response.isFromUser ? 'ml-2' : 'mr-2 text-right'}`}>
                    {response.isFromUser ? (ticket.user.name || ticket.user.email) : 'Soporte'} - {new Date(response.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              No hay respuestas aún
            </div>
          )}
        </div>

        {/* Formulario de respuesta */}
        <div className="border-t pt-6">
          <h4 className="font-semibold text-gray-800 mb-4">Responder al Usuario</h4>
          <div className="space-y-4">
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Escribe tu respuesta al usuario..."
            />
            <div className="flex justify-end">
              <button
                onClick={handleSendResponse}
                disabled={isSubmitting || !response.trim()}
                className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Respuesta'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}