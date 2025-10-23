'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface User {
  id: number;
  name: string;
  email: string;
}

interface VipAssignFormProps {
  user: User;
}

export default function VipAssignForm({ user }: VipAssignFormProps) {
  const [creditLimit, setCreditLimit] = useState('');
  const [paymentDueDate, setPaymentDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/club/assign-vip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.email,
          creditLimit: parseFloat(creditLimit),
          notes,
          paymentDueDate: paymentDueDate || null
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setMessage('Crédito VIP asignado exitosamente');
        setMessageType('success');
        setTimeout(() => {
          window.location.href = '/admin/club?tab=vip&reload=true';
        }, 2000);
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error || 'Error desconocido'}`);
        setMessageType('error');
      }
    } catch (error: any) {
      console.error('Error:', error);
      setMessage(`Error de conexión: ${error.message || 'Error desconocido'}`);
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="creditLimit">Límite de Crédito ($)</Label>
        <Input
          id="creditLimit"
          type="number"
          step="0.01"
          value={creditLimit}
          onChange={(e) => setCreditLimit(e.target.value)}
          placeholder="500.00"
          required
        />
      </div>

      <div>
        <Label htmlFor="paymentDueDate">Día de Corte Mensual</Label>
        <select 
          id="paymentDueDate"
          className="w-full p-2 border rounded"
          value={paymentDueDate}
          onChange={(e) => setPaymentDueDate(e.target.value)}
        >
          <option value="">Seleccionar día...</option>
          <option value="1">Día 1 de cada mes</option>
          <option value="5">Día 5 de cada mes</option>
          <option value="10">Día 10 de cada mes</option>
          <option value="15">Día 15 de cada mes</option>
          <option value="20">Día 20 de cada mes</option>
          <option value="25">Día 25 de cada mes</option>
          <option value="ultimo">Ultimo día del mes</option>
          <option value="habil">Primer día hábil del mes</option>
        </select>
      </div>

      <div>
        <Label htmlFor="notes">Notas</Label>
        <Input
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Cliente premium, excelente historial..."
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Asignando...' : 'Asignar Crédito VIP'}
        </Button>
        <Button type="button" variant="outline" onClick={() => window.location.href = '/admin/club'}>
          Cancelar
        </Button>
      </div>
      </form>
    </div>
  );
}