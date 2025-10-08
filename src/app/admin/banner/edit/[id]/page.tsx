'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EditBannerPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [banner, setBanner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [formData, setFormData] = useState({ title: '', alt: '' });

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const response = await fetch(`/api/banner/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setBanner(data);
        setImagePreview(data.src);
        setFormData({ title: data.title || '', alt: data.alt || '' });
      }
    } catch (error) {
      console.error('Error fetching banner:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!banner) {
    return <div className="min-h-screen flex items-center justify-center">Banner no encontrado</div>;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localImageUrl = URL.createObjectURL(file);
      setImagePreview(localImageUrl);
    } else {
      setImagePreview(banner.src);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const localImageUrl = URL.createObjectURL(file);
        setImagePreview(localImageUrl);
        
        const input = document.getElementById('image') as HTMLInputElement;
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const form = new FormData(e.currentTarget);
      const imageFile = form.get('image') as File;
      let finalImageUrl = banner.src;

      if (imageFile && imageFile.size > 0) {
        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);

        const uploadResponse = await fetch('/api/upload/banner', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Error al subir la imagen');
        }

        const { url } = await uploadResponse.json();
        finalImageUrl = url;
        setIsUploading(false);
      }

      const updateResponse = await fetch(`/api/banner/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          alt: formData.alt,
          src: finalImageUrl
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Error al actualizar el banner');
      }
      
      alert('Banner actualizado con éxito!');
      router.push('/admin/banner');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar el banner');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Editar Banner</h1>
            <p className="text-gray-600">Modifica la información de la imagen del banner</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/admin/banner">← Volver</Link>
          </Button>
        </div>

        <div className="glass p-8 rounded-2xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título del banner"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="alt">Texto Alternativo</Label>
              <Input
                id="alt"
                name="alt"
                value={formData.alt}
                onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                placeholder="Descripción de la imagen"
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label>Imagen del Banner</Label>
              <div className="mt-2">
                <div className="flex items-center justify-center w-full">
                  <label 
                    htmlFor="image" 
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                      isUploading 
                        ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
                        : isDragOver
                        ? 'border-blue-400 bg-blue-50 scale-105'
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isUploading ? (
                        <>
                          <svg className="w-8 h-8 mb-3 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <p className="text-sm text-gray-500">Subiendo imagen...</p>
                        </>
                      ) : (
                        <>
                          <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className={`mb-2 text-sm transition-colors ${
                            isDragOver ? 'text-blue-600 font-semibold' : 'text-gray-500'
                          }`}>
                            <span className="font-semibold">
                              {isDragOver ? 'Suelta la imagen aquí' : 'Haz clic para subir'}
                            </span>
                            {!isDragOver && ' o arrastra la imagen'}
                          </p>
                          <p className={`text-xs transition-colors ${
                            isDragOver ? 'text-blue-500' : 'text-gray-500'
                          }`}>
                            PNG, JPG, JPEG (MAX. 10MB)
                          </p>
                        </>
                      )}
                    </div>
                    <input 
                      id="image" 
                      name="image" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      disabled={isUploading}
                      className="hidden" 
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Selecciona una nueva imagen para reemplazar la actual (opcional)
                </p>
              </div>
            </div>

            <div>
              <Label>Vista Previa</Label>
              <div className="mt-2 aspect-video rounded-lg overflow-hidden bg-gray-100">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={banner.alt}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="9" cy="9" r="2"/>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button 
                type="submit" 
                variant="gradient" 
                disabled={isSubmitting || isUploading}
                className="flex-1"
              >
                {isUploading ? 'Subiendo imagen...' : isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
              <Button 
                type="button" 
                variant={banner.active ? "outline" : "modern"}
                onClick={async () => {
                  try {
                    const response = await fetch(`/api/banner/${params.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ active: !banner.active }),
                    });
                    if (response.ok) {
                      setBanner({ ...banner, active: !banner.active });
                      alert(`Banner ${!banner.active ? 'activado' : 'desactivado'}`);
                    }
                  } catch (error) {
                    alert('Error al cambiar estado');
                  }
                }}
              >
                {banner.active ? 'Desactivar' : 'Activar'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/banner">Cancelar</Link>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}