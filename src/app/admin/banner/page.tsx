'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function BannerManagementPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banner');
      if (response.ok) {
        const data = await response.json();
        setBanners(data);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBannerStatus = async (id: number) => {
    try {
      const banner = banners.find(b => b.id === id);
      const response = await fetch(`/api/banner/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !banner?.active }),
      });
      if (response.ok) {
        setBanners(banners.map(b => 
          b.id === id ? { ...b, active: !b.active } : b
        ));
      }
    } catch (error) {
      alert('Error al cambiar estado');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Gestión de Banner</h1>
            <p className="text-gray-600">Administra las imágenes del carrusel principal</p>
          </div>
          <Button variant="modern" asChild>
            <Link href="/admin/marketing">Volver</Link>
          </Button>
        </div>

        <div className="glass p-8 rounded-2xl shadow-xl mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold gradient-text">Imágenes Actuales</h2>
            <Button variant="gradient" asChild>
              <Link href="/admin/banner/create">
                + Añadir Imagen
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando banners...</p>
            </div>
          ) : banners.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay banners creados. Crea el primero.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((image) => (
              <div key={image.id} className="glass rounded-xl overflow-hidden shadow-lg">
                <div className="aspect-video relative">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      image.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {image.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {image.title || image.alt}
                  </h3>
                  <div className="flex gap-2">
                    <Button variant="outline-modern" size="sm" className="flex-1" asChild>
                      <Link href={`/admin/banner/edit/${image.id}`}>
                        Editar
                      </Link>
                    </Button>
                    <Button 
                      variant={image.active ? "outline" : "modern"} 
                      size="sm" 
                      onClick={() => toggleBannerStatus(image.id)}
                    >
                      {image.active ? 'Desactivar' : 'Activar'}
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass p-6 rounded-2xl shadow-xl">
          <h3 className="text-lg font-bold gradient-text mb-4">Instrucciones</h3>
          <ul className="text-gray-600 space-y-2">
            <li>• Las imágenes deben tener una resolución mínima de 1920x1080px</li>
            <li>• Formatos soportados: JPG, PNG, WebP</li>
            <li>• Tamaño máximo: 5MB por imagen</li>
            <li>• Se recomienda usar imágenes con relación de aspecto 16:9</li>
          </ul>
        </div>
      </div>
    </div>
  );
}