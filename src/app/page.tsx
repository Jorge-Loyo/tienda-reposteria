import { PrismaClient } from '@prisma/client';
import { getBcvRate } from '@/lib/currency';
import HomeBanner from '@/components/HomeBanner';
import InstagramSection from '@/components/InstagramSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { InspirationGallery } from '@/components/InspirationGallery';
import { FloatingActions } from '@/components/FloatingActions';
import { TrendingSection } from '@/components/TrendingSection';
import { AboutSection } from '@/components/AboutSection';
import { FeaturedProductsSection } from '@/components/FeaturedProductsSection';
import { WhyChooseUsSection } from '@/components/WhyChooseUsSection';
import { ValuesSection } from '@/components/ValuesSection';
import './homepage.css';

const prisma = new PrismaClient();

export const revalidate = 0; // Siempre dinámico, sin caché

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

    return sortedProducts.slice(0, 4);
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
      <AboutSection aboutSectionImage={siteConfig.aboutSectionImage} stats={stats} />
      <FeaturedProductsSection featuredProducts={featuredProducts} bcvRate={bcvRate} />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <InspirationGallery inspirationImages={galleryImages} />
      <InstagramSection />
      <ValuesSection />
      <FloatingActions />
    </div>
  );
}