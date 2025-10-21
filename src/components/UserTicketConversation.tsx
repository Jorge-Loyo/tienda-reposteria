'use client';

import { useState } from 'react';
import { addUserResponse } from '@/app/perfil/soporte/[id]/actions';

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

interface UserTicketConversationProps {
  ticket: Ticket;
}

export default function UserTicketConversation({ ticket }: UserTicketConversationProps) {
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendResponse = async () => {
    if (!response.trim()) return;
    
    setIsSubmitting(true);
    try {
      const result = await addUserResponse(ticket.id, response);
      if (result.success) {
        setResponse('');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      alert('Error al enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="space-y-8">
      {/* Información del ticket */}
      <div className="glass p-6 rounded-2xl shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Información del Ticket</h3>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Tipo:</strong> {ticket.type}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Fecha:</strong> {new Date(ticket.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            {ticket.orderNumber && (
              <p className="text-sm text-gray-600">
                <strong>Pedido:</strong> {ticket.orderNumber}
              </p>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Estado Actual</h3>
            <div className="flex gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                {ticket.status === 'pendiente' ? 'Pendiente' : 
                 ticket.status === 'en_proceso' ? 'En Proceso' : 'Resuelto'}
              </span>
              <span className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                Prioridad: {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Conversación */}
      <div className="glass p-6 rounded-2xl shadow-xl">
        <h3 className="text-xl font-bold gradient-text mb-6">Conversación</h3>
        
        <div className="space-y-4">
          {/* Mensaje inicial del usuario */}
          <div className="flex justify-start">
            <div className="max-w-3xl">
              <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-sm">
                <p className="text-gray-800">{ticket.description}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-2">
                Tú - {new Date(ticket.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* Respuestas */}
          {ticket.responses && ticket.responses.length > 0 ? (
            ticket.responses.map((response) => (
              <div key={response.id} className={`flex ${response.isFromUser ? 'justify-start' : 'justify-end'}`}>
                <div className="max-w-3xl">
                  <div className={`p-4 rounded-2xl ${response.isFromUser ? 'bg-gray-100 rounded-bl-sm' : 'bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-br-sm'}`}>
                    <p>{response.message}</p>
                  </div>
                  <p className={`text-xs text-gray-500 mt-1 ${response.isFromUser ? 'ml-2' : 'mr-2 text-right'}`}>
                    {response.isFromUser ? 'Tú' : 'Soporte Casa Dulce'} - {new Date(response.createdAt).toLocaleDateString('es-ES', {
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
            <div className="text-center py-8 text-gray-500">
              <p>Esperando respuesta del equipo de soporte...</p>
              <p className="text-sm mt-2">Te notificaremos cuando tengamos una respuesta para ti.</p>
            </div>
          )}
        </div>

        {/* Formulario de respuesta */}
        {ticket.status !== 'resuelto' && (
          <div className="border-t pt-6 mt-6">
            <h4 className="font-semibold text-gray-800 mb-4">Agregar Mensaje</h4>
            <div className="space-y-4">
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Escribe tu mensaje..."
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSendResponse}
                  disabled={isSubmitting || !response.trim()}
                  className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}