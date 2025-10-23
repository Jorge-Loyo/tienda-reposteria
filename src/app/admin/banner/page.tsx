'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import './banner-management.css';

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
    <div className="banner-management-container">
      <div className="banner-management-content">
        <div className="banner-management-header">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Gestión de Banner</h1>
            <p className="text-gray-600">Administra las imágenes del carrusel principal</p>
          </div>
          <Button variant="modern" asChild>
            <Link href="/admin/marketing">Volver</Link>
          </Button>
        </div>

        <div className="banner-management-section">
          <div className="banner-management-section-header">
            <h2 className="text-2xl font-bold gradient-text">Imágenes Actuales</h2>
            <Button variant="gradient" asChild>
              <Link href="/admin/banner/create">
                + Añadir Imagen
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="banner-loading">
              <p>Cargando banners...</p>
            </div>
          ) : banners.length === 0 ? (
            <div className="banner-empty">
              <p>No hay banners creados. Crea el primero.</p>
            </div>
          ) : (
            <div className="banner-management-grid">
              {banners.map((image) => (
              <div key={image.id} className="banner-card">
                <div className="banner-card-image-container">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="banner-card-image"
                  />
                  <div>
                    <span className={`banner-card-status ${
                      image.active ? 'active' : 'inactive'
                    }`}>
                      {image.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
                
                <div className="banner-card-content">
                  <h3 className="banner-card-title">
                    {image.title || image.alt}
                  </h3>
                  <div className="banner-card-actions">
                    <Button variant="outline-modern" size="sm" className="btn-flex-1" asChild>
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
                    <Button variant="outline" size="sm" className="btn-delete">
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
        </div>

        <div className="banner-instructions">
          <h3 className="text-lg font-bold gradient-text mb-4">Instrucciones</h3>
          <ul className="banner-instructions-list">
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