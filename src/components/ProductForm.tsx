'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X } from 'lucide-react';
import ProductCard from './ProductCard'; 
import { Category } from '@prisma/client';
import { sanitizeText } from '@/lib/sanitizer';

interface ProductData {
  id?: number;
  name?: string;
  description?: string | null;
  priceUSD?: number;
  stock?: number;
  sku?: string | null;
  imageUrl?: string | null;
  categoryId?: number;
}

export default function ProductForm({ 
  initialData, 
  categories 
}: { 
  initialData?: ProductData, 
  categories: Category[] 
}) {
  const [product, setProduct] = useState({
    id: 0,
    name: '',
    description: '',
    priceUSD: 0,
    stock: 0,
    sku: '',
    imageUrl: '',
    categoryId: 0,
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (initialData) {
      setProduct({
        id: initialData.id || 0,
        name: initialData.name || '',
        description: initialData.description || '',
        priceUSD: initialData.priceUSD || 0,
        stock: initialData.stock || 0,
        sku: initialData.sku || '',
        imageUrl: initialData.imageUrl || '',
        categoryId: initialData.categoryId || 0,
      });
      if (initialData.imageUrl) {
        setImagePreview(initialData.imageUrl);
      }
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setProduct(prevState => {
      let newValue: string | number = value;

      if (name === 'priceUSD') {
        newValue = value === '' ? '' : parseFloat(value);
      } else if (['stock', 'categoryId'].includes(name)) {
        newValue = parseInt(value, 10) || 0;
      } else if (typeof value === 'string') {
        // Sanitizar campos de texto
        newValue = sanitizeText(value);
      }
      
      return {
        ...prevState,
        [name]: newValue,
      };
    });
  };

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
    setImagePreview(initialData?.imageUrl || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!initialData && !imageFile) {
        setAlert({ type: 'error', message: 'Por favor, selecciona una imagen para el nuevo producto.' });
        setTimeout(() => setAlert(null), 5000);
        return;
    }

    if (!product.categoryId) {
        setAlert({ type: 'error', message: 'Por favor, selecciona una categoría.' });
        setTimeout(() => setAlert(null), 5000);
        return;
    }

    let finalImageUrl = product.imageUrl;

    if (imageFile) {
        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);

        try {
            const uploadResponse = await fetch('/api/upload/products', {
                method: 'POST',
                body: uploadFormData,
            });
            
            if (!uploadResponse.ok) {
                throw new Error('Error al subir la imagen');
            }
            
            const { url } = await uploadResponse.json();
            finalImageUrl = url;
        } catch (error) {
            console.error("Error de subida:", error);
            setAlert({ type: 'error', message: 'No se pudo subir la imagen.' });
            setTimeout(() => setAlert(null), 5000);
            setIsUploading(false);
            return;
        } finally {
            setIsUploading(false);
        }
    }

    const method = initialData ? 'PUT' : 'POST';
    const url = initialData ? `/api/products/${initialData.id}` : '/api/products';
    
    try {
      const { id: _id, ...productData } = product;
      // Aseguramos que el precio sea un número antes de enviarlo
      const productDataToSend = { 
        ...productData, 
        priceUSD: parseFloat(String(product.priceUSD)) || 0,
        imageUrl: finalImageUrl 
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productDataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'No se pudo guardar el producto.');
      }

      setAlert({ type: 'success', message: 'Producto guardado con éxito!' });
      setTimeout(() => {
        router.push('/admin/products');
        router.refresh();
      }, 1500);
    } catch (error) {
      setAlert({ type: 'error', message: (error as Error).message });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  return (
    <div>
      {alert && (
        <div className={`mb-4 p-4 rounded-lg ${alert.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
          {alert.message}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid w-full items-center gap-1.5"><Label htmlFor="name">Nombre del Producto</Label><Input type="text" id="name" name="name" value={product.name} onChange={handleChange} required /></div>
        <div className="grid w-full items-center gap-1.5"><Label htmlFor="description">Descripción</Label><Textarea id="description" name="description" value={product.description || ''} onChange={handleChange} placeholder="Describe tu producto aquí." /></div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="categoryId">Categoría</Label>
          <select id="categoryId" name="categoryId" value={product.categoryId} onChange={handleChange} required className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <option value={0} disabled>Selecciona una categoría</option>
            {categories.map(category => (<option key={category.id} value={category.id}>{category.name}</option>))}
          </select>
        </div>
        <div>
          <Label htmlFor="image" className="text-sm font-medium text-gray-700 mb-2 block">
            Imagen del Producto *
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
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="grid items-center gap-1.5"><Label htmlFor="sku">SKU</Label><Input type="text" id="sku" name="sku" value={product.sku ?? ''} onChange={handleChange} /></div>
            {/* CORRECCIÓN: Se asegura que el campo de precio permita decimales */}
            <div className="grid items-center gap-1.5"><Label htmlFor="priceUSD">Precio (USD)</Label><Input type="number" id="priceUSD" name="priceUSD" value={product.priceUSD} onChange={handleChange} required step="0.01" /></div>
        </div>
        <div className="grid items-center gap-1.5"><Label htmlFor="stock">Stock</Label><Input type="number" id="stock" name="stock" value={product.stock} onChange={handleChange} required /></div>
        <Button type="submit" className="w-full" disabled={isUploading}>{isUploading ? 'Subiendo imagen...' : 'Guardar Producto'}</Button>
        </form>
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Vista Previa en la Tienda</h3>
        <div className="w-full max-w-xs">
          <ProductCard
            product={{
              id: product.id,
              name: product.name,
              priceUSD: Number(product.priceUSD),
              imageUrl: imagePreview,
              stock: product.stock, // Añadido para que la vista previa sea más completa
            }}
            bcvRate={null}
          />
        </div>
        </div>
      </div>
    </div>
  );
}
