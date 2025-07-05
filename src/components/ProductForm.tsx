// src/components/ProductForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Importamos los componentes de Shadcn/UI que instalamos
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ProductCard from './ProductCard';
import { Category } from '@prisma/client';

interface ProductData {
  id?: number;
  name?: string;
  description?: string;
  priceUSD?: number;
  stock?: number;
  sku?: string | null;
  imageUrl?: string | null;
  // Añadimos published para la vista previa
  published?: boolean;
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
    published: true,
    categoryId: 0,
  });
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
        published: initialData.published ?? true,
        categoryId: initialData.categoryId || 0,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumericField = ['priceUSD', 'stock', 'categoryId'].includes(name);
    setProduct(prevState => ({
      ...prevState,
      [name]: isNumericField ? parseInt(value, 10) || 0 : value,
    }));
  };

  // --- INICIO DE LA LÓGICA COMPLETA ---
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    // Asegúrate de que este es el nombre de tu "upload preset" en Cloudinary
    formData.append('upload_preset', 'Productos'); 

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error.message || 'Error al subir la imagen');
        }

        const data = await response.json();
        // Actualizamos el estado del producto con la nueva URL de la imagen
        setProduct(prevState => ({ ...prevState, imageUrl: data.secure_url }));

    } catch (error) {
        console.error("Error de subida:", error);
        alert(`No se pudo subir la imagen: ${(error as Error).message}`);
    } finally {
        setIsUploading(false);
    }
  };
  // --- FIN DE LA LÓGICA COMPLETA ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.categoryId) {
        alert("Por favor, selecciona una categoría.");
        return;
    }
    const method = initialData ? 'PUT' : 'POST';
    const url = initialData ? `/api/products/${initialData.id}` : '/api/products';
    try {
      const { id: _id, ...productDataToSend } = product;
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productDataToSend),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      alert('¡Producto guardado con éxito!');
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
        alert((error as Error).message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* Columna del Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-2">
        <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Nombre del Producto</Label>
            <Input type="text" id="name" name="name" value={product.name} onChange={handleChange} required />
        </div>
        
        <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" name="description" value={product.description} onChange={handleChange} placeholder="Describe tu producto aquí." />
        </div>

        <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="categoryId">Categoría</Label>
            <select
                id="categoryId"
                name="categoryId"
                value={product.categoryId}
                onChange={handleChange}
                required
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <option value={0} disabled>Selecciona una categoría</option>
                {categories.map(category => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
        
        <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="image">Imagen del Producto</Label>
            <Input id="image" type="file" onChange={handleImageChange} disabled={isUploading} />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid items-center gap-1.5">
                <Label htmlFor="sku">SKU</Label>
                <Input type="text" id="sku" name="sku" value={product.sku ?? ''} onChange={handleChange} />
            </div>
            <div className="grid items-center gap-1.5">
                <Label htmlFor="priceUSD">Precio (USD)</Label>
                <Input type="number" id="priceUSD" name="priceUSD" value={product.priceUSD} onChange={handleChange} required step="0.01" />
            </div>
        </div>
        <div className="grid items-center gap-1.5">
            <Label htmlFor="stock">Stock</Label>
            <Input type="number" id="stock" name="stock" value={product.stock} onChange={handleChange} required />
        </div>
        
        <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? 'Subiendo imagen...' : 'Guardar Producto'}
        </Button>
      </form>

      {/* Columna de Vista Previa */}
      <div className="lg:col-span-1 flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Vista Previa en la Tienda</h3>
        <div className="w-full max-w-xs">
          <ProductCard 
            product={{
              id: product.id,
              name: product.name,
              priceUSD: product.priceUSD,
              imageUrl: product.imageUrl
            }}
            // Pasamos un valor de tasa de prueba para la vista previa
            bcvRate={36.33} 
          />
        </div>
         {isUploading && <p className="text-sm text-gray-500 mt-4">Actualizando vista previa...</p>}
      </div>
    </div>
  );
}
