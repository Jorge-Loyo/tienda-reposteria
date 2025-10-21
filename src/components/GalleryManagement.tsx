'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { createGalleryImage, updateGalleryImage, toggleGalleryImageStatus, deleteGalleryImage } from '@/app/admin/marketing/galeria/actions';

interface GalleryImage {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  alt: string;
  isActive: boolean;
  order: number;
}

interface GalleryManagementProps {
  images: GalleryImage[];
}

export function GalleryManagement({ images }: GalleryManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/gallery', {
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

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      if (imagePreview) {
        formData.set('imageUrl', imagePreview);
      }

      const result = editingImage 
        ? await updateGalleryImage(editingImage.id, formData)
        : await createGalleryImage(formData);

      if (result.error) {
        alert(result.error);
      } else {
        setShowForm(false);
        setEditingImage(null);
        setImagePreview('');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setImagePreview(image.imageUrl);
    setShowForm(true);
  };

  const handleToggleStatus = async (id: number) => {
    const result = await toggleGalleryImageStatus(id);
    if (result.error) {
      alert(result.error);
    } else {
      window.location.reload();
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      const result = await deleteGalleryImage(id);
      if (result.error) {
        alert(result.error);
      } else {
        window.location.reload();
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingImage(null);
    setImagePreview('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Imágenes de la Galería</h2>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Agregar Imagen
        </Button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {editingImage ? 'Editar Imagen' : 'Nueva Imagen'}
            </h3>
            <Button variant="ghost" size="sm" onClick={resetForm}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form action={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingImage?.title || ''}
                  placeholder="Ej: Cupcakes Gourmet"
                  required
                />
              </div>
              <div>
                <Label htmlFor="alt">Texto alternativo</Label>
                <Input
                  id="alt"
                  name="alt"
                  defaultValue={editingImage?.alt || ''}
                  placeholder="Descripción para accesibilidad"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={editingImage?.description || ''}
                placeholder="Descripción de la imagen..."
                required
              />
            </div>

            <div>
              <Label htmlFor="order">Orden</Label>
              <Input
                id="order"
                name="order"
                type="number"
                defaultValue={editingImage?.order || 0}
                min="0"
              />
            </div>

            <div>
              <Label>Imagen</Label>
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500">
                      {isUploading ? 'Subiendo...' : 'Seleccionar imagen'}
                    </span>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setImagePreview('')}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {isSubmitting ? 'Guardando...' : editingImage ? 'Actualizar' : 'Crear'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de imágenes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div key={image.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="aspect-square">
              <img
                src={image.imageUrl}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-1">{image.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{image.description}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  image.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {image.isActive ? 'Activa' : 'Inactiva'}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(image.id)}
                  >
                    {image.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(image)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(image.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay imágenes</h3>
          <p className="text-gray-500 mb-4">Comienza agregando tu primera imagen a la galería</p>
          <Button onClick={() => setShowForm(true)}>
            Agregar Primera Imagen
          </Button>
        </div>
      )}
    </div>
  );
}