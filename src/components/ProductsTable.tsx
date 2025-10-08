'use client'; 

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { logError } from '@/lib/logger';
import { showToast } from '@/components/ui/toast';

// 1. Actualizamos la interfaz para que acepte los nuevos datos de la oferta
interface Product {
  id: number;
  name: string;
  priceUSD: number;
  stock: number;
  sku: string | null;
  createdAt: Date;
  published: boolean;
  isOfferActive: boolean;
  offerEndsAt: Date | null;
}

// Componente para mostrar el estado de la oferta de forma visual
function OfferStatusBadge({ isActive, endDate }: { isActive: boolean, endDate: Date | null }) {
    const now = new Date();
    // Una oferta se considera activa si está marcada como tal Y la fecha de fin no ha pasado.
    const isCurrentlyActive = isActive && (!endDate || new Date(endDate) > now);

    if (isCurrentlyActive) {
        return (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                Activa
            </span>
        );
    }

    return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            Inactiva
        </span>
    );
}


export default function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter(); 

  const handleDelete = async (productId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar el producto');
      }
      
      router.refresh();
      showToast('Producto eliminado exitosamente', 'success');
    } catch (error) {
      logError('Error al eliminar producto', error);
      showToast('Error al eliminar el producto', 'error');
    }
  };

  const handleTogglePublished = async (product: Product) => {
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !product.published }),
      });
      if (!response.ok) throw new Error('Error al actualizar el producto');
      router.refresh();
      showToast(`Producto ${!product.published ? 'mostrado' : 'ocultado'} exitosamente`, 'success');
    } catch (error) {
      logError('Error al actualizar estado del producto', error);
      showToast('Error al actualizar el producto', 'error');
    }
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left py-3 px-6 uppercase font-semibold text-sm">Nombre</th>
            <th className="text-left py-3 px-6 uppercase font-semibold text-sm">SKU</th>
            <th className="text-left py-3 px-6 uppercase font-semibold text-sm">Estado</th>
            {/* 2. Añadimos la nueva columna para la oferta */}
            <th className="text-left py-3 px-6 uppercase font-semibold text-sm">Oferta</th>
            <th className="text-left py-3 px-6 uppercase font-semibold text-sm">Stock</th>
            <th className="text-left py-3 px-6 uppercase font-semibold text-sm">Precio (USD)</th>
            <th className="text-left py-3 px-6 uppercase font-semibold text-sm">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {products.map((product) => (
            <tr key={product.id} className="border-b hover:bg-gray-50">
              <td className="py-4 px-6 font-medium">{product.name}</td>
              <td className="py-4 px-6">{product.sku || 'N/A'}</td>
              <td className="py-4 px-6">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.published ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.published ? 'Visible' : 'Oculto'}
                </span>
              </td>
              {/* 3. Mostramos el estado de la oferta para cada producto */}
              <td className="py-4 px-6">
                <OfferStatusBadge isActive={product.isOfferActive} endDate={product.offerEndsAt} />
              </td>
              <td className="py-4 px-6">{product.stock}</td>
              <td className="py-4 px-6">${product.priceUSD.toFixed(2)}</td>
              <td className="py-4 px-6 flex items-center gap-2 flex-wrap">
                {/* 4. Añadimos el nuevo botón para gestionar la oferta */}
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/products/offer/${product.id}`}>Oferta</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleTogglePublished(product)}>
                  {product.published ? 'Ocultar' : 'Mostrar'}
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/products/edit/${product.id}`}>Editar</Link>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}