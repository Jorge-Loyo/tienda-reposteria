'use client';

import ProductCard from '@/components/ProductCard';
import { TrendingUp, Star } from 'lucide-react';
import './TrendingSection.css';

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
    <div className={`trending-badge ${type}`}>
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
    <section className="trending-section">
      <div className="trending-container">
        <div className="trending-header">
          <div className="trending-badge-container">
            <TrendingBadge type="trending" />
          </div>
          <h2 className="trending-title gradient-text">
            🔥 Trending Now
          </h2>
          <p className="trending-subtitle">
            Los productos más populares del momento. ¡No te quedes sin los favoritos de nuestros clientes!
          </p>
        </div>

        <div className="trending-grid">
          {products.map((product, index) => (
            <div key={product.id} className="trending-product-container">
              <div className="trending-product-badge">
                {index === 0 && <TrendingBadge type="hot" />}
                {index === 1 && <TrendingBadge type="trending" />}
                {index === 2 && <TrendingBadge type="popular" />}
              </div>
              
              <div className="trending-product-card">
                <ProductCard 
                  product={product} 
                  bcvRate={bcvRate}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="trending-footer">
          <div className="trending-footer-info">
            <div className="trending-footer-item">
              <span>🔥</span>
              <span className="font-medium">Actualizado cada hora</span>
            </div>
            <div className="trending-footer-divider"></div>
            <div className="trending-footer-item">
              <span>📈</span>
              <span className="font-medium">Basado en todos los pedidos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}