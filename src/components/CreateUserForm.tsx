'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Role } from '@/app/admin/users/page'; // Importamos el tipo Role

// Mapeo de roles a nombres más amigables
const roleNames: Record<Role, string> = {
    ADMIN: 'Administrador',
    ORDERS_USER: 'Usuario de Pedidos',
    CLIENT: 'Cliente',
    CLIENT_VIP: 'Cliente VIP',
};

// El componente ahora recibe la lista de roles disponibles como prop
export default function CreateUserForm({ availableRoles }: { availableRoles: Role[] }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Establecemos 'CLIENT' como el rol por defecto
  const [role, setRole] = useState<Role>('CLIENT');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo crear el usuario.');
      }

      // Reemplazamos alert() por un mensaje en consola para un entorno más seguro
      console.log('¡Usuario creado con éxito!');
      setEmail('');
      setPassword('');
      setRole('CLIENT');
      router.refresh();

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h3 className="text-lg font-semibold mb-4">Crear Nuevo Usuario</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="new-email">Correo Electrónico</Label>
          <Input id="new-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="new-password">Contraseña</Label>
          <Input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="role">Rol</Label>
          {/* El 'onValueChange' ahora espera un tipo 'Role' */}
          <Select value={role} onValueChange={(value: Role) => setRole(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar rol" />
            </SelectTrigger>
            <SelectContent>
              {/* Generamos las opciones del menú dinámicamente */}
              {availableRoles.map((roleKey) => (
                <SelectItem key={roleKey} value={roleKey}>
                  {roleNames[roleKey]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creando...' : 'Crear Usuario'}
        </Button>
      </form>
    </div>
  );
}
