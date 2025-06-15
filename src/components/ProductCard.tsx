import Link from 'next/link';
import Image from 'next/image';
interface ProductCardProps { product: { id: number; name: string; priceUSD: number; imageUrl: string | null; }; }
export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group block overflow-hidden border border-gray-200 rounded-lg shadow-sm">
      <div className="relative h-[250px] sm:h-[350px]">
        <Image src={product.imageUrl || '/placeholder.png'} alt={product.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" style={{ objectFit: 'cover' }} className="transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="relative bg-white p-4">
        <h3 className="text-md font-semibold text-gray-800 group-hover:underline group-hover:underline-offset-4">{product.name}</h3>
        <p className="mt-2"><span className="sr-only"> Precio: </span><span className="tracking-wider text-gray-900 font-bold">${product.priceUSD.toFixed(2)} USD</span></p>
      </div>
    </Link>
  );
}