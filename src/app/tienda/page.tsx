// src/app/tienda/page.tsx
import { PrismaClient } from '@prisma/client';
import ProductCard from '@/components/ProductCard';
import { getBcvRate } from '@/lib/currency'; // Importamos la utilidad de la tasa

const prisma = new PrismaClient();

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { published: true },
      select: { id: true, name: true, priceUSD: true, imageUrl: true, },
      orderBy: { createdAt: 'desc' },
    });
    return products;
  } catch (error) {
    console.error("Error al obtener los productos para la tienda:", error);
    return [];
  }
}

export default async function TiendaPage() {
  // Obtenemos los productos Y la tasa de cambio aquí, una sola vez.
  // Promise.all ejecuta ambas tareas en paralelo para mayor eficiencia.
  const [products, bcvRate] = await Promise.all([
    getProducts(),
    getBcvRate()
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="py-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Nuestro Catálogo</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          Descubre todos los insumos que tenemos para tus creaciones.
        </p>
      </header>
      
      {products.length === 0 ? (
        <p className="text-center text-gray-500 py-20">No hay productos disponibles en este momento.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 pb-20">
          {products.map((product) => (
            // Le pasamos la tasa obtenida a cada tarjeta de producto
            <ProductCard key={product.id} product={product} bcvRate={bcvRate} />
          ))}
        </div>
      )}
    </div>
  );
}