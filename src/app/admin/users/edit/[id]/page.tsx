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
import { Role } from '@prisma/client';

interface UserData {
  email: string;
  role: Role;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [user, setUser] = useState<UserData | null>(null);
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
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: user.role }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al actualizar');
      
      alert('¡Rol de usuario actualizado con éxito!');
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
                <SelectItem value="ADMIN">Administrador</SelectItem>
                <SelectItem value="ORDERS_USER">Usuario de Pedidos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </form>
      )}
    </div>
  );
}