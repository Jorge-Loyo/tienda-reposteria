import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getBcvRate } from '@/lib/currency';
import { PageHeader } from '@/components/PageHeader';

const prisma = new PrismaClient();

// 1. Se define el mapa de colores de estado aquí para que sea reutilizable
const statusColors: Record<string, string> = {
    PENDIENTE_DE_PAGO: "bg-yellow-100 text-yellow-800",
    PAGADO: "bg-blue-100 text-blue-800",
    ARMADO: "bg-indigo-100 text-indigo-800",
    ENVIADO: "bg-green-100 text-green-800",
    // Puedes añadir más estados y colores aquí si los necesitas
};

// Función para obtener los datos del dashboard
async function getDashboardData() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [
    todayRevenue,
    todayOrderCount,
    totalProductCount,
    bcvRate,
    recentOrders,
    todayOrdersByStatus,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: todayStart, lte: todayEnd } },
    }),
    prisma.order.count({
      where: { createdAt: { gte: todayStart, lte: todayEnd } },
    }),
    prisma.product.count(),
    getBcvRate(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.groupBy({
        by: ['status'],
        _count: {
            status: true,
        },
        where: { createdAt: { gte: todayStart, lte: todayEnd } },
    })
  ]);

  const orderStatusSummary = todayOrdersByStatus.reduce((acc, statusGroup) => {
      acc[statusGroup.status] = statusGroup._count.status;
      return acc;
  }, {} as Record<string, number>);

  return {
    todayRevenue: todayRevenue._sum.total || 0,
    todayOrderCount,
    totalProductCount,
    recentOrders,
    bcvRate,
    orderStatusSummary,
  };
}

// Componente para las tarjetas de estadísticas principales
function StatCard({ title, value, subtext }: { title: string; value: string | number; subtext?: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
      <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
}

// Componente para las tarjetas de estado de pedidos
function OrderStatusCard({ status, count }: { status: string; count: number }) {
    return (
        <div className={`p-4 rounded-lg shadow-sm border ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
            {/* CORRECCIÓN: Se reemplaza el guion bajo por un espacio */}
            <p className="text-sm font-semibold">{status.replace(/_/g, ' ')}</p>
            <p className="text-2xl font-bold">{count}</p>
        </div>
    )
}


export default async function AdminDashboardPage() {
  const data = await getDashboardData();
  const allOrderStatuses = Object.keys(statusColors);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader>Dashboard</PageHeader>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Ingresos del Día" value={`$${data.todayRevenue.toFixed(2)}`} />
        <StatCard title="Pedidos del Día" value={data.todayOrderCount} />
        <StatCard title="Total de Productos" value={data.totalProductCount} subtext="En catálogo" />
        <StatCard 
          title="Tasa de Cambio (BCV)" 
          value={data.bcvRate ? `${data.bcvRate.toFixed(2)} Bs.` : 'No Disponible'}
          subtext="1 USD"
        />
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen de Pedidos de Hoy</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {allOrderStatuses.map(status => (
                <OrderStatusCard key={status} status={status} count={data.orderStatusSummary[status] || 0} />
            ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-start gap-4 mb-8">
          <Button asChild>
              <Link href="/admin/products">Gestionar Productos</Link>
          </Button>
          <Button variant="outline" asChild>
              <Link href="/admin/categories">Gestionar Categorías</Link>
          </Button>
          <Button variant="outline" asChild>
              <Link href="/admin/users">Gestionar Usuarios</Link>
          </Button>
          <Button variant="outline" asChild>
              <Link href="/admin/zones">Gestionar Zonas</Link>
          </Button>
          <Button variant="outline" asChild>
              <Link href="/admin/orders">Gestión de Pedidos</Link>
          </Button>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Últimos Pedidos Recibidos</h2>
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 uppercase font-semibold text-sm">ID Pedido</th>
                <th className="text-left py-3 px-6 uppercase font-semibold text-sm">Cliente</th>
                <th className="text-left py-3 px-6 uppercase font-semibold text-sm">Total</th>
                <th className="text-left py-3 px-6 uppercase font-semibold text-sm">Estado</th>
                <th className="text-left py-3 px-6 uppercase font-semibold text-sm">Fecha</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {data.recentOrders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="py-4 px-6">#{order.id}</td>
                  <td className="py-4 px-6">{order.customerName}</td>
                  <td className="py-4 px-6">${order.total.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    {/* CORRECCIÓN: Se reemplaza el guion bajo por un espacio */}
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
