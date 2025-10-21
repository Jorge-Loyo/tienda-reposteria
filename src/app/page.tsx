import { PrismaClient } from '@prisma/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getBcvRate } from '@/lib/currency';
import { Truck, Clock, ShieldCheck, Target, Eye, Gem, Star } from 'lucide-react';
import Image from 'next/image';
import HomeBanner from '@/components/HomeBanner';
import InstagramSection from '@/components/InstagramSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { InspirationGallery } from '@/components/InspirationGallery';
import { FloatingActions } from '@/components/FloatingActions';
import { TrendingSection } from '@/components/TrendingSection';

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

async function getTrendingProducts() {
  try {
    const orderItemsHistory = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      _count: { productId: true },
      orderBy: { _sum: { quantity: 'desc' } }
    });

    if (orderItemsHistory.length === 0) {
      return [];
    }

    const productIds = orderItemsHistory.slice(0, 10).map(item => item.productId);
    const trendingProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        published: true,
        stock: { gt: 0 }
      },
      select: {
        id: true, name: true, priceUSD: true, imageUrl: true, stock: true,
        salesCount: true, isOfferActive: true, offerPriceUSD: true, offerEndsAt: true
      }
    });

    const sortedProducts = trendingProducts.sort((a, b) => {
      const aHistory = orderItemsHistory.find(item => item.productId === a.id);
      const bHistory = orderItemsHistory.find(item => item.productId === b.id);
      const aQuantity = aHistory?._sum.quantity || 0;
      const bQuantity = bHistory?._sum.quantity || 0;
      return bQuantity - aQuantity;
    });

    return sortedProducts.slice(0, 6);
  } catch (error) {
    console.error("Error al obtener productos trending:", error);
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
      title: banner.title || undefined,
    }));
  } catch (error) {
    console.error("Error al obtener banners:", error);
    return [];
  }
}

async function getStats() {
  try {
    const [productsCount, customersCount, avgRating] = await Promise.all([
      prisma.product.count({ where: { published: true } }),
      prisma.order.groupBy({ by: ['customerEmail'], _count: { customerEmail: true } }),
      prisma.testimonial.aggregate({ where: { approved: true }, _avg: { rating: true } })
    ]);
    
    return {
      products: productsCount,
      customers: customersCount.length,
      rating: avgRating._avg.rating ? Math.round(avgRating._avg.rating * 10) / 10 : 5
    };
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return { products: 0, customers: 0, rating: 5 };
  }
}

async function getGalleryImages() {
  try {
    return await prisma.galleryImage.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        alt: true
      }
    });
  } catch (error) {
    console.error("Error al obtener imágenes de galería:", error);
    return [];
  }
}

async function getSiteConfig() {
  try {
    const aboutImage = await prisma.siteConfig.findUnique({
      where: { key: 'about_section_image' }
    });
    
    return {
      aboutSectionImage: aboutImage?.value || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1987&auto=format&fit=crop'
    };
  } catch (error) {
    console.error("Error al obtener configuración del sitio:", error);
    return {
      aboutSectionImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1987&auto=format&fit=crop'
    };
  }
}

