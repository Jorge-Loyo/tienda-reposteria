import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import ProductsTable from '@/components/ProductsTable';
import SearchInput from '@/components/SearchInput';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="sm:flex sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
          Gestión de Productos
        </h1>
        <Link 
          href="/admin/products/new" 
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Crear Nuevo Producto
        </Link>
      </div>
      <div className="mb-6">
        <SearchInput />
      </div>
      {/* Este componente ahora recibirá los datos de la oferta */}
      <ProductsTable products={products} />
    </div>
  );
}
