// src/app/admin/users/edit/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
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
import type { Role } from '@/app/admin/users/page';

const roleNames: Record<Role, string> = {
    ADMIN: 'Administrador',
    ORDERS_USER: 'Usuario de Pedidos',
    CLIENT: 'Cliente',
    CLIENT_VIP: 'Cliente VIP',
};

interface UserData {
  email: string;
  role: Role;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [user, setUser] = useState<UserData | null>(null);
  // 1. Nuevo estado para guardar la contraseña
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`/api/users/${id}`);
          if (!response.ok) throw new Error('No se pudo obtener el usuario');
          const data = await response.json();
          setUser(data);
        } catch {
          setError('Error al cargar los datos del usuario.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchUser();
    }
  }, [id]);

  const handleRoleChange = (newRole: Role) => {
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);
    setError('');

    try {
      // 2. Preparamos el cuerpo de la petición con el rol y, opcionalmente, la contraseña
      const body: { role: Role; password?: string } = { role: user.role };
      if (password.length > 0) {
        body.password = password;
      }

      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al actualizar');
      
      alert('¡Usuario actualizado con éxito!');
      router.push('/admin/users');
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <p className="text-center mt-10">Cargando...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
       <Button variant="outline" size="sm" asChild className="mb-8">
         <Link href="/admin/users">‹ Volver a gestión de usuarios</Link>
       </Button>
      <h1 className="text-3xl font-bold mb-6">Editar Usuario</h1>
      {user && (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md border space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Correo Electrónico (no se puede editar)</Label>
            <Input id="email" type="email" value={user.email} readOnly disabled />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role">Rol</Label>
            <Select value={user.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(roleNames).map((roleKey) => (
                    <SelectItem key={roleKey} value={roleKey}>
                        {roleNames[roleKey as Role]}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* 3. Nuevo campo para la contraseña */}
          <div className="space-y-1.5">
            <Label htmlFor="password">Nueva Contraseña</Label>
            <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Dejar vacío para no cambiar"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </form>
      )}
    </div>
  );
}