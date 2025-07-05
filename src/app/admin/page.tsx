import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getBcvRate } from '@/lib/currency';

const prisma = new PrismaClient();

async function getDashboardData() {
  const [productCount, orderCount, totalRevenue, bcvRate] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    getBcvRate(),
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  return {
    productCount,
    orderCount,
    totalRevenue: totalRevenue._sum.total || 0,
    recentOrders,
    bcvRate,
  };
}

function StatCard({ title, value, subtext }: { title: string; value: string | number; subtext?: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
      <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
}


export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        <StatCard title="Ingresos Totales" value={`$${data.totalRevenue.toFixed(2)}`} />
        <StatCard title="Total de Pedidos" value={data.orderCount} />
        <StatCard title="Total de Productos" value={data.productCount} />
        <StatCard 
          title="Tasa de Cambio (BCV)" 
          value={data.bcvRate ? `${data.bcvRate.toFixed(4)} Bs.` : 'No Disponible'}
          subtext="1 USD"
        />
      </div>

      {/* --- SECCIÓN DE BOTONES DE GESTIÓN --- */}
      <div className="flex justify-start gap-4 mb-8">
          <Button asChild>
              <Link href="/admin/products">Gestionar Productos</Link>
          </Button>
          <Button variant="outline" asChild>
              <Link href="/admin/categories">Gestionar Categorías</Link>
          </Button>
          {/* --- NUEVO BOTÓN PARA USUARIOS --- */}
          <Button variant="outline" asChild>
              <Link href="/admin/users">Gestionar Usuarios</Link>
          </Button>
      </div>


      <div className="mt-12">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Últimos Pedidos</h2>
        </div>
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
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800`}>
                      {order.status.replace('_', ' ')}
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
