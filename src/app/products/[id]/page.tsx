// src/app/products/[id]/page.tsx
import { PrismaClient } from '@prisma/client';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ProductPurchaseControls from '@/components/ProductPurchaseControls';
import { getBcvRate, formatToVes } from '@/lib/currency';
import { formatCurrency } from '@/lib/formatters'; // Se asume que esta función ya existe en tu proyecto
import { ToastContainer } from '@/components/ui/toast';

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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Imagen del producto */}
          <div className="relative">
            <div className="relative aspect-square rounded-3xl overflow-hidden glass shadow-2xl">
              {onSale && discountPercent > 0 && (
                <div className="absolute top-6 right-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-4 py-2 rounded-full z-10 shadow-lg animate-pulse">
                  -{discountPercent}%
                </div>
              )}
              <Image 
                src={product.imageUrl || '/placeholder.png'} 
                alt={product.name} 
                fill 
                style={{ objectFit: 'cover' }} 
                priority 
                className="transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>

          {/* Información del producto */}
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold gradient-text leading-tight">
                {product.name}
              </h1>
              
              {/* Precios */}
              <div className="mt-6 p-6 glass rounded-2xl">
                <div className="flex items-baseline gap-4 mb-2">
                  <p className="text-4xl gradient-text font-bold">
                    {formatCurrency(displayPrice ?? 0)} USD
                  </p>
                  {onSale && (
                    <p className="text-2xl text-gray-400 line-through">
                      {formatCurrency(product.priceUSD)}
                    </p>
                  )}
                </div>
                {priceVes ? (
                  <p className="text-xl text-gray-600">
                    o {formatToVes(priceVes)}
                  </p>
                ) : (
                  <p className="text-sm text-amber-600">Tasa Bs. no disponible</p>
                )}
              </div>
            </div>

            {/* Descripción */}
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-semibold gradient-text mb-3">Descripción</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {product.description || 'No hay descripción disponible para este producto.'}
              </p>
            </div>
            
            {/* Stock */}
            <div className="glass p-4 rounded-2xl">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-green-600 font-semibold text-lg">
                    En Stock: {product.stock} unidades
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <p className="text-red-600 font-semibold text-lg">Agotado</p>
                </div>
              )}
            </div>

            {/* Controles de compra */}
            <div className="pt-4">
              <ProductPurchaseControls product={product} />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}