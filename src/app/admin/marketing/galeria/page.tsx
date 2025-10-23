import db from '@/db/db';
import { GalleryManagement } from '@/components/GalleryManagement';

async function getGalleryImages() {
  try {
    return await db.galleryImage.findMany({
      orderBy: { order: 'asc' }
    });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }
}

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">Galería de Inspiración</h1>
        <p className="text-gray-600 mt-2">Gestiona las imágenes que aparecen en la galería de inspiración de la página principal</p>
      </div>
      
      <GalleryManagement images={images} />
    </div>
  );
}