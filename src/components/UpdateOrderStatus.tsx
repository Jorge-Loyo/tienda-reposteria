// src/components/UpdateOrderStatus.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Definimos los posibles estados de un pedido
const ORDER_STATUSES = ["PENDIENTE_DE_PAGO", "PAGADO","ARMADO", "ENVIADO", "CANCELADO"];

interface UpdateOrderStatusProps {
  orderId: number;
  currentStatus: string;
}

export default function UpdateOrderStatus({ orderId, currentStatus }: UpdateOrderStatusProps) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar el estado del pedido.');
      }
      
      alert('¡Estado del pedido actualizado con éxito!');
      router.refresh();

    } catch (error) {
      console.error(error);
      alert('Hubo un problema al actualizar el estado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Cambiar estado" />
        </SelectTrigger>
        <SelectContent>
          {ORDER_STATUSES.map(status => (
            <SelectItem key={status} value={status}>
              {status.replace(/_/g, ' ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleUpdateStatus} disabled={isLoading || selectedStatus === currentStatus}>
        {isLoading ? 'Guardando...' : 'Guardar'}
      </Button>
    </div>
  );
}