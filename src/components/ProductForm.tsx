'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ProductCard from './ProductCard'; 
import { Category } from '@prisma/client';

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
    
    // CORRECCIÓN: Se maneja el precio (priceUSD) de forma separada para permitir decimales.
    setProduct(prevState => {
      let newValue: string | number = value;

      if (name === 'priceUSD') {
        // Usamos parseFloat para el precio, permitiendo decimales.
        // Si el campo está vacío, se convierte en 0.
        newValue = value === '' ? '' : parseFloat(value);
      } else if (['stock', 'categoryId'].includes(name)) {
        // Para los otros campos numéricos, usamos parseInt.
        newValue = parseInt(value, 10) || 0;
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
      const localImageUrl = URL.createObjectURL(file);
      setImagePreview(localImageUrl);
    } else {
      setImagePreview(initialData?.imageUrl || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const imageFile = (document.getElementById('image') as HTMLInputElement).files?.[0];

    if (!initialData && !imageFile) {
        alert("Por favor, selecciona una imagen para el nuevo producto.");
        return;
    }

    if (!product.categoryId) {
        alert("Por favor, selecciona una categoría.");
        return;
    }

    let finalImageUrl = product.imageUrl;

    if (imageFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', 'Productos'); 

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('Error al subir la imagen a Cloudinary');
            const data = await response.json();
            finalImageUrl = data.secure_url;
        } catch (error) {
            console.error("Error de subida:", error);
            alert("No se pudo subir la imagen.");
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

      alert('Producto guardado con éxito!');
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
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
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="image">Imagen del Producto</Label>
          <Input id="image" type="file" onChange={handleImageChange} disabled={isUploading} />
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
  );
}