function FeatureCard({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
  return (
    <div className="group relative overflow-hidden bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-pink-200">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="flex justify-center items-center mb-6 text-pink-500 group-hover:text-pink-600 transition-colors duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-pink-600 transition-colors duration-300">{title}</h3>
        <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{children}</p>
      </div>
    </div>
  );
}

function StatCard({ number, label }: { number: string, label: string }) {
  return (
    <div className="text-center p-6 bg-gradient-to-br from-pink-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl border border-pink-200/50 hover:from-pink-500/30 hover:to-orange-500/30 transition-all duration-300">
      <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">{number}</div>
      <div className="text-gray-700 text-sm uppercase tracking-wide font-medium">{label}</div>
    </div>
  );
}

export default async function HomePage() {
  const [featuredProducts, trendingProducts, bcvRate, bannerImages, stats, galleryImages, siteConfig] = await Promise.all([
    getFeaturedProducts(),
    getTrendingProducts(),
    getBcvRate(),
    getActiveBanners(),
    getStats(),
    getGalleryImages(),
    getSiteConfig()
  ]);

  // Fallback banner si no hay banners en la base de datos
  const finalBannerImages = bannerImages.length > 0 ? bannerImages : [
    {
      src: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?q=80&w=2070&auto=format&fit=crop',
      alt: 'Casa Dulce Oriente - Repostería Premium',
      title: 'Casa Dulce Oriente'
    }
  ];

  return (
    <div>
      <HomeBanner images={finalBannerImages} />
      
      <TrendingSection products={trendingProducts} bcvRate={bcvRate} />
      
      <section className="py-20 bg-gradient-to-br from-pink-50 via-white to-orange-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-orange-500 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-white rounded-3xl p-2 shadow-2xl">
                <div className="relative w-full h-96 rounded-2xl overflow-hidden">
                  <Image 
                    src={siteConfig.aboutSectionImage}
                    alt="Interior de la pastelería Casa Dulce"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <h2 className="text-5xl font-bold gradient-text mb-6 leading-tight">
                  CASA DULCE ORIENTE
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mb-8"></div>
              </div>
              
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Nacimos de la <span className="font-semibold text-pink-600">pasión por la repostería</span> y el deseo de facilitar a todos, desde aficionados hasta profesionales, el acceso a insumos de la más alta calidad.
                </p>
                <p>
                  En Casa Dulce Oriente, creemos que cada postre es una <span className="font-semibold text-orange-600">obra de arte</span> y que los ingredientes correctos son el pincel del artista.
                </p>
                <p>
                  Nuestro compromiso es ofrecer una selección curada de productos, un servicio al cliente excepcional y la inspiración que necesitas para llevar tus creaciones al siguiente nivel.
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-8">
                <StatCard number={`${stats.products}+`} label="Productos" />
                <StatCard number={`${stats.customers}+`} label="Clientes" />
                <StatCard number={`${stats.rating}★`} label="Calificación" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold gradient-text mb-6">
              Nuestros Productos Destacados
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre nuestra selección especial de productos premium para tus creaciones más exquisitas
            </p>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} bcvRate={bcvRate} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-12 h-12 text-pink-500" />
              </div>
              <p className="text-xl text-gray-500">Próximamente productos destacados</p>
            </div>
          )}
          
          <div className="text-center mt-16">
            <Button asChild size="lg" className="px-12 py-4 text-lg bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white border-none shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <Link href="/tienda">Ver todos los productos</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold gradient-text mb-6">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Más que una tienda, somos tu aliado en cada creación dulce
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard icon={<Truck size={56} />} title="Delivery Rápido">
              Recibe tus insumos directamente en tu puerta. Olvídate de las largas esperas y concéntrate en crear obras maestras.
            </FeatureCard>
            <FeatureCard icon={<Clock size={56} />} title="Atención 24 Horas">
              Nuestra tienda online nunca cierra. Haz tu pedido en cualquier momento del día, cuando la inspiración te llegue.
            </FeatureCard>
            <FeatureCard icon={<ShieldCheck size={56} />} title="Calidad Garantizada">
              Seleccionamos solo los mejores productos del mercado para asegurar que tus postres sean siempre un éxito rotundo.
            </FeatureCard>
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <InspirationGallery inspirationImages={galleryImages} />
      <InstagramSection />

      <section className="py-20 bg-gradient-to-br from-pink-900 via-purple-900 to-orange-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-white">
              Nuestros Pilares
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Los valores que nos guían en cada paso de nuestro camino
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-500">
              <div className="flex justify-center items-center mb-6 text-pink-300 group-hover:text-pink-200 transition-colors duration-300">
                <Target size={56} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Nuestra Misión</h3>
              <p className="text-white/80 leading-relaxed">
                Proveer a la comunidad de reposteros con insumos de calidad superior y un servicio confiable, fomentando la creatividad y el dulce éxito en cada cocina.
              </p>
            </div>
            
            <div className="group text-center p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-500">
              <div className="flex justify-center items-center mb-6 text-orange-300 group-hover:text-orange-200 transition-colors duration-300">
                <Eye size={56} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Nuestra Visión</h3>
              <p className="text-white/80 leading-relaxed">
                Ser el referente y aliado principal para todos los amantes de la repostería en el oriente del país, reconocidos por nuestra calidad, innovación y compromiso.
              </p>
            </div>
            
            <div className="group text-center p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-500">
              <div className="flex justify-center items-center mb-6 text-purple-300 group-hover:text-purple-200 transition-colors duration-300">
                <Gem size={56} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Nuestros Valores</h3>
              <p className="text-white/80 leading-relaxed">
                Calidad, Pasión, Confianza, Innovación y un profundo respeto por el arte de la repostería y nuestros clientes.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <FloatingActions />
    </div>
  );
}