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

function StatCard({ title, value, subtext }: { title: string; value: string | number; subtext?: string }) {
  return (
    <div className="glass p-6 rounded-2xl shadow-xl">
      <h3 className="text-sm font-medium text-gray-600 truncate">{title}</h3>
      <p className="mt-2 text-3xl font-bold gradient-text">{value}</p>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
  );
}

// Componente para las tarjetas de estado de pedidos
function OrderStatusCard({ status, count }: { status: string; count: number }) {
    return (
        <div className={`p-4 rounded-xl shadow-lg border ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
            <p className="text-sm font-semibold">{status.replace(/_/g, ' ')}</p>
            <p className="text-2xl font-bold">{count}</p>
        </div>
    )
}


export default async function AdminDashboardPage() {
  const data = await getDashboardData();
  const allOrderStatuses = Object.keys(statusColors);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-end mb-6">
            <Button variant="outline" asChild>
              <Link href="/perfil">
                🏠 Perfil
              </Link>
            </Button>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-4">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona tu tienda desde aquí</p>
        </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
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
        <h2 className="text-2xl font-bold gradient-text mb-6">Resumen de Pedidos de Hoy</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {allOrderStatuses.map(status => (
                <OrderStatusCard key={status} status={status} count={data.orderStatusSummary[status] || 0} />
            ))}
        </div>
      </div>

      <div className="glass p-8 rounded-2xl shadow-xl mb-12">
        <h2 className="text-2xl font-bold gradient-text mb-6">Gestión Rápida</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          <Button variant="gradient" asChild className="h-12">
              <Link href="/admin/products">Productos</Link>
          </Button>
          <Button variant="modern" asChild className="h-12">
              <Link href="/admin/categories">Categorías</Link>
          </Button>
          <Button variant="modern" asChild className="h-12">
              <Link href="/admin/users">Usuarios</Link>
          </Button>
          <Button variant="modern" asChild className="h-12">
              <Link href="/admin/zones">Zonas</Link>
          </Button>
          <Button variant="modern" asChild className="h-12">
              <Link href="/admin/orders">Pedidos</Link>
          </Button>
          <Button variant="outline-modern" asChild className="h-12">
              <Link href="/admin/banner">Banner</Link>
          </Button>
          <Button variant="outline-modern" asChild className="h-12">
              <Link href="/admin/instagram">Instagram</Link>
          </Button>
        </div>
      </div>

      <div className="glass rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold gradient-text">Últimos Pedidos Recibidos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-pink-500/10 to-orange-500/10">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-800">ID Pedido</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-800">Cliente</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-800">Total</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-800">Estado</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-800">Fecha y Hora</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-white/10 hover:bg-white/20 transition-colors">
                  <td className="py-4 px-6 font-bold text-gray-800">#{order.id}</td>
                  <td className="py-4 px-6 text-gray-700">{order.customerName}</td>
                  <td className="py-4 px-6 font-semibold text-gray-800">${order.total.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-700">
                    <div className="text-sm">
                      <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                      <div className="text-gray-500 text-xs">{new Date(order.createdAt).toLocaleTimeString()}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
}
