// src/app/products/[id]/page.tsx
import { PrismaClient } from '@prisma/client';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ProductPurchaseControls from '@/components/ProductPurchaseControls';
import { getBcvRate, formatToVes } from '@/lib/currency';
import { formatCurrency } from '@/lib/formatters'; // Se asume que esta función ya existe en tu proyecto
import { ToastContainer } from '@/components/ui/toast';
import './product-detail.css';

const prisma = new PrismaClient();

async function getProductDetails(id: number) {
  try {
    // La consulta ahora incluye explícitamente todos los campos del producto
    const product = await prisma.product.findUnique({ 
        where: { id, published: true } 
    });
    if (!product) { notFound(); }
    return product;
  } catch (error) {
    console.error("Error al obtener los detalles del producto:", error);
    notFound();
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = Number(params.id);
  if (isNaN(productId)) { notFound(); }
  
  const [product, bcvRate] = await Promise.all([
    getProductDetails(productId),
    getBcvRate()
  ]);

  // --- Lógica para determinar si el producto está en oferta ---
  const now = new Date();
  const onSale = 
    product.isOfferActive && 
    product.offerPriceUSD != null && 
    (!product.offerEndsAt || new Date(product.offerEndsAt) > now);

  const displayPrice = onSale ? product.offerPriceUSD : product.priceUSD;
  const priceVes = bcvRate ? (displayPrice ?? 0) * bcvRate : null;
  
  let discountPercent = 0;
  if (onSale && product.priceUSD > 0 && product.offerPriceUSD) {
    discountPercent = Math.round(((product.priceUSD - product.offerPriceUSD) / product.priceUSD) * 100);
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-content">
        <div className="product-detail-grid">
          {/* Imagen del producto */}
          <div className="product-detail-image-container">
            <div className="product-detail-image-wrapper glass">
              {onSale && discountPercent > 0 && (
                <div className="product-detail-discount-badge">
                  -{discountPercent}%
                </div>
              )}
              <Image 
                src={product.imageUrl || '/placeholder.png'} 
                alt={product.name} 
                fill 
                style={{ objectFit: 'cover' }} 
                priority 
                className="product-detail-image"
              />
            </div>
          </div>

          {/* Información del producto */}
          <div className="product-detail-info">
            <div className="product-detail-title-section">
              <h1 className="product-detail-title gradient-text">
                {product.name}
              </h1>
              
              {/* Precios */}
              <div className="product-detail-price-card glass">
                <div className="product-detail-price-container">
                  <p className="product-detail-price-main gradient-text">
                    {formatCurrency(displayPrice ?? 0)} USD
                  </p>
                  {onSale && (
                    <p className="product-detail-price-original">
                      {formatCurrency(product.priceUSD)}
                    </p>
                  )}
                </div>
                {priceVes ? (
                  <p className="product-detail-price-ves">
                    o {formatToVes(priceVes)}
                  </p>
                ) : (
                  <p className="product-detail-price-unavailable">Tasa Bs. no disponible</p>
                )}
              </div>
            </div>

            {/* Descripción */}
            <div className="product-detail-description-card glass">
              <h3 className="product-detail-description-title gradient-text">Descripción</h3>
              <p className="product-detail-description-text">
                {product.description || 'No hay descripción disponible para este producto.'}
              </p>
            </div>
            
            {/* Stock */}
            <div className="product-detail-stock-card glass">
              {product.stock > 0 ? (
                <div className="product-detail-stock-container">
                  <div className="product-detail-stock-indicator in-stock"></div>
                  <p className="product-detail-stock-text in-stock">
                    En Stock: {product.stock} unidades
                  </p>
                </div>
              ) : (
                <div className="product-detail-stock-container">
                  <div className="product-detail-stock-indicator out-of-stock"></div>
                  <p className="product-detail-stock-text out-of-stock">Agotado</p>
                </div>
              )}
            </div>

            {/* Controles de compra */}
            <div className="product-detail-purchase-section">
              <ProductPurchaseControls product={product} />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}