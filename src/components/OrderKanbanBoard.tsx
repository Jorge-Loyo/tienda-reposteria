// src/components/OrderKanbanBoard.tsx
'use client';

import { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRouter } from 'next/navigation';
import { Order } from '@prisma/client';

// Tipos para nuestros datos
type OrderWithStatus = Pick<Order, 'id' | 'customerName' | 'total' | 'status'>;
type OrderColumns = {
  [key: string]: OrderWithStatus[];
};

// Componente para una tarjeta de pedido individual
function OrderCard({ order }: { order: OrderWithStatus }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: order.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 mb-2 bg-white rounded-md shadow-sm border cursor-grab active:cursor-grabbing"
    >
      <p className="font-semibold text-sm text-gray-800">Pedido #{order.id}</p>
      <p className="text-sm text-gray-600">{order.customerName}</p>
      <p className="text-sm font-bold mt-2">${order.total.toFixed(2)}</p>
    </div>
  );
}

// Componente para una columna de estado
function OrderColumn({ title, orders }: { title: string; orders: OrderWithStatus[] }) {
  const { setNodeRef } = useSortable({ id: title });
  return (
    <div ref={setNodeRef} className="bg-gray-100 p-4 rounded-lg w-72 flex-shrink-0">
      <h3 className="font-bold mb-4 capitalize text-center">{title.replace(/_/g, ' ').toLowerCase()}</h3>
      <SortableContext items={orders.map(o => o.id)}>
        <div className="space-y-2 min-h-[100px]">
          {orders.map(order => <OrderCard key={order.id} order={order} />)}
        </div>
      </SortableContext>
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;
    
    const activeContainer = active.data.current?.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId || over.id;

    if (activeContainer === overContainer) {
      // Mover dentro de la misma columna (reordenar)
      const items = columns[activeContainer];
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      if (oldIndex !== newIndex) {
        setColumns(prev => ({
          ...prev,
          [activeContainer]: arrayMove(items, oldIndex, newIndex),
        }));
      }
    } else {
      // Mover a una nueva columna (cambiar estado)
      const orderId = active.id as number;
      const newStatus = overContainer as string;
      
      // Actualización optimista: mover la tarjeta visualmente al instante
      const activeItems = columns[activeContainer];
      const overItems = columns[overContainer];
      const activeIndex = activeItems.findIndex(item => item.id === orderId);
      
      const [movedItem] = activeItems.splice(activeIndex, 1);
      movedItem.status = newStatus;
      overItems.push(movedItem);

      setColumns({ ...columns });

      // Llamada a la API para actualizar el estado en la base de datos
      try {
        await fetch(`/api/orders/${orderId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
        // Refrescamos los datos desde el servidor para asegurar consistencia
        router.refresh();
      } catch (error) {
        console.error("Failed to update order status:", error);
        // Aquí podríamos implementar una lógica para revertir el cambio visual si falla la API
        alert('No se pudo actualizar el estado del pedido.');
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <div className="flex gap-4 overflow-x-auto p-4">
        {orderStatuses.map(status => (
          <OrderColumn key={status} title={status} orders={columns[status] || []} />
        ))}
      </div>
    </DndContext>
  );
}