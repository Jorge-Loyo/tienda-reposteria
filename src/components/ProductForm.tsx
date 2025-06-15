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

interface ProductData {
  id?: number; name?: string; description?: string; priceUSD?: number; stock?: number; sku?: string | null; imageUrl?: string | null;
}

export default function ProductForm({ initialData }: { initialData?: ProductData }) {
  const [product, setProduct] = useState({ id: 0, name: '', description: '', priceUSD: 0, stock: 0, sku: '', imageUrl: '', });
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (initialData) {
      setProduct({ id: initialData.id || 0, name: initialData.name || '', description: initialData.description || '', priceUSD: initialData.priceUSD || 0, stock: initialData.stock || 0, sku: initialData.sku || '', imageUrl: initialData.imageUrl || '', });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prevState => ({ ...prevState, [name]: e.target.type === 'number' ? parseFloat(value) || 0 : value, }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Productos'); // Revisa que este sea tu nombre de preset
    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData, });
        if (!response.ok) throw new Error('Error al subir la imagen');
        const data = await response.json();
        setProduct(prevState => ({ ...prevState, imageUrl: data.secure_url }));
    } catch (error) {
        console.error("Error de subida:", error);
        alert("No se pudo subir la imagen.");
    } finally {
        setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = initialData ? 'PUT' : 'POST';
    const url = initialData ? `/api/products/${initialData.id}` : '/api/products';
    try {
      // --- LÍNEA CORREGIDA ---
      const { id: _id, ...productDataToSend } = product; // Renombramos 'id' a '_id' para indicar que no se usa
      // --- FIN DE LA CORRECCIÓN ---

      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productDataToSend), });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
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
        <div className="grid w-full items-center gap-1.5"><Label htmlFor="description">Descripción</Label><Textarea id="description" name="description" value={product.description} onChange={handleChange} placeholder="Describe tu producto aquí." /></div>
        <div className="grid w-full items-center gap-1.5"><Label htmlFor="image">Imagen del Producto</Label><Input id="image" type="file" onChange={handleImageChange} disabled={isUploading} /></div>
        {isUploading && <p className="text-sm text-gray-500">Subiendo imagen...</p>}
        {product.imageUrl && ( <div className="mt-4"><p className="text-sm">Vista previa:</p><Image src={product.imageUrl} alt="Vista previa" width={100} height={100} className="rounded-md object-cover" /></div> )}
        <div className="grid grid-cols-2 gap-4">
            <div className="grid items-center gap-1.5"><Label htmlFor="sku">SKU</Label><Input type="text" id="sku" name="sku" value={product.sku ?? ''} onChange={handleChange} /></div>
            <div className="grid items-center gap-1.5"><Label htmlFor="priceUSD">Precio (USD)</Label><Input type="number" id="priceUSD" name="priceUSD" value={product.priceUSD} onChange={handleChange} required step="0.01" /></div>
        </div>
        <div className="grid items-center gap-1.5"><Label htmlFor="stock">Stock</Label><Input type="number" id="stock" name="stock" value={product.stock} onChange={handleChange} required /></div>
        <Button type="submit" className="w-full" disabled={isUploading}>{isUploading ? 'Subiendo imagen...' : 'Guardar Producto'}</Button>
      </form>
      <div className="flex flex-col items-center"><h3 className="text-lg font-semibold mb-4 text-gray-700">Vista Previa en la Tienda</h3><div className="w-full max-w-xs"><ProductCard product={product} /></div></div>
    </div>
  );
}