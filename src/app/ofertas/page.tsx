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
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Ofertas Especiales</h1>
            <p className="text-lg text-gray-600">¡Aprovecha nuestros descuentos por tiempo limitado!</p>
        </div>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-12">
            {products.map((product) => (
              // Usamos el mismo ProductCard, que ahora sabrá cómo mostrar una oferta
              <ProductCard key={product.id} product={product} bcvRate={bcvRate} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 mt-12 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-700">No hay ofertas disponibles</h2>
            <p className="text-gray-500 mt-2">
              Vuelve a revisar más tarde, ¡pronto tendremos nuevos descuentos!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}