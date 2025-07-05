'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addCategory } from '@/app/admin/categories/actions'; // Importamos la acción del servidor

// Componente para el botón de envío que muestra un estado de carga
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Guardando..." : "Guardar Categoría"}
    </Button>
  );
}

export function CategoryForm() {
  return (
    // El 'action' del formulario ahora llama directamente a nuestra server action
    <form action={addCategory} className="space-y-6 max-w-lg mx-auto">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre de la Categoría</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          placeholder="Ej: Arequipes, Chocolates, etc."
        />
      </div>
      <SubmitButton />
    </form>
  );
}