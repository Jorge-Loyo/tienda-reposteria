import { PrismaClient } from '@prisma/client';
import ProductCard from '@/components/ProductCard';
import { getBcvRate } from '@/lib/currency';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// Esta función obtiene solo los productos que están en oferta
async function getOfferProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        published: true,
        isOfferActive: true, // La oferta debe estar marcada como activa
        offerPriceUSD: { not: null }, // Debe tener un precio de oferta
        offerEndsAt: { gte: new Date() }, // La fecha de fin de la oferta no debe haber pasado
      },
      orderBy: { createdAt: 'desc' },
    });
    return products;
  } catch (error) {
    console.error("Error al obtener productos en oferta:", error);
    return [];
  }
}

export default async function OfertasPage() {
  // Obtenemos tanto los productos en oferta como la tasa de cambio
  const [products, bcvRate] = await Promise.all([
    getOfferProducts(),
    getBcvRate(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
            <h1 className="text-5xl font-bold gradient-text mb-4">Ofertas Especiales</h1>
            <p className="text-xl text-gray-600">¡Aprovecha nuestros descuentos por tiempo limitado!</p>
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
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold gradient-text mb-3">No hay ofertas disponibles</h2>
              <p className="text-gray-600">
                Vuelve a revisar más tarde, ¡pronto tendremos nuevos descuentos!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}