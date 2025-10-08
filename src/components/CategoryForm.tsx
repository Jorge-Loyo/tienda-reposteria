'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CategoryImageSelector } from '@/components/CategoryImageSelector';
import { addCategory, updateCategory } from '@/app/admin/categories/_actions/categories';

// Componente para el botón de envío que muestra un estado de carga
function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending 
        ? "Guardando..." 
        : isEditing 
          ? "Actualizar Categoría" 
          : "Crear Categoría"
      }
    </Button>
  );
}

interface CategoryFormProps {
  category?: {
    id: number;
    name: string;
    imageUrl?: string | null;
  };
}

export function CategoryForm({ category }: CategoryFormProps) {
  const [selectedImage, setSelectedImage] = useState(category?.imageUrl || '');
  const isEditing = !!category;
  
  const handleSubmit = async (formData: FormData) => {
    formData.append('imageUrl', selectedImage);
    
    if (isEditing) {
      return updateCategory.bind(null, category.id)(null, formData);
    } else {
      return addCategory(null, formData);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre de la Categoría</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={category?.name || ''}
          placeholder="Ej: Arequipes, Chocolates, etc."
        />
      </div>
      
      <CategoryImageSelector
        selectedImage={selectedImage}
        onImageSelect={setSelectedImage}
      />
      
      <SubmitButton isEditing={isEditing} />
    </form>
  );
}