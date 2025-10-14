'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateMarketingProduct } from '@/app/admin/marketing/products/actions';

interface Product {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  priceUSD: number;
  stock: number;
  sku: string | null;
  category: {
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
}

interface MarketingProductFormProps {
  product: Product;
  categories: Category[];
}

export function MarketingProductForm({ product, categories }: MarketingProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(product.imageUrl);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localImageUrl = URL.createObjectURL(file);
      setImagePreview(localImageUrl);
    } else {
      setImagePreview(product.imageUrl);
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
        
        // Simular el cambio en el input file
        const input = document.getElementById('image') as HTMLInputElement;
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
      }
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    
    try {
      const imageFile = formData.get('image') as File;
      let finalImageUrl = product.imageUrl;

      // Si hay una nueva imagen, subirla a Cloudinary
      if (imageFile && imageFile.size > 0) {
        setIsUploading(true);
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append('file', imageFile);
        cloudinaryFormData.append('upload_preset', 'Productos');

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        if (!cloudName) {
          throw new Error('Cloudinary no está configurado correctamente');
        }

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: cloudinaryFormData,
        });

        if (!response.ok) {
          throw new Error('Error al subir la imagen');
        }

        const data = await response.json();
        finalImageUrl = data.secure_url;
        setIsUploading(false);
      }

      // Crear nuevo FormData con la URL de la imagen
      const updatedFormData = new FormData();
      updatedFormData.append('name', formData.get('name') as string);
      updatedFormData.append('description', formData.get('description') as string);
      updatedFormData.append('categoryId', formData.get('categoryId') as string);
      if (finalImageUrl) {
        updatedFormData.append('imageUrl', finalImageUrl);
      }

      await updateMarketingProduct(product.id, updatedFormData);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar el producto');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Nombre del Producto</Label>
        <Input
          id="name"
          name="name"
          defaultValue={product.name}
          placeholder="Nombre del producto"
          required
          className="mt-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Información del Producto</Label>
          <div className="mt-2 p-4 bg-gray-50 rounded-lg space-y-2">


            <p><strong>Precio:</strong> ${product.priceUSD}</p>
            <p><strong>Stock:</strong> {product.stock}</p>
            {product.sku && <p><strong>SKU:</strong> {product.sku}</p>}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Esta información no se puede modificar desde marketing
          </p>
        </div>

        <div>
          <Label>Vista Previa</Label>
          <div className="mt-2 aspect-square rounded-lg overflow-hidden bg-gray-100">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt={product.name}
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
      </div>

      <div>
        <Label htmlFor="categoryId">Categoría</Label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={categories.find(cat => cat.name === product.category.name)?.id || ''}
          className="mt-2 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-500 mt-1">
          Selecciona la categoría del producto
        </p>
      </div>

      <div>
        <Label>Imagen del Producto</Label>
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
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={product.description || ''}
          placeholder="Descripción del producto..."
          className="mt-2"
          rows={4}
        />
        <p className="text-sm text-gray-500 mt-1">
          Descripción detallada del producto
        </p>
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
          variant="outline" 
          onClick={() => window.history.back()}
          className="flex-1"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}