'use client';

import { useState } from 'react'; // 1. Importamos useState
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import Link from 'next/link';
import type { Role } from '@/app/admin/users/page';
import DeleteConfirmationModal from './DeleteConfirmationModal'; // 2. Importamos el nuevo modal

interface User {
  id: number;
  email: string;
  role: Role;
  createdAt: Date;
}

const roleNames: Record<Role, string> = {
  ADMIN: 'Administrador',
  ORDERS_USER: 'Usuario de Pedidos',
  CLIENT: 'Cliente',
  CLIENT_VIP: 'Cliente VIP',
};

export default function UsersTable({ users }: { users: User[] }) {
  const router = useRouter();
  // 3. Estados para controlar el modal y el proceso de eliminación
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 4. Esta función abre el modal de confirmación
  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
  };

  // 5. Esta función se ejecuta al confirmar la eliminación
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/users/${userToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'No se pudo eliminar el usuario.');
      }
      
      // Cerramos el modal y refrescamos la lista de usuarios
      setUserToDelete(null);
      router.refresh();

    } catch (error) {
      console.error(error);
      // Aquí podrías mostrar una notificación de error
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
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
                <td className="py-4 px-6">{roleNames[user.role] || user.role}</td>
                <td className="py-4 px-6">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="py-4 px-6 text-center space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/users/edit/${user.id}`}>Editar</Link>
                  </Button>
                  {/* 6. El botón ahora abre el modal en lugar de llamar a la API directamente */}
                  <Button variant="destructive" size="sm" onClick={() => openDeleteModal(user)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 7. El modal se muestra solo si hay un usuario seleccionado para eliminar */}
      {userToDelete && (
        <DeleteConfirmationModal
          userName={userToDelete.email}
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setUserToDelete(null)}
        />
      )}
    </>
  );
}