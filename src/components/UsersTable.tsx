'use client';

import { useState } from 'react'; // 1. Importamos useState
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import Link from 'next/link';
import type { Role } from '@/app/admin/users/page';
import DeleteConfirmationModal from './DeleteConfirmationModal'; // 2. Importamos el nuevo modal

interface User {
  id: number;
  name: string | null;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
}

const roleNames: Record<Role, string> = {
  MASTER: 'Master',
  ADMINISTRADOR: 'Administrador',
  CLIENTE: 'Cliente',
  CLIENTE_VIP: 'Cliente VIP',
  MARKETING: 'Marketing',
  OPERARIO: 'Operario',
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

  // 5. Esta función se ejecuta al confirmar el cambio de estado
  const handleToggleStatus = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/users/${userToDelete.id}/toggle-status`, {
        method: 'PATCH',
      });
      
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'No se pudo cambiar el estado del usuario.');
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
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-pink-500/10 to-orange-500/10">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-800">Usuario</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-800">Rol</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-800">Estado</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-800">Fecha</th>
              <th className="text-center py-4 px-6 font-semibold text-gray-800">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className={`border-b border-white/20 hover:bg-white/30 transition-colors ${!user.isActive ? 'opacity-60' : ''}`}>
                <td className="py-6 px-6">
                  <div>
                    <div className="font-semibold text-gray-800">{user.name || 'Sin nombre'}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </div>
                </td>
                <td className="py-6 px-6">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    {roleNames[user.role] || user.role}
                  </span>
                </td>
                <td className="py-6 px-6">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    user.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="py-6 px-6 text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="py-6 px-6 text-center space-x-2">
                  <Button variant="outline-modern" size="sm" asChild>
                    <Link href={`/admin/users/edit/${user.id}`}>Editar</Link>
                  </Button>
                  <Button 
                    variant={user.isActive ? "destructive" : "outline"} 
                    size="sm" 
                    onClick={() => openDeleteModal(user)}
                  >
                    {user.isActive ? 'Deshabilitar' : 'Habilitar'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 7. El modal se muestra solo si hay un usuario seleccionado */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-center">
            <h2 className="text-xl font-bold mb-2">
              {userToDelete.isActive ? '¿Deshabilitar usuario?' : '¿Habilitar usuario?'}
            </h2>
            <p className="text-gray-600 mb-6">
              {userToDelete.isActive 
                ? `El usuario ${userToDelete.name || userToDelete.email} será deshabilitado pero mantendrá su historial.`
                : `El usuario ${userToDelete.name || userToDelete.email} será habilitado nuevamente.`
              }
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setUserToDelete(null)} disabled={isDeleting}>
                Cancelar
              </Button>
              <Button 
                variant={userToDelete.isActive ? "destructive" : "gradient"} 
                onClick={handleToggleStatus} 
                disabled={isDeleting}
              >
                {isDeleting ? 'Procesando...' : (userToDelete.isActive ? 'Deshabilitar' : 'Habilitar')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}