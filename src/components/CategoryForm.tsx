'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CategoryImageSelector } from '@/components/CategoryImageSelector';

interface CategoryFormProps {
  category?: {
    id: number;
    name: string;
    imageUrl?: string | null;
  };
}

export function CategoryForm({ category }: CategoryFormProps) {
  const [selectedImage, setSelectedImage] = useState(category?.imageUrl || '');
  const [name, setName] = useState(category?.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isEditing = !!category;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsLoading(true);
    try {
      const url = isEditing ? `/api/categories/${category.id}` : '/api/categories';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), imageUrl: selectedImage })
      });
      
      if (response.ok) {
        router.push('/admin/categories');
        router.refresh();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre de la Categoría</Label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Ej: Arequipes, Chocolates, etc."
        />
      </div>
      
      <CategoryImageSelector
        selectedImage={selectedImage}
        onImageSelect={setSelectedImage}
      />
      
      <Button type="submit" disabled={isLoading || !name.trim()} className="w-full">
        {isLoading 
          ? "Guardando..." 
          : isEditing 
            ? "Actualizar Categoría" 
            : "Crear Categoría"
        }
      </Button>
    </form>
  );
}