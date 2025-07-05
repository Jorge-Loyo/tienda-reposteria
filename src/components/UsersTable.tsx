'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import Link from 'next/link';
import type { Role } from '@/app/admin/users/page'; // Importamos el tipo Role para consistencia

// Definimos la "forma" de los datos de usuario que esperamos
interface User {
  id: number;
  email: string;
  role: Role; // Usamos el tipo Role específico para mayor seguridad
  createdAt: Date;
}

// Mapeo de roles a nombres más amigables para mostrar en la tabla
const roleNames: Record<Role, string> = {
  ADMIN: 'Administrador',
  ORDERS_USER: 'Usuario de Pedidos',
  CLIENT: 'Cliente',
  CLIENT_VIP: 'Cliente VIP',
};

export default function UsersTable({ users }: { users: User[] }) {
  const router = useRouter();

  const handleDelete = async (userId: number) => {
    // NOTA: La lógica de eliminación se ha comentado.
    // El uso de 'confirm()' y 'alert()' no está permitido en este entorno.
    // Para implementar esta funcionalidad, deberías crear un componente de modal de confirmación.
    console.log(`Solicitud para eliminar usuario con ID: ${userId}`);
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
              {/* Usamos el mapeo para mostrar el nombre amigable del rol */}
              <td className="py-4 px-6">{roleNames[user.role] || user.role}</td>
              <td className="py-4 px-6">{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="py-4 px-6 text-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/users/edit/${user.id}`}>Editar</Link>
                </Button>
                {/* El botón de eliminar ahora solo registrará un mensaje en la consola */}
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