'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X } from 'lucide-react';
import { createInstagramPost, updateInstagramPost } from '@/app/admin/instagram/actions';

interface InstagramPost {
  id: number;
  url: string;
  imageUrl: string;
  caption: string;
  order: number;
}

interface InstagramPostFormProps {
  post?: InstagramPost;
}

export function InstagramPostForm({ post }: InstagramPostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(post?.imageUrl || null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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
    setIsDragOver(false);
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

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    
    try {
      let finalImageUrl = post?.imageUrl || '';

      if (imageFile) {
        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);

        const uploadResponse = await fetch('/api/upload/instagram', {
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

      // Actualizar el formData con la URL final
      formData.set('imageUrl', finalImageUrl);

      if (post) {
        await updateInstagramPost(post.id, formData);
      } else {
        await createInstagramPost(formData);
      }
      setAlert({ type: 'success', message: 'Publicación guardada exitosamente' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Error al guardar:', error);
      setAlert({ type: 'error', message: 'Error al guardar la publicación' });
      setTimeout(() => setAlert(null), 5000);
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <div>
      {alert && (
        <div className={`mb-4 p-4 rounded-lg ${alert.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
          {alert.message}
        </div>
      )}
      <form action={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="url">URL de Instagram</Label>
        <Input
          id="url"
          name="url"
          type="url"
          defaultValue={post?.url || ''}
          placeholder="https://www.instagram.com/p/..."
          required
          className="mt-2"
        />
        <p className="text-sm text-gray-500 mt-1">
          Copia la URL completa de la publicación de Instagram
        </p>
      </div>

      <div>
        <Label htmlFor="imageUrl" className="text-sm font-medium text-gray-700 mb-2 block">
          Imagen de la Publicación *
        </Label>
        {!imagePreview ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragOver ? 'border-pink-400 bg-pink-50' : 'border-gray-300 hover:border-pink-400'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
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
        <input
          name="imageUrl"
          type="hidden"
          value={imagePreview || ''}
          required
        />
      </div>

      <div>
        <Label htmlFor="caption">Descripción</Label>
        <Textarea
          id="caption"
          name="caption"
          defaultValue={post?.caption || ''}
          placeholder="Descripción de la publicación..."
          required
          className="mt-2"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="order">Orden de Visualización</Label>
        <Input
          id="order"
          name="order"
          type="number"
          defaultValue={post?.order || 0}
          min="0"
          required
          className="mt-2"
        />
        <p className="text-sm text-gray-500 mt-1">
          Número que determina el orden de aparición (menor número = aparece primero)
        </p>
      </div>

      <div className="flex gap-4 pt-6">
        <Button 
          type="submit" 
          variant="gradient" 
          disabled={isSubmitting || isUploading}
          className="flex-1"
        >
          {isUploading ? 'Subiendo imagen...' : isSubmitting ? 'Guardando...' : (post ? 'Actualizar' : 'Crear')} Publicación
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => window.history.back()}
          className="flex-1"
        >
          Cancelar
        </Button>
      </div>
      </form>
    </div>
  );
}