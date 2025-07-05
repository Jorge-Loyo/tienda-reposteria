import { PrismaClient } from '@prisma/client';
import ProductCard from '@/components/ProductCard';
import { getBcvRate } from '@/lib/currency';
import CategoryFilter from '@/components/CategoryFilter';

const prisma = new PrismaClient();

async function getProducts(categoryName?: string) {
  try {
    const whereClause = categoryName
      ? { published: true, category: { name: categoryName } }
      : { published: true };

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      // Actualizamos la consulta para incluir el stock
      select: { id: true, name: true, priceUSD: true, imageUrl: true, stock: true },
    });
    return products;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({ orderBy: { name: 'asc' } });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return [];
  }
}

export default async function TiendaPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const category = typeof searchParams?.category === 'string' ? searchParams.category : undefined;
  
  const [products, categories, bcvRate] = await Promise.all([
    getProducts(category),
    getCategories(),
    getBcvRate(),
  ]);

  return (
    <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Nuestra Tienda</h1>
            
            <CategoryFilter categories={categories} />

            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} bcvRate={bcvRate} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <h2 className="text-2xl font-semibold text-gray-700">No se encontraron productos</h2>
                    <p className="text-gray-500 mt-2">
                        Intenta con otra categoría o vuelve a revisar más tarde.
                    </p>
                </div>
            )}
        </div>
    </div>
  );
}