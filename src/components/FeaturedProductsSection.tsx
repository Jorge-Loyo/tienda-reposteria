import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  priceUSD: number;
  imageUrl: string;
  stock: number;
  isOfferActive: boolean;
  offerPriceUSD: number | null;
  offerEndsAt: Date | null;
}

interface FeaturedProductsSectionProps {
  featuredProducts: Product[];
  bcvRate: number | null;
}

export function FeaturedProductsSection({ featuredProducts, bcvRate }: FeaturedProductsSectionProps) {
  return (
    <section className="featured-section">
      <div className="featured-container">
        <div className="featured-header">
          <h2 className="featured-title gradient-text">
            Nuestros Productos Destacados
          </h2>
          <p className="featured-subtitle">
            Descubre nuestra selección especial de productos premium para tus creaciones más exquisitas
          </p>
        </div>
        
        {featuredProducts.length > 0 ? (
          <div className="featured-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} bcvRate={bcvRate} />
            ))}
          </div>
        ) : (
          <div className="featured-empty">
            <div className="featured-empty-icon">
              <Star className="w-12 h-12 text-pink-500" />
            </div>
            <p className="featured-empty-text">Próximamente productos destacados</p>
          </div>
        )}
        
        <div className="featured-cta">
          <Button asChild size="lg" className="featured-button">
            <Link href="/tienda">Ver todos los productos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}