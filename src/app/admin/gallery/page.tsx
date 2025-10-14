'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Edit, Trash2, Image, Eye, EyeOff, Upload, X } from 'lucide-react';

const initialGalleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    title: "Cupcakes Gourmet",
    description: "Hechos con nuestros colorantes premium",
    active: true
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=400&fit=crop",
    title: "Torta de Chocolate",
    description: "Con nuestro chocolate belga importado",
    active: true
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop",
    title: "Macarons Franceses",
    description: "Perfectos con nuestras harinas especiales",
    active: true
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&h=400&fit=crop",
    title: "Donuts Artesanales",
    description: "Glaseados con nuestros azúcares glas",
    active: true
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop",
    title: "Cheesecake Premium",
    description: "Con mermeladas de frutas naturales",
    active: true
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=400&fit=crop",
    title: "Cookies Decoradas",
    description: "Usando nuestros moldes y cortadores",
    active: true
  }
];

export default function GalleryManagementPage() {
  const [galleryImages, setGalleryImages] = useState(initialGalleryImages);
  const [editingImage, setEditingImage] = useState<typeof initialGalleryImages[0] | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState({
    title: '',
    description: '',
    src: '',
    active: true
  });

  const toggleImageStatus = (id: number) => {
    setGalleryImages(images => 
      images.map(img => 
        img.id === id ? { ...img, active: !img.active } : img
      )
    );
  };

  const handleEdit = (image: typeof initialGalleryImages[0]) => {
    setEditingImage(image);
    setPreviewImage(image.src);
    setIsEditDialogOpen(true);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editingImage) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'gallery_images'); // Necesitarás configurar esto en Cloudinary
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      const data = await response.json();
      
      if (data.secure_url) {
        setEditingImage({...editingImage, src: data.secure_url});
        setPreviewImage(data.secure_url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen. Inténtalo de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'gallery_images');
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      const data = await response.json();
      
      if (data.secure_url) {
        setNewImage({...newImage, src: data.secure_url});
        setPreviewImage(data.secure_url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen. Inténtalo de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddImage = () => {
    if (!newImage.title || !newImage.src) {
      alert('Por favor completa el título y selecciona una imagen.');
      return;
    }

    const nextId = Math.max(...galleryImages.map(img => img.id)) + 1;
    const imageToAdd = {
      ...newImage,
      id: nextId
    };

    setGalleryImages(images => [...images, imageToAdd]);
    setIsAddDialogOpen(false);
    setNewImage({ title: '', description: '', src: '', active: true });
    setPreviewImage(null);
  };

  const handleSaveEdit = () => {
    if (!editingImage) return;
    
    setGalleryImages(images => 
      images.map(img => 
        img.id === editingImage.id ? editingImage : img
      )
    );
    setIsEditDialogOpen(false);
    setEditingImage(null);
    setPreviewImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" asChild>
            <Link href="/admin/marketing" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-2">
              <Image className="h-8 w-8 text-purple-600" />
              Gestión de Galería
            </h1>
            <p className="text-gray-600 mt-2">
              Administra las imágenes de la galería de inspiración
            </p>
          </div>
        </div>

        <div className="mb-8">
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500"
          >
            <Plus className="h-4 w-4" />
            Agregar Nueva Imagen
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-48 object-cover"
                />
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                  image.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {image.active ? 'Activa' : 'Inactiva'}
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{image.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{image.description}</p>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEdit(image)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => toggleImageStatus(image.id)}
                    className={image.active ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}
                  >
                    {image.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Imagen</DialogTitle>
            </DialogHeader>
            {editingImage && (
              <div className="space-y-4">
                {/* Preview de la imagen */}
                <div className="space-y-2">
                  <Label>Vista Previa</Label>
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <Image className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Subir nueva imagen */}
                <div className="space-y-2">
                  <Label>Cambiar Imagen</Label>
                  <div className="flex gap-2">
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full" 
                        disabled={isUploading}
                        // Corregido: forzamos el tipo (casting) a HTMLInputElement para acceder al método click
                        onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                      >
                        {isUploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                            Subiendo...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Subir Imagen
                          </>
                        )}
                      </Button>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={editingImage.title}
                    onChange={(e) => setEditingImage({...editingImage, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    value={editingImage.description}
                    onChange={(e) => setEditingImage({...editingImage, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="src">URL de la Imagen (opcional)</Label>
                  <Input
                    id="src"
                    value={editingImage.src}
                    onChange={(e) => {
                      setEditingImage({...editingImage, src: e.target.value});
                      setPreviewImage(e.target.value);
                    }}
                    placeholder="O pega una URL directamente"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSaveEdit} className="flex-1">
                    Guardar Cambios
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setIsEditDialogOpen(false);
                    setPreviewImage(null);
                  }}>
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add New Image Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Agregar Nueva Imagen</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Preview de la nueva imagen */}
              <div className="space-y-2">
                <Label>Vista Previa</Label>
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Image className="w-12 h-12" />
                    </div>
                  )}
                </div>
              </div>

              {/* Subir imagen */}
              <div className="space-y-2">
                <Label>Seleccionar Imagen *</Label>
                <div className="flex gap-2">
                  <label className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAddImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full" 
                      disabled={isUploading}
                      onClick={() => {
                        const input = document.querySelector('#add-image-input') as HTMLInputElement;
                        input?.click();
                      }}
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                          Subiendo...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Subir Imagen
                        </>
                      )}
                    </Button>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-title">Título *</Label>
                <Input
                  id="new-title"
                  value={newImage.title}
                  onChange={(e) => setNewImage({...newImage, title: e.target.value})}
                  placeholder="Ej: Cupcakes Gourmet"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-description">Descripción</Label>
                <Input
                  id="new-description"
                  value={newImage.description}
                  onChange={(e) => setNewImage({...newImage, description: e.target.value})}
                  placeholder="Ej: Hechos con nuestros colorantes premium"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-src">URL de la Imagen (opcional)</Label>
                <Input
                  id="new-src"
                  value={newImage.src}
                  onChange={(e) => {
                    setNewImage({...newImage, src: e.target.value});
                    setPreviewImage(e.target.value);
                  }}
                  placeholder="O pega una URL directamente"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddImage} className="flex-1">
                  Agregar Imagen
                </Button>
                <Button variant="outline" onClick={() => {
                  setIsAddDialogOpen(false);
                  setNewImage({ title: '', description: '', src: '', active: true });
                  setPreviewImage(null);
                }}>
                  Cancelar
                </Button>
              </div>
            </div>
            
            {/* Hidden file input for add dialog */}
            <input
              id="add-image-input"
              type="file"
              accept="image/*"
              onChange={handleAddImageUpload}
              className="hidden"
              disabled={isUploading}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}