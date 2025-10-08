import { PrismaClient } from '@prisma/client';
import ProductCard from '@/components/ProductCard';
import { getBcvRate } from '@/lib/currency';
import CategoryFilter from '@/components/CategoryFilter';
import { ToastContainer } from '@/components/ui/toast';

const prisma = new PrismaClient();

async function getProducts(categoryName?: string) {
  try {
    const whereClause = categoryName
      ? { published: true, category: { name: categoryName } }
      : { published: true };

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      // Actualizamos la consulta para incluir ofertas
      select: { 
        id: true, 
        name: true, 
        priceUSD: true, 
        imageUrl: true, 
        stock: true,
        isOfferActive: true,
        offerPriceUSD: true,
        offerEndsAt: true
      },
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold gradient-text mb-4">Nuestra Tienda</h1>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Descubre los mejores insumos para tus creaciones de repostería
                </p>
            </div>
            
            <div className="mb-12">
                <CategoryFilter categories={categories} />
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} bcvRate={bcvRate} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="glass p-12 rounded-3xl max-w-md mx-auto">
                        <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold gradient-text mb-3">No se encontraron productos</h2>
                        <p className="text-gray-600">
                            Intenta con otra categoría o vuelve a revisar más tarde.
                        </p>
                    </div>
                </div>
            )}
        </div>
        <ToastContainer />
    </div>
  );
}