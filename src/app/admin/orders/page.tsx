// src/app/admin/orders/page.tsx

import { PrismaClient, Prisma } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import OrderSearchInput from '@/components/OrderSearchInput';
import { OrderStatusFilter } from '@/components/OrderStatusFilter';

// Forzamos el renderizado dinámico de la página
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

async function getOrders(searchQuery?: string, statusQuery?: string) {
  try {
    const filters: Prisma.OrderWhereInput[] = [];

    // Filtro de estado
    if (statusQuery && statusQuery !== 'Todos') {
      filters.push({ status: statusQuery });
    }

    // Filtro de búsqueda
    if (searchQuery) {
      const numericId = parseInt(searchQuery, 10);
      filters.push({
        OR: [
          // Se elimina 'mode: insensitive' para máxima compatibilidad con SQLite
          { customerName: { contains: searchQuery } },
          { instagram: { contains: searchQuery } },
          ...(isNaN(numericId) ? [] : [{ id: numericId }]),
        ],
      });
    }
    
    const whereClause: Prisma.OrderWhereInput = filters.length > 0 ? { AND: filters } : {};

    const orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      // Incluimos explícitamente todos los campos que la tabla necesita
      select: {
        id: true,
        customerName: true,
        instagram: true,
        createdAt: true,
        status: true,
        total: true,
      }
    });
    return orders;
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    return [];
  }
}

function StatusBadge({ status }: { status: string }) {
  const baseClasses = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize";
  let colorClasses = "bg-gray-100 text-gray-800";
  switch (status) {
    case "PENDIENTE_DE_PAGO": colorClasses = "bg-yellow-100 text-yellow-800"; break;
    case "PAGADO": colorClasses = "bg-blue-100 text-blue-800"; break;
    case "ARMADO": colorClasses = "bg-purple-100 text-purple-800"; break;
    case "ENVIADO": colorClasses = "bg-green-100 text-green-800"; break;
    case "CANCELADO": colorClasses = "bg-red-100 text-red-800"; break;
  }
  return ( <span className={`${baseClasses} ${colorClasses}`}> {status.replace(/_/g, ' ').toLowerCase()} </span> );
}

interface AdminOrdersPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  // Accedemos a los parámetros de la forma más segura posible
  const searchQuery = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const statusQuery = typeof searchParams.status === 'string' ? searchParams.status : undefined;
  
  const orders = await getOrders(searchQuery, statusQuery);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Pedidos
        </h1>
         <Button variant="outline" asChild>
          <Link href="/admin">Volver al Dashboard</Link>
        </Button>
      </div>

      <div className="space-y-4">
        <OrderSearchInput />
        <OrderStatusFilter />
      </div>

      <div className="mt-6 overflow-x-auto shadow-md rounded-lg">
        <div className="p-4 bg-white border-b">
          <p className="text-sm text-gray-600">Mostrando <span className="font-bold">{orders.length}</span> pedido(s).</p>
        </div>
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-6 uppercase font-semibold text-sm">ID Pedido</th>
              <th className="text-left py-3 px-6 uppercase font-semibold text-sm">Cliente</th>
              <th className="text-left py-3 px-6 uppercase font-semibold text-sm">Alias/IG</th>
              <th className="text-left py-3 px-6 uppercase font-semibold text-sm">Fecha</th>
              <th className="text-left py-3 px-6 uppercase font-semibold text-sm">Estado</th>
              <th className="text-right py-3 px-6 uppercase font-semibold text-sm">Total</th>
              <th className="text-center py-3 px-6 uppercase font-semibold text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6 font-medium">#{order.id}</td>
                <td className="py-4 px-6">{order.customerName}</td>
                <td className="py-4 px-6">{order.instagram || 'N/A'}</td>
                <td className="py-4 px-6">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="py-4 px-6"><StatusBadge status={order.status} /></td>
                <td className="py-4 px-6 text-right font-medium">${order.total.toFixed(2)}</td>
                <td className="py-4 px-6 text-center">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/orders/${order.id}`}>Ver Detalles</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}