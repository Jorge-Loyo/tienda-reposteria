'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from './ui/button';
import type { Role } from '@/app/admin/users/page'; // Importamos el tipo desde la página

interface UserRoleFilterProps {
  availableRoles: Role[];
  currentRole?: Role;
}

const roleNames: Record<Role, string> = {
  ADMIN: 'Administradores',
  ORDERS_USER: 'Usuarios de Pedidos',
  CLIENT: 'Clientes',
  CLIENT_VIP: 'Clientes VIP',
};

export default function UserRoleFilter({ availableRoles, currentRole }: UserRoleFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilter = (role?: Role) => {
    const params = new URLSearchParams(searchParams);
    if (role) {
      params.set('role', role);
    } else {
      params.delete('role');
    }
    router.push(`/admin/users?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-white rounded-lg shadow-sm">
      <p className="text-sm font-medium mr-2">Filtrar por rol:</p>
      <Button
        onClick={() => handleFilter()}
        variant={!currentRole ? 'default' : 'outline'}
        size="sm"
      >
        Todos
      </Button>
      {availableRoles.map((role) => (
        <Button
          key={role}
          onClick={() => handleFilter(role)}
          variant={currentRole === role ? 'default' : 'outline'}
          size="sm"
        >
          {roleNames[role]}
        </Button>
      ))}
    </div>
  );
}