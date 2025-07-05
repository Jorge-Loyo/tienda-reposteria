import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CreateUserForm from '@/components/CreateUserForm';
import UsersTable from '@/components/UsersTable';
import UserRoleFilter from '@/components/UserRoleFilter';

const prisma = new PrismaClient();

// Definimos los roles como un tipo de unión de cadenas de texto
export type Role = 'ADMIN' | 'ORDERS_USER' | 'CLIENT' | 'CLIENT_VIP';

// Usamos el nuevo tipo para nuestro array de roles disponibles
const availableRoles: Role[] = ['ADMIN', 'ORDERS_USER', 'CLIENT', 'CLIENT_VIP'];

// La función ahora acepta nuestro tipo 'Role' personalizado
async function getUsers(role?: Role) {
  try {
    const whereClause = role ? { role } : {};

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    // Aseguramos que el 'role' que viene de la BD es del tipo que esperamos
    return users as (typeof users[number] & { role: Role })[];
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return [];
  }
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const roleFilter = 
    typeof searchParams?.role === 'string' && availableRoles.includes(searchParams.role as Role)
    ? (searchParams.role as Role)
    : undefined;

  const users = await getUsers(roleFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <Button variant="outline" asChild>
          <Link href="/admin">Volver al Dashboard</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <UserRoleFilter availableRoles={availableRoles} currentRole={roleFilter} />
          <UsersTable users={users} />
        </div>

        <div className="lg:col-span-1">
          {/* Pasamos la lista de roles disponibles al formulario */}
          <CreateUserForm availableRoles={availableRoles} />
        </div>
      </div>
    </div>
  );
}
