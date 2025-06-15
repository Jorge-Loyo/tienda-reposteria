// VERSIÓN COMPLETA Y FUNCIONAL de: src/components/ProductsTable.tsx
'use client'; 

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Product {
  id: number;
  name: string;
  priceUSD: number;
  stock: number;
  sku: string | null;
  createdAt: Date;
  published: boolean;
}

export default function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter(); 

  // Función de borrado completa
  const handleDelete = async (productId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Error al eliminar el producto');
        }
        router.refresh();
      } catch (error) {
        console.error(error);
        alert('Hubo un problema al eliminar el producto.');
      }
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
    } catch (error) {
      console.error(error);
      alert('No se pudo cambiar el estado del producto.');
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
              <td className="py-4 px-6">{product.stock}</td>
              <td className="py-4 px-6">${product.priceUSD.toFixed(2)}</td>
              <td className="py-4 px-6 flex items-center gap-2">
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