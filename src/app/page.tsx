// src/app/page.tsx
import { PrismaClient } from '@prisma/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getBcvRate } from '@/lib/currency';
import { Truck, Clock, ShieldCheck } from 'lucide-react';

const prisma = new PrismaClient();

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { published: true }, take: 4, orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, priceUSD: true, imageUrl: true },
    });
    return products;
  } catch (error) {
    console.error("Error al obtener productos destacados:", error);
    return [];
  }
}

function FeatureCard({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
  return (
    <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      {/* Usando el color de acento del tema */}
      <div className="flex justify-center items-center mb-4 text-accent">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600">{children}</p>
    </div>
  );
}

export default async function HomePage() {
  const [featuredProducts, bcvRate] = await Promise.all([
    getFeaturedProducts(),
    getBcvRate()
  ]);

  return (
    <div>
      {/* --- Sección de Héroe (Banner) --- */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center text-white bg-gray-800">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558326567-98ae2405596b?q=80&w=2070&auto=format&fit=crop')" }}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 drop-shadow-lg">
            El Arte de la Repostería Comienza Aquí
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-200 mb-8 drop-shadow-md">
            Encuentra todos los insumos de la más alta calidad para que tus creaciones sean inolvidables.
          </p>
          {/* El botón ahora usa el estilo primario por defecto */}
          <Button asChild size="lg">
            <Link href="/tienda">Explorar Catálogo</Link>
          </Button>
        </div>
      </section>

      {/* --- Sección de Productos Destacados --- */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Nuestros Productos Destacados
          </h2>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} bcvRate={bcvRate} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Próximamente productos destacados.</p>
          )}
          <div className="text-center mt-12">
            {/* Este botón ahora usa la variante "outline" que también hereda el color primario */}
            <Button asChild variant="outline">
              <Link href="/tienda">Ver todos los productos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* --- Sección: Nuestras Ventajas --- */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard icon={<Truck size={48} />} title="Delivery Rápido">
              Recibe tus insumos directamente en tu puerta. Olvídate de las largas esperas y concéntrate en crear.
            </FeatureCard>
            <FeatureCard icon={<Clock size={48} />} title="Atención 24 Horas">
              Nuestra tienda online nunca cierra. Haz tu pedido en cualquier momento del día, cuando la inspiración te llegue.
            </FeatureCard>
            <FeatureCard icon={<ShieldCheck size={48} />} title="Calidad Garantizada">
              Seleccionamos solo los mejores productos del mercado para asegurar que tus postres sean siempre un éxito.
            </FeatureCard>
          </div>
        </div>
      </section>
    </div>
  );
}