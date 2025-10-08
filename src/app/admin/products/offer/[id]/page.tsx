import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { OfferForm } from '@/components/OfferForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const prisma = new PrismaClient();

export default async function ManageOfferPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true
    }
  });

  if (!product) return notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Gestionar Oferta</h1>
            <p className="text-gray-600">Configura la oferta especial para este producto</p>
          </div>
          <Button variant="modern" asChild>
            <Link href="/admin/products">← Volver</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detalles del Producto */}
          <div className="lg:col-span-1">
            <div className="glass p-6 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold gradient-text mb-4">Detalles del Producto</h3>
              
              {product.imageUrl && (
                <div className="aspect-square relative mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-800">{product.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Categoría:</span>
                  <Badge variant="secondary">{product.category.name}</Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">SKU:</span>
                  <span className="text-sm font-mono">{product.sku || 'N/A'}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Stock:</span>
                  <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                    {product.stock} unidades
                  </Badge>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Precio Regular:</span>
                    <span className="text-lg font-bold text-gray-800">${product.priceUSD}</span>
                  </div>
                  
                  {product.isOfferActive && product.offerPriceUSD && (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-gray-500">Precio Oferta:</span>
                      <span className="text-lg font-bold text-green-600">${product.offerPriceUSD}</span>
                    </div>
                  )}
                </div>
                
                {product.isOfferActive && (
                  <div className="pt-2">
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Oferta Activa
                    </Badge>
                    {product.offerEndsAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        Termina: {new Date(product.offerEndsAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Formulario de Oferta */}
          <div className="lg:col-span-2">
            <div className="glass p-8 rounded-2xl shadow-xl">
              <OfferForm product={product} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}