'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Product {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  category: {
    name: string;
  };
}

interface MarketingProductsTableProps {
  products: Product[];
}

export function MarketingProductsTable({ products }: MarketingProductsTableProps) {
  return (
    <>
      <div className="p-6 border-b border-white/20">
        <h2 className="text-2xl font-bold gradient-text">Productos</h2>
        <p className="text-gray-600 mt-2">Solo puedes editar imágenes y descripciones</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-pink-500/10 to-orange-500/10">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-800">Imagen</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-800">Producto</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-800">Categoría</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-800">Descripción</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-800">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-white/10 hover:bg-white/20 transition-colors">
                <td className="py-4 px-6">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="9" cy="9" r="2"/>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                      </svg>
                    </div>
                  )}
                </td>
                <td className="py-4 px-6">
                  <p className="font-semibold text-gray-800">{product.name}</p>
                </td>
                <td className="py-4 px-6">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {product.category.name}
                  </span>
                </td>
                <td className="py-4 px-6 max-w-xs">
                  <p className="text-gray-700 truncate">
                    {product.description || 'Sin descripción'}
                  </p>
                </td>
                <td className="py-4 px-6">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/marketing/products/edit/${product.id}`}>
                      Editar
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay productos disponibles</p>
          </div>
        )}
      </div>
    </>
  );
}