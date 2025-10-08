'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createFullUser } from '@/app/admin/users/new/actions';
import type { Role } from '@/app/admin/users/page';

interface FullUserFormProps {
  availableRoles: Role[];
}

const roleDisplayNames: Record<Role, string> = {
  MASTER: 'Master',
  ADMINISTRADOR: 'Administrador',
  CLIENTE: 'Cliente',
  CLIENTE_VIP: 'Cliente VIP',
  MARKETING: 'Marketing',
  OPERARIO: 'Operario'
};

export function FullUserForm({ availableRoles }: FullUserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await createFullUser(formData);
    } catch (error) {
      console.error('Error creando usuario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Nombre Completo</Label>
          <Input
            id="name"
            name="name"
            placeholder="Ej: Juan Pérez"
            required
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="usuario@ejemplo.com"
            required
            className="mt-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            required
            minLength={6}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="role">Rol</Label>
          <select
            id="role"
            name="role"
            required
            className="mt-2 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          >
            <option value="">Seleccionar rol</option>
            {availableRoles.map((role) => (
              <option key={role} value={role}>
                {roleDisplayNames[role] || role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="phoneNumber">Teléfono</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            placeholder="0412-1234567"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="identityCard">Cédula de Identidad</Label>
          <Input
            id="identityCard"
            name="identityCard"
            placeholder="V-12345678"
            className="mt-2"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="instagram">Instagram</Label>
        <Input
          id="instagram"
          name="instagram"
          placeholder="@usuario"
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="address">Dirección</Label>
        <Textarea
          id="address"
          name="address"
          placeholder="Av. Principal, Edificio X, Piso Y, Apto Z. Ciudad."
          className="mt-2"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="avatarUrl">Imagen de Perfil (URL)</Label>
        <Input
          id="avatarUrl"
          name="avatarUrl"
          type="url"
          placeholder="https://..."
          className="mt-2"
        />
        <p className="text-sm text-gray-500 mt-1">URL de la imagen de perfil (opcional)</p>
      </div>

      <div className="flex gap-4 pt-6">
        <Button 
          type="submit" 
          variant="gradient" 
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Creando Usuario...' : 'Crear Usuario'}
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