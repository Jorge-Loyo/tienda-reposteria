import { getSessionData } from '@/lib/session';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProfileLayout from '@/components/ProfileLayout';

const prisma = new PrismaClient();

// Mapa de colores para los estados de los pedidos
const statusColors: Record<string, string> = {
    PENDIENTE_DE_PAGO: "bg-yellow-100 text-yellow-800",
    PAGADO: "bg-blue-100 text-blue-800",
    ARMADO: "bg-indigo-100 text-indigo-800",
    ENVIADO: "bg-green-100 text-green-800",
};

// Función para obtener los pedidos de un usuario específico con paginación
async function getUserOrders(userEmail: string, page: number = 1) {
    if (!userEmail) return { orders: [], totalCount: 0 };
    try {
        const pageSize = 7;
        const skip = (page - 1) * pageSize;
        
        const [orders, totalCount] = await Promise.all([
            prisma.order.findMany({
                where: { customerEmail: userEmail },
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize,
            }),
            prisma.order.count({
                where: { customerEmail: userEmail },
            })
        ]);
        
        return { orders, totalCount };
    } catch (error) {
        console.error("Error al obtener los pedidos del usuario:", error);
        return { orders: [], totalCount: 0 };
    }
}

export default async function MyOrdersPage({ searchParams }: { searchParams: { page?: string } }) {
  const session = await getSessionData();
  // Si no hay sesión, redirigimos al login
  if (!session?.email) {
    redirect('/login');
  }

  const currentPage = parseInt(searchParams.page || '1');
  const { orders, totalCount } = await getUserOrders(session.email, currentPage);
  const totalPages = Math.ceil(totalCount / 7);

  return (
    <ProfileLayout currentPage="pedidos">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Mis Pedidos</h1>
          <p className="text-gray-600">Revisa el estado de tus compras</p>
        </div>
      </div>

        {totalCount > 0 ? (
          <>
            <div className="glass rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-pink-500/10 to-orange-500/10">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-800">ID Pedido</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-800">Fecha</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-800">Total</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-800">Estado</th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-800">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-white/20 hover:bg-white/30 transition-colors">
                        <td className="py-6 px-6 font-bold text-gray-800">#{order.id}</td>
                        <td className="py-6 px-6 text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="py-6 px-6 font-semibold text-gray-800">${order.total.toFixed(2)}</td>
                        <td className="py-6 px-6">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-6 px-6 text-center">
                          <Button variant="outline-modern" size="sm" asChild>
                            <Link href={`/order/${order.id}/pago`}>Ver Detalle</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-gray-600">
                  Mostrando {((currentPage - 1) * 7) + 1} - {Math.min(currentPage * 7, totalCount)} de {totalCount} pedidos
                </p>
                <div className="flex gap-2">
                  {currentPage > 1 && (
                    <Button variant="outline" asChild>
                      <Link href={`/pedidos?page=${currentPage - 1}`}>Anterior</Link>
                    </Button>
                  )}
                  
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        asChild
                      >
                        <Link href={`/pedidos?page=${page}`}>{page}</Link>
                      </Button>
                    ))}
                  </div>
                  
                  {currentPage < totalPages && (
                    <Button variant="outline" asChild>
                      <Link href={`/pedidos?page=${currentPage + 1}`}>Siguiente</Link>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="glass p-12 rounded-3xl max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold gradient-text mb-3">No tienes pedidos todavía</h2>
              <p className="text-gray-600 mb-6">
                  ¡Explora nuestra tienda y encuentra los mejores insumos para tus creaciones!
              </p>
              <Button variant="gradient" asChild>
                  <Link href="/tienda">Ir a la Tienda</Link>
              </Button>
            </div>
          </div>
        )}
    </ProfileLayout>
  );
}