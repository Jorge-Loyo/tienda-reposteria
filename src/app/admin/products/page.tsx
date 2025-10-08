import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import ProductsTable from '@/components/ProductsTable';
import SearchInput from '@/components/SearchInput';
import { ToastContainer } from '@/components/ui/toast';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

interface PageProps {
  searchParams?: { search?: string; };
}

async function getProducts(searchQuery: string | undefined) {
  const whereClause = searchQuery ? { name: { contains: searchQuery } } : {};
  try {
    const products = await prisma.product.findMany({
      // Actualizamos la consulta para obtener los nuevos campos de la oferta
      select: { 
        id: true, 
        name: true, 
        priceUSD: true, 
        stock: true, 
        sku: true, 
        createdAt: true, 
        published: true,
        isOfferActive: true, // Campo para saber si la oferta está activa
        offerEndsAt: true,   // Campo para saber cuándo termina la oferta
      },
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
    return products;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    return [];
  }
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const products = await getProducts(searchParams?.search);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link 
            href="/perfil" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-700"
          >
            ← Volver
          </Link>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">Gestión de Productos</h1>
          <p className="text-gray-600">Administra el catálogo de productos de tu tienda</p>
        </div>
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1 max-w-md">
            <SearchInput />
          </div>
          <Link 
            href="/admin/products/new" 
            className="ml-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-orange-600 transition-all duration-200 shadow-lg"
          >
            + Crear Producto
          </Link>
        </div>
        <div className="glass rounded-2xl shadow-xl overflow-hidden">
          <ProductsTable products={products} />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
