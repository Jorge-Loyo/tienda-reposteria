// src/components/ProductCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { formatToVes } from '@/lib/currency'; // Solo necesitamos la función de formato

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

// El componente ya NO es 'async'. Es un componente simple y síncrono.
export default function ProductCard({ product, bcvRate }: ProductCardProps) {
  // Calculamos el precio en Bolívares usando la tasa que nos pasaron.
  const priceVes = bcvRate ? product.priceUSD * bcvRate : null;

  return (
    <Link href={`/products/${product.id}`} className="group block overflow-hidden border border-gray-200 rounded-lg shadow-sm">
      <div className="relative h-[250px] sm:h-[350px]">
        <Image
          src={product.imageUrl || '/placeholder.png'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="relative bg-white p-4">
        <h3 className="text-md font-semibold text-gray-800 group-hover:underline group-hover:underline-offset-4">
          {product.name}
        </h3>

        {/* --- INICIO DE LA CORRECCIÓN --- */}
        {/* Lógica mejorada para mostrar el precio */}
        <div className="mt-2">
          <p className="tracking-wider text-gray-900 font-bold">${product.priceUSD.toFixed(2)} USD</p>
          {/* Si bcvRate tiene un valor, mostramos el precio calculado.
            Si es null, mostramos un mensaje indicando que la tasa no está disponible.
          */}
          {bcvRate && priceVes ? (
            <p className="text-sm text-gray-600">
              o {formatToVes(priceVes)}
            </p>
          ) : (
            <p className="text-xs text-amber-600 pt-1">Tasa Bs. no disponible</p>
          )}
        </div>
        {/* --- FIN DE LA CORRECCIÓN --- */}
      </div>
    </Link>
  );
}

