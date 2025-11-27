import { PrismaClient } from '@prisma/client';
import ProductCard from '@/components/ProductCard';
import { getBcvRate } from '@/lib/currency';
import './ofertas.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    <div className="ofertas-container">
      <div className="ofertas-content">
        <div className="ofertas-header">
            <h1 className="ofertas-title gradient-text">Ofertas Especiales</h1>
            <p className="ofertas-subtitle">¡Aprovecha nuestros descuentos por tiempo limitado!</p>
        </div>
        
        {products.length > 0 ? (
          <div className="ofertas-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} bcvRate={bcvRate} />
            ))}
          </div>
        ) : (
          <div className="ofertas-empty-state">
            <div className="ofertas-empty-card glass">
              <div className="ofertas-empty-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h2 className="ofertas-empty-title gradient-text">No hay ofertas disponibles</h2>
              <p className="ofertas-empty-text">
                Vuelve a revisar más tarde, ¡pronto tendremos nuevos descuentos!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}