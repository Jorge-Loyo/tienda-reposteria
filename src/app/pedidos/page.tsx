import { getSessionData } from '@/lib/session';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/PageHeader';

const prisma = new PrismaClient();

// Mapa de colores para los estados de los pedidos
const statusColors: Record<string, string> = {
    PENDIENTE_DE_PAGO: "bg-yellow-100 text-yellow-800",
    PAGADO: "bg-blue-100 text-blue-800",
    ARMADO: "bg-indigo-100 text-indigo-800",
    ENVIADO: "bg-green-100 text-green-800",
};

// Función para obtener los pedidos de un usuario específico
async function getUserOrders(userEmail: string) {
    if (!userEmail) return [];
    try {
        const orders = await prisma.order.findMany({
            where: { customerEmail: userEmail },
            orderBy: { createdAt: 'desc' },
        });
        return orders;
    } catch (error) {
        console.error("Error al obtener los pedidos del usuario:", error);
        return [];
    }
}

export default async function MyOrdersPage() {
  const session = await getSessionData();
  // Si no hay sesión, redirigimos al login
  if (!session?.email) {
    redirect('/login');
  }

  const orders = await getUserOrders(session.email);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <PageHeader>Mis Pedidos</PageHeader>
        <Button variant="outline" asChild>
            <Link href="/perfil">Volver a Mi Perfil</Link>
        </Button>
      </div>

      {orders.length > 0 ? (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 uppercase font-semibold text-sm">ID Pedido</th>
                <th className="text-left py-3 px-6 uppercase font-semibold text-sm">Fecha</th>
                <th className="text-left py-3 px-6 uppercase font-semibold text-sm">Total</th>
                <th className="text-left py-3 px-6 uppercase font-semibold text-sm">Estado</th>
                <th className="text-center py-3 px-6 uppercase font-semibold text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium">#{order.id}</td>
                  <td className="py-4 px-6">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-6">${order.total.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {/* Este botón podría llevar a una página con el detalle completo del pedido */}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/order/${order.id}/pago`}>Ver Detalle</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-700">No tienes pedidos todavía</h2>
            <p className="text-gray-500 mt-2">
                ¡Explora nuestra tienda y encuentra los mejores insumos para tus creaciones!
            </p>
            <Button asChild className="mt-6">
                <Link href="/tienda">Ir a la Tienda</Link>
            </Button>
        </div>
      )}
    </div>
  );
}