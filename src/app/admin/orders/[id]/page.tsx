// src/app/admin/orders/[id]/page.tsx

import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
// 1. Nos aseguramos de importar el componente para actualizar el estado
import UpdateOrderStatus from '@/components/UpdateOrderStatus'; 

const prisma = new PrismaClient();

async function getOrderDetails(orderId: number) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      notFound();
    }
    return order;
  } catch (error) {
    console.error("Error al obtener el detalle del pedido:", error);
    notFound();
  }
}

function InfoBlock({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  );
}

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const orderId = Number(params.id);
  if (isNaN(orderId)) {
    notFound();
  }

  const order = await getOrderDetails(orderId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/orders">‹ Volver a todos los pedidos</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Pedido #{order.id}</h2>
            <div className="space-y-3">
              <InfoBlock label="Fecha" value={new Date(order.createdAt).toLocaleString('es-VE')} />
              <InfoBlock label="Total del Pedido" value={`$${order.total.toFixed(2)}`} />
              
              {/* --- INICIO DE LA CORRECCIÓN --- */}
              {/* Esta sección renderiza el componente para cambiar el estado */}
              <div>
                <p className="text-sm text-gray-500">Actualizar Estado</p>
                <UpdateOrderStatus 
                  orderId={order.id} 
                  currentStatus={order.status}
                  customerName={order.customerName}
                  customerPhone={order.phone || undefined}
                  orderTotal={order.total}
                />
              </div>
              {/* --- FIN DE LA CORRECCIÓN --- */}

            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Detalles del Cliente</h2>
            <div className="space-y-3">
              <InfoBlock label="Nombre" value={order.customerName} />
              <InfoBlock label="Correo Electrónico" value={order.customerEmail} />
              <InfoBlock label="Teléfono" value={order.phone} />
              <InfoBlock label="Cédula" value={order.identityCard} />
              <InfoBlock label="Instagram" value={order.instagram} />
              <InfoBlock label="Dirección de Envío" value={order.address} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Productos en este Pedido</h2>
          <ul role="list" className="divide-y divide-gray-200">
            {order.items.map((item) => (
              <li key={item.id} className="flex py-4">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                  <Image
                    src={item.product.imageUrl || '/placeholder.png'}
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4 flex flex-1 flex-col justify-center">
                    <div className="flex justify-between text-base font-medium">
                      <h3>{item.product.name}</h3>
                      <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.quantity} x ${item.price.toFixed(2)} c/u
                    </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}