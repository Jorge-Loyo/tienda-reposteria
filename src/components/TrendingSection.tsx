'use client';

import ProductCard from '@/components/ProductCard';
import { TrendingUp, Fire, Star } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  priceUSD: number;
  imageUrl: string | null;
  stock: number;
  salesCount: number;
  isOfferActive: boolean;
  offerPriceUSD: number | null;
  offerEndsAt: Date | null;
}

function TrendingBadge({ type }: { type: 'hot' | 'trending' | 'popular' }) {
  const getBadgeConfig = (badgeType: string) => {
    switch (badgeType) {
      case 'hot':
        return { emoji: '🔥', text: 'HOT', color: 'bg-red-500' };
      case 'trending':
        return { emoji: '📈', text: 'TRENDING', color: 'bg-green-500' };
      case 'popular':
        return { emoji: '⭐', text: 'POPULAR', color: 'bg-purple-500' };
      default:
        return { emoji: '⭐', text: 'POPULAR', color: 'bg-purple-500' };
    }
  };

  const badge = getBadgeConfig(type);

  return (
    <div className={`${badge.color} text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg`}>
      <span>{badge.emoji}</span>
      {badge.text}
    </div>
  );
}

interface TrendingSectionProps {
  products: Product[];
  bcvRate: number | null;
}

export function TrendingSection({ products, bcvRate }: TrendingSectionProps) {
  if (products.length === 0) {
    return null; // No mostrar la sección si no hay productos
  }

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <TrendingBadge type="trending" />
          </div>
          <h2 className="text-4xl font-bold gradient-text mb-4">
            🔥 Trending Now
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Los productos más populares del momento. ¡No te quedes sin los favoritos de nuestros clientes!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div key={product.id} className="relative">
              {/* Badge según posición */}
              <div className="absolute top-4 left-4 z-10">
                {index === 0 && <TrendingBadge type="hot" />}
                {index === 1 && <TrendingBadge type="trending" />}
                {index === 2 && <TrendingBadge type="popular" />}
              </div>
              
              <div className="transform transition-all duration-300 hover:scale-105">
                <ProductCard 
                  product={product} 
                  bcvRate={bcvRate}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>🔥</span>
              <span className="font-medium">Actualizado cada hora</span>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>📈</span>
              <span className="font-medium">Basado en todos los pedidos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}