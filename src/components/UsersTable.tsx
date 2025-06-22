// src/components/UsersTable.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import Link from 'next/link'; // Importamos Link para la navegación

// Definimos la "forma" de los datos de usuario que esperamos
interface User {
  id: number;
  email: string;
  role: string;
  createdAt: Date;
}

export default function UsersTable({ users }: { users: User[] }) {
  const router = useRouter();

  const handleDelete = async (userId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar a este usuario de forma permanente?')) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.error || 'No se pudo eliminar el usuario.');
        }
        
        alert('Usuario eliminado con éxito.');
        router.refresh();
      } catch (error) {
        console.error(error);
        alert((error as Error).message);
      }
    }
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left py-3 px-6 uppercase font-semibold text-sm">Email</th>
            <th className="text-left py-3 px-6 uppercase font-semibold text-sm">Rol</th>
            <th className="text-left py-3 px-6 uppercase font-semibold text-sm">Fecha de Creación</th>
            <th className="text-center py-3 px-6 uppercase font-semibold text-sm">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="py-4 px-6 font-medium">{user.email}</td>
              <td className="py-4 px-6">{user.role.replace('_', ' ')}</td>
              <td className="py-4 px-6">{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="py-4 px-6 text-center space-x-2">
                {/* --- BOTÓN DE EDITAR AÑADIDO --- */}
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/users/edit/${user.id}`}>Editar</Link>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}