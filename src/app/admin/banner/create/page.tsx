'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Upload, X } from 'lucide-react';

export default function CreateBannerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    alt: '',
    active: true
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return;

    setIsLoading(true);
    try {
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

      const bannerResponse = await fetch('/api/banner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          src: url,
        }),
      });

      if (!bannerResponse.ok) {
        throw new Error('Error al crear el banner');
      }

      router.push('/admin/banner');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear el banner');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Añadir Nueva Imagen</h1>
            <p className="text-gray-600">Sube una nueva imagen para el carrusel principal</p>
          </div>
          <Button variant="modern" asChild>
            <Link href="/admin/banner">Volver</Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl shadow-xl">
          <div className="space-y-6">
            <div>
              <Label htmlFor="image" className="text-sm font-medium text-gray-700 mb-2 block">
                Imagen del Banner *
              </Label>
              {!imagePreview ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-400 transition-colors cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => document.getElementById('image-input')?.click()}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">Arrastra una imagen aquí o haz clic para seleccionar</p>
                  <p className="text-sm text-gray-500">PNG, JPG, WebP hasta 5MB</p>
                  <input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">
                Título (opcional)
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título descriptivo del banner"
              />
            </div>

            <div>
              <Label htmlFor="alt" className="text-sm font-medium text-gray-700 mb-2 block">
                Texto Alternativo *
              </Label>
              <Input
                id="alt"
                value={formData.alt}
                onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                placeholder="Descripción de la imagen para accesibilidad"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="active"
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
              />
              <Label htmlFor="active" className="text-sm font-medium text-gray-700">
                Activar imagen inmediatamente
              </Label>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button
              type="submit"
              variant="gradient"
              disabled={!imageFile || !formData.alt || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Creando...' : 'Crear Banner'}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/banner">Cancelar</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}