// src/components/OrderKanbanBoard.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Order } from '@prisma/client';
import { Button } from '@/components/ui/button';

// Tipos para nuestros datos
type OrderWithStatus = Pick<Order, 'id' | 'customerName' | 'total' | 'status'>;
type OrderColumns = {
  [key: string]: OrderWithStatus[];
};

// Componente para una tarjeta de pedido individual
function OrderCard({ order, onStatusChange }: { order: OrderWithStatus; onStatusChange: (orderId: number, newStatus: string) => void }) {
  const statusOptions = ["PENDIENTE_DE_PAGO", "PAGADO", "ARMADO", "ENVIADO", "CANCELADO"];
  
  return (
    <div className="p-4 mb-2 bg-white rounded-md shadow-sm border">
      <p className="font-semibold text-sm text-gray-800">Pedido #{order.id}</p>
      <p className="text-sm text-gray-600">{order.customerName}</p>
      <p className="text-sm font-bold mt-2">${order.total.toFixed(2)}</p>
      <select 
        value={order.status}
        onChange={(e) => onStatusChange(order.id, e.target.value)}
        className="mt-2 text-xs w-full p-1 border rounded"
      >
        {statusOptions.map(status => (
          <option key={status} value={status}>
            {status.replace(/_/g, ' ')}
          </option>
        ))}
      </select>
    </div>
  );
}

// Componente para una columna de estado
function OrderColumn({ title, orders, onStatusChange }: { title: string; orders: OrderWithStatus[]; onStatusChange: (orderId: number, newStatus: string) => void }) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg w-72 flex-shrink-0">
      <h3 className="font-bold mb-4 capitalize text-center">{title.replace(/_/g, ' ').toLowerCase()}</h3>
      <div className="space-y-2 min-h-[100px]">
        {orders.map(order => <OrderCard key={order.id} order={order} onStatusChange={onStatusChange} />)}
      </div>
    </div>
  );
}

// Componente principal del panel
export default function OrderKanbanBoard({ initialOrders }: { initialOrders: Order[] }) {
  const router = useRouter();
  const orderStatuses = ["PENDIENTE_DE_PAGO", "PAGADO", "ARMADO", "ENVIADO", "CANCELADO"];
  
  // Agrupamos los pedidos por estado
  const initialColumns = orderStatuses.reduce((acc, status) => {
    acc[status] = initialOrders.filter(order => order.status === status);
    return acc;
  }, {} as OrderColumns);

  const [columns, setColumns] = useState<OrderColumns>(initialColumns);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    // Actualización optimista
    const updatedColumns = { ...columns };
    
    // Encontrar y mover el pedido
    for (const status in updatedColumns) {
      const orderIndex = updatedColumns[status].findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        const [order] = updatedColumns[status].splice(orderIndex, 1);
        order.status = newStatus;
        updatedColumns[newStatus].push(order);
        break;
      }
    }
    
    setColumns(updatedColumns);

    // Llamada a la API
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert('No se pudo actualizar el estado del pedido.');
      // Revertir cambios en caso de error
      setColumns(initialColumns);
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto p-4">
      {orderStatuses.map(status => (
        <OrderColumn 
          key={status} 
          title={status} 
          orders={columns[status] || []} 
          onStatusChange={handleStatusChange}
        />
      ))}
    </div>
  );
}