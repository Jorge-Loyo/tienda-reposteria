// src/app/products/[id]/page.tsx
import { PrismaClient } from '@prisma/client';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ProductPurchaseControls from '@/components/ProductPurchaseControls';
import { getBcvRate, formatToVes } from '@/lib/currency';
import { formatCurrency } from '@/lib/formatters'; // Se asume que esta función ya existe en tu proyecto

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div className="relative aspect-square rounded-lg overflow-hidden">
          {/* Se añade el indicador de descuento si el producto está en oferta */}
          {onSale && discountPercent > 0 && (
            <div className="absolute top-4 right-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full z-10">
                -{discountPercent}%
            </div>
          )}
          <Image src={product.imageUrl || '/placeholder.png'} alt={product.name} fill style={{ objectFit: 'cover' }} priority />
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">{product.name}</h1>
          
          {/* --- Sección de Precios Actualizada --- */}
          <div className="mt-4">
            <div className="flex items-baseline gap-4">
                <p className="text-3xl text-red-600 font-bold">{formatCurrency(displayPrice ?? 0)} USD</p>
                {onSale && (
                    <p className="text-xl text-gray-400 line-through">
                        {formatCurrency(product.priceUSD)}
                    </p>
                )}
            </div>
            {priceVes ? (
              <p className="text-xl text-gray-600 mt-1">
                o {formatToVes(priceVes)}
              </p>
            ) : (
              <p className="text-sm text-amber-600 mt-1">Tasa Bs. no disponible</p>
            )}
          </div>

          <div className="mt-6"><h3 className="sr-only">Descripción</h3><p className="text-base text-gray-700 space-y-6">{product.description || 'No hay descripción disponible para este producto.'}</p></div>
          
          <div className="mt-6 text-sm text-gray-500">
            {product.stock > 0 ? (<p className="text-green-600 font-medium">En Stock: {product.stock} unidades</p>) : (<p className="text-red-600 font-medium">Agotado</p>)}
          </div>

          {/* Se pasa el objeto de producto completo, con datos de oferta, a los controles de compra */}
          <ProductPurchaseControls product={product} />

        </div>
      </div>
    </div>
  );
}