import { X, ExternalLink } from 'lucide-react';
import { GalleryModal } from './GalleryModal';

interface InspirationImage {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  alt: string;
}

interface InspirationGalleryProps {
  inspirationImages?: InspirationImage[];
}

export function InspirationGallery({ inspirationImages = [] }: InspirationGalleryProps) {

  return (
    <>
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Galería de Inspiración
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubre las increíbles creaciones que nuestros clientes han hecho con nuestros productos
            </p>
          </div>

          {inspirationImages.length > 0 ? (
            <GalleryModal images={inspirationImages} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">¡Próximamente más inspiración!</p>
              <p className="text-sm text-gray-400">Estamos preparando increíbles creaciones para inspirarte.</p>
            </div>
          )}
        </div>
      </section>


    </>
  );
}