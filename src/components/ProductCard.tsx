import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/formatters';
import QuickAddToCart from './QuickAddToCart';

// 1. Actualizamos la interfaz para que acepte todos los datos del producto
interface ProductCardProps {
  product: {
    id: number;
    name: string;
    priceUSD: number;
    imageUrl: string | null;
    stock: number;
    isOfferActive?: boolean;
    offerPriceUSD?: number | null;
    offerEndsAt?: Date | null;
  };
  bcvRate: number | null;
}

export default function ProductCard({ product, bcvRate }: ProductCardProps) {
  const now = new Date();
  // Verificamos si la oferta es válida en este momento
  const onSale = 
    !!product.isOfferActive && 
    product.offerPriceUSD != null && 
    (!product.offerEndsAt || new Date(product.offerEndsAt) > now);

  const displayPrice = onSale ? product.offerPriceUSD! : product.priceUSD;
  const priceVes = bcvRate ? displayPrice * bcvRate : null;
  
  let discountPercent = 0;
  if (onSale && product.priceUSD > 0) {
    discountPercent = Math.round(((product.priceUSD - product.offerPriceUSD!) / product.priceUSD) * 100);
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl glass card-hover h-full">
      <Link href={`/products/${product.id}`} className="block relative">
        <div className="relative h-[250px] sm:h-[350px]">
          <Image
            src={product.imageUrl || '/placeholder.png'}
            alt={product.name || 'Imagen del producto'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        {/* 2. Añadimos un indicador de descuento si el producto está en oferta */}
        {onSale && discountPercent > 0 && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                -{discountPercent}%
            </div>
        )}
      </Link>

      <div className="relative p-4 flex flex-col flex-grow">
        <Link href={`/products/${product.id}`} className="block">
            <h3 className="text-md font-semibold text-gray-800 group-hover:text-pink-600 transition-colors duration-300 truncate">
                {product.name || "Nombre del Producto"}
            </h3>
            <div className="mt-2 flex items-baseline gap-2">
                {/* 3. Mostramos el precio de oferta y el precio original tachado */}
                <p className="tracking-wider gradient-text font-bold text-lg">
                    {formatCurrency(displayPrice || 0)} USD
                </p>
                {onSale && (
                    <p className="tracking-wider text-gray-400 line-through text-sm">
                        {formatCurrency(product.priceUSD || 0)}
                    </p>
                )}
            </div>
            {bcvRate && priceVes ? (
                <p className="text-sm text-gray-600">o {formatCurrency(priceVes, 'VES')}</p>
            ) : (
                <p className="text-xs text-amber-600 pt-1">Tasa Bs. no disponible</p>
            )}
        </Link>
        
        <div className="flex-grow"></div>

        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <QuickAddToCart product={product} />
        </div>
      </div>
    </div>
  );
}
// 4. Añadimos un mensaje si el producto no tiene imagen
export function PlaceholderImage() {  
  return (
    <div className="relative h-[250px] sm:h-[350px] bg-gray-200 flex items-center justify-center">
      <span className="text-gray-500">Imagen no disponible</span>
    </div>
  );
}