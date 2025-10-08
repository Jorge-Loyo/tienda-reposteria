import { PrismaClient } from '@prisma/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getBcvRate } from '@/lib/currency';
import { Truck, Clock, ShieldCheck, Target, Eye, Gem } from 'lucide-react';
import Image from 'next/image';
import HomeBanner from '@/components/HomeBanner';
import InstagramSection from '@/components/InstagramSection';

const prisma = new PrismaClient();

async function getFeaturedProducts() {
  try {
    const now = new Date();

    const offerProducts = await prisma.product.findMany({
      where: {
        published: true,
        isOfferActive: true,
        offerPriceUSD: { not: null },
        offerEndsAt: { gte: now },
      },
      orderBy: { createdAt: 'desc' },
      select: { 
        id: true, name: true, priceUSD: true, imageUrl: true, stock: true,
        isOfferActive: true, offerPriceUSD: true, offerEndsAt: true 
      },
    });

    const latestProducts = await prisma.product.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: { 
        id: true, name: true, priceUSD: true, imageUrl: true, stock: true,
        isOfferActive: true, offerPriceUSD: true, offerEndsAt: true 
      },
    });

    const combinedMap = new Map();
    offerProducts.forEach(p => combinedMap.set(p.id, p));
    latestProducts.forEach(p => {
      if (!combinedMap.has(p.id)) {
        combinedMap.set(p.id, p);
      }
    });

    return Array.from(combinedMap.values()).slice(0, 4);

  } catch (error) {
    console.error("Error al obtener productos destacados:", error);
    return [];
  }
}

async function getActiveBanners() {
  try {
    const banners = await prisma.banner.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
    
    return banners.map(banner => ({
      src: banner.src,
      alt: banner.alt,
      title: banner.title,
    }));
  } catch (error) {
    console.error("Error al obtener banners:", error);
    return [];
  }
}

function FeatureCard({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
  return (
    <div className="text-center p-8 glass rounded-2xl card-hover">
      <div className="flex justify-center items-center mb-6 text-pink-500">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-4 gradient-text">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{children}</p>
    </div>
  );
}

export default async function HomePage() {
  const [featuredProducts, bcvRate, bannerImages] = await Promise.all([
    getFeaturedProducts(),
    getBcvRate(),
    getActiveBanners()
  ]);

  return (
    <div>
      <HomeBanner images={bannerImages} />

      {/* --- El resto de tu página de inicio --- */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center gradient-text mb-16">
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
            <Button asChild variant="gradient" size="lg" className="px-8 py-4 text-lg">
              <Link href="/tienda">Ver todos los productos</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center gradient-text mb-16">
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

      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg">
                    <Image 
                        src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1987&auto=format&fit=crop"
                        alt="Interior de la pastelería Casa Dulce"
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                </div>
                <div>
                    <h2 className="text-4xl font-bold gradient-text mb-6">Sobre CASA DULCE ORIENTE</h2>
                    <p className="text-gray-600 mb-4">
                        Nacimos de la pasión por la repostería y el deseo de facilitar a todos, desde aficionados hasta profesionales, el acceso a insumos de la más alta calidad. En Casa Dulce Oriente, creemos que cada postre es una obra de arte y que los ingredientes correctos son el pincel del artista.
                    </p>
                    <p className="text-gray-600">
                        Nuestro compromiso es ofrecer una selección curada de productos, un servicio al cliente excepcional y la inspiración que necesitas para llevar tus creaciones al siguiente nivel.
                    </p>
                </div>
            </div>
        </div>
      </section>

      <InstagramSection />

      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard icon={<Target size={48} />} title="Nuestra Misión">
              Proveer a la comunidad de reposteros con insumos de calidad superior y un servicio confiable, fomentando la creatividad y el dulce éxito en cada cocina.
            </FeatureCard>
            <FeatureCard icon={<Eye size={48} />} title="Nuestra Visión">
              Ser el referente y aliado principal para todos los amantes de la repostería en el oriente del país, reconocidos por nuestra calidad, innovación y compromiso.
            </FeatureCard>
            <FeatureCard icon={<Gem size={48} />} title="Nuestros Valores">
              Calidad, Pasión, Confianza, Innovación y un profundo respeto por el arte de la repostería y nuestros clientes.
            </FeatureCard>
          </div>
        </div>
      </section>
    </div>
  );
}