import { PrismaClient } from '@prisma/client';
import ProductCard from '@/components/ProductCard';
import { getBcvRate } from '@/lib/currency';
import CategoryFilter from '@/components/CategoryFilter';
import { ToastContainer } from '@/components/ui/toast';
import './tienda.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    return await prisma.category.findMany({ 
      select: { id: true, name: true, icon: true },
      orderBy: { name: 'asc' } 
    });
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
    <div className="tienda-container">
        <div className="tienda-content">
            <div className="tienda-header">
                <h1 className="tienda-title gradient-text">Nuestra Tienda</h1>
                <p className="tienda-subtitle">
                    Descubre los mejores insumos para tus creaciones de repostería
                </p>
            </div>
            
            <div className="tienda-filters">
                <CategoryFilter categories={categories} />
            </div>

            {products.length > 0 ? (
                <div className="tienda-products-grid">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} bcvRate={bcvRate} />
                    ))}
                </div>
            ) : (
                <div className="tienda-empty-state">
                    <div className="tienda-empty-card glass">
                        <div className="tienda-empty-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h2 className="tienda-empty-title gradient-text">No se encontraron productos</h2>
                        <p className="tienda-empty-text">
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