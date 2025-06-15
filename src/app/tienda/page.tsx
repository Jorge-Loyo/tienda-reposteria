// src/app/tienda/page.tsx
import { PrismaClient } from '@prisma/client';
import ProductCard from '@/components/ProductCard';

const prisma = new PrismaClient();

// Esta función obtiene los productos que se mostrarán en la tienda
async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      // Muy importante: solo mostramos los productos marcados como "publicados"
      where: { published: true },
      // Seleccionamos solo los campos necesarios para la tarjeta de producto
      select: { 
        id: true, 
        name: true, 
        priceUSD: true, 
        imageUrl: true, 
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return products;
  } catch (error) {
    console.error("Error al obtener los productos para la tienda:", error);
    return [];
  }
}

export default async function TiendaPage() {
  const products = await getProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="py-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Nuestro Catálogo</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          Descubre todos los insumos que tenemos para tus creaciones.
        </p>
      </header>
      
      {/* Se muestra un mensaje si no hay productos disponibles */}
      {products.length === 0 ? (
        <p className="text-center text-gray-500 py-20">No hay productos disponibles en este momento.</p>
      ) : (
        // Se utiliza una cuadrícula (grid) responsive para mostrar los productos
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 pb-20">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}