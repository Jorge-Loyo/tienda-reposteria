import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/PageHeader';
import { MarketingProductsTable } from '@/components/MarketingProductsTable';

const prisma = new PrismaClient();

async function getProducts(searchParams: { search?: string; category?: string; page?: string }) {
  const where: any = {};
  const page = parseInt(searchParams.page || '1');
  const pageSize = 10;
  const skip = (page - 1) * pageSize;
  
  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: 'insensitive' } },
      { sku: { contains: searchParams.search, mode: 'insensitive' } }
    ];
  }
  
  if (searchParams.category && searchParams.category !== 'all') {
    where.categoryId = parseInt(searchParams.category);
  }
  
  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true
      },
      orderBy: { name: 'asc' },
      skip,
      take: pageSize
    }),
    prisma.product.count({ where })
  ]);
  
  return {
    products,
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / pageSize)
  };
}

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });
}

export default async function MarketingProductsPage({
  searchParams
}: {
  searchParams: { search?: string; category?: string; page?: string }
}) {
  const [productsData, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories()
  ]);
  
  const { products, totalCount, currentPage, totalPages } = productsData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Button variant="outline" asChild>
            <Link href="/admin/marketing">
              ← Volver a Marketing
            </Link>
          </Button>
        </div>

        <PageHeader>
          Productos - Marketing
        </PageHeader>
        <p className="text-gray-600 text-center mb-8">Edita imágenes y descripciones de productos</p>

        <div className="glass p-6 rounded-2xl shadow-xl mb-8">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Mostrando {products.length} de {totalCount} productos
            </p>
          </div>
          <form method="GET" className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                name="search"
                placeholder="Buscar por nombre o SKU..."
                defaultValue={searchParams.search || ''}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
            </div>
            <div>
              <select
                name="category"
                defaultValue={searchParams.category || 'all'}
                className="rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                <option value="all">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-md hover:from-pink-600 hover:to-orange-600 transition-colors"
            >
              Buscar
            </button>
          </form>
        </div>

        <div className="glass rounded-2xl shadow-xl overflow-hidden">
          <MarketingProductsTable products={products} />
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {currentPage > 1 && (
              <a
                href={`?${new URLSearchParams({ ...searchParams, page: (currentPage - 1).toString() }).toString()}`}
                className="px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Anterior
              </a>
            )}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <a
                key={page}
                href={`?${new URLSearchParams({ ...searchParams, page: page.toString() }).toString()}`}
                className={`px-3 py-2 rounded-md transition-colors ${
                  page === currentPage
                    ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </a>
            ))}
            
            {currentPage < totalPages && (
              <a
                href={`?${new URLSearchParams({ ...searchParams, page: (currentPage + 1).toString() }).toString()}`}
                className="px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Siguiente
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}