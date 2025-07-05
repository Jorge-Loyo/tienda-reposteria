// src/components/ProductCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/formatters'; // Asumimos que esta función existe

// Definimos la forma de las props que el componente espera recibir
interface ProductCardProps {
  product: {
    id: number;
    name: string;
    priceUSD: number;
    imageUrl: string | null;
  };
  // Recibe la tasa de cambio como una propiedad
  bcvRate: number | null;
}

export default function ProductCard({ product, bcvRate }: ProductCardProps) {
  // Calculamos el precio en Bolívares usando la tasa que nos pasaron.
  const priceVes = bcvRate ? product.priceUSD * bcvRate : null;

  // Si el id es 0 o no existe, no envolvemos en un link (útil para la vista previa)
  const CardContainer = product.id ? Link : 'div';

  return (
    <CardContainer 
      href={`/products/${product.id}`} 
      className="group block overflow-hidden border border-gray-200 rounded-lg shadow-sm bg-white"
    >
      <div className="relative h-[250px] sm:h-[350px]">
        <Image
          src={product.imageUrl || '/placeholder.png'}
          alt={product.name || 'Imagen del producto'}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="relative p-4">
        <h3 className="text-md font-semibold text-gray-800 group-hover:underline group-hover:underline-offset-4 truncate">
          {product.name || "Nombre del Producto"}
        </h3>

        <div className="mt-2">
          <p className="tracking-wider text-gray-900 font-bold">
            {formatCurrency(product.priceUSD || 0)} USD
          </p>
          {bcvRate && priceVes ? (
            <p className="text-sm text-gray-600">
              o {formatCurrency(priceVes, 'VES')}
            </p>
          ) : (
            <p className="text-xs text-amber-600 pt-1">Tasa Bs. no disponible</p>
          )}
        </div>
      </div>
    </CardContainer>
  );
}
