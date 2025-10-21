'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { updateSiteConfig } from '@/app/admin/marketing/configuracion/actions';

interface SiteConfigFormProps {
  config: {
    aboutSectionImage: string;
  };
}

export function SiteConfigForm({ config }: SiteConfigFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(config.aboutSectionImage);

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/site', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Error al subir imagen');

      const { url } = await response.json();
      setImagePreview(url);
      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await updateSiteConfig('about_section_image', imagePreview);
      
      if (result.error) {
        alert(result.error);
      } else {
        alert('Configuración actualizada exitosamente');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h3 className="text-lg font-medium mb-4">Imagen de la Sección "Quiénes Somos"</h3>
        
        <div className="space-y-4">
          <div>
            <Label>Imagen Actual</Label>
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Imagen de la sección Quiénes Somos"
                className="w-full max-w-md h-48 object-cover rounded-lg"
              />
            </div>
          </div>

          <div>
            <Label>Cambiar Imagen</Label>
            <div className="mt-2">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="hidden"
                  id="about-image-upload"
                />
                <label htmlFor="about-image-upload" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-500">
                    {isUploading ? 'Subiendo...' : 'Seleccionar nueva imagen'}
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG hasta 5MB</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || isUploading}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>
    </div>
  );
}