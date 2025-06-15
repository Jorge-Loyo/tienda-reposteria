// src/app/products/[id]/page.tsx
import { PrismaClient } from '@prisma/client';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';

const prisma = new PrismaClient();

async function getProductDetails(id: number) {
  try {
    const product = await prisma.product.findUnique({ where: { id, published: true } });
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
  
  const product = await getProductDetails(productId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image src={product.imageUrl || '/placeholder.png'} alt={product.name} fill style={{ objectFit: 'cover' }} priority />
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">{product.name}</h1>
          <div className="mt-4"><p className="text-3xl text-gray-900">${product.priceUSD.toFixed(2)} USD</p></div>
          <div className="mt-6"><h3 className="sr-only">Descripción</h3><p className="text-base text-gray-700 space-y-6">{product.description || 'No hay descripción disponible para este producto.'}</p></div>
          <div className="mt-6 text-sm text-gray-500">
            {product.sku && <p>SKU: {product.sku}</p>}
            {product.stock > 0 ? (<p className="text-green-600">En Stock: {product.stock} unidades</p>) : (<p className="text-red-600">Agotado</p>)}
          </div>
          <div className="mt-10"><AddToCartButton product={product} /></div>
        </div>
      </div>
    </div>
  );
}