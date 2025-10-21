'use client';

import { useState } from 'react';
import { createSupportTicket } from '@/app/perfil/soporte/actions';

export default function SoporteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ ticketNumber: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const result = await createSupportTicket(formData);
      
      if (result.success) {
        setSuccess({ ticketNumber: result.ticketNumber });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar el reporte');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="glass p-8 rounded-2xl shadow-xl text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
            <path d="M9 12l2 2 4-4"></path>
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        </div>
        <h2 className="text-2xl font-bold gradient-text mb-4">¡Mensaje Enviado!</h2>
        <p className="text-gray-600 mb-6">Tu reporte ha sido enviado exitosamente. Nuestro equipo lo revisará pronto.</p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Número de Seguimiento</h3>
          <p className="text-2xl font-bold text-blue-600">{success.ticketNumber}</p>
          <p className="text-sm text-blue-600 mt-2">Guarda este número para consultar el estado de tu reporte</p>
        </div>

        <button 
          onClick={() => setSuccess(null)}
          className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
        >
          Enviar Otro Reporte
        </button>
      </div>
    );
  }

  return (
    <div className="glass p-8 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold gradient-text mb-6">Reportar Incidente</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Incidente
          </label>
          <select name="type" required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent">
            <option value="">Selecciona el tipo de problema</option>
            <option value="pedido">Problema con pedido</option>
            <option value="pago">Error en pago</option>
            <option value="entrega">Problema de entrega</option>
            <option value="producto">Calidad del producto</option>
            <option value="cuenta">Problema con mi cuenta</option>
            <option value="tecnico">Error técnico en la web</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Asunto
          </label>
          <input 
            name="subject"
            type="text" 
            required
            maxLength={200}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Describe brevemente el problema (máx. 200 caracteres)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción del Problema
          </label>
          <textarea 
            name="description"
            rows={6}
            required
            maxLength={2000}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Describe detalladamente lo que ocurrió... (máx. 2000 caracteres)"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Pedido (si aplica)
          </label>
          <input 
            name="orderNumber"
            type="text" 
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Ej: #12345"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prioridad
          </label>
          <select name="priority" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent">
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
        </button>
      </form>
    </div>
  );
}