import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CreateUserForm from '@/components/CreateUserForm';
import UsersTable from '@/components/UsersTable';
import UserRoleFilter from '@/components/UserRoleFilter';

const prisma = new PrismaClient();

// Definimos los roles como un tipo de unión de cadenas de texto
export type Role = 'MASTER' | 'ADMINISTRADOR' | 'CLIENTE' | 'CLIENTE_VIP' | 'MARKETING' | 'OPERARIO';

// Mapeo de roles para mostrar nombres amigables
const roleDisplayNames: Record<Role, string> = {
  MASTER: 'Master',
  ADMINISTRADOR: 'Administrador',
  CLIENTE: 'Cliente',
  CLIENTE_VIP: 'Cliente VIP',
  MARKETING: 'Marketing',
  OPERARIO: 'Operario'
};

// La función ahora acepta nuestro tipo 'Role' personalizado
async function getUsers(role?: Role) {
  try {
    const whereClause = role ? { role } : {};

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
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

async function getAvailableRoles() {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { name: 'asc' }
    });
    return roles.map(role => role.name as Role);
  } catch (error) {
    console.error("Error al obtener roles:", error);
    return ['MASTER', 'ADMINISTRADOR', 'CLIENTE', 'CLIENTE_VIP', 'MARKETING', 'OPERARIO'] as Role[];
  }
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const availableRoles = await getAvailableRoles();
  
  const roleFilter = 
    typeof searchParams?.role === 'string' && availableRoles.includes(searchParams.role as Role)
    ? (searchParams.role as Role)
    : undefined;

  const users = await getUsers(roleFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Gestión de Usuarios</h1>
            <p className="text-gray-600">Administra los usuarios del sistema</p>
          </div>
          <Button variant="modern" asChild>
            <Link href="/admin">Volver al Dashboard</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="glass p-6 rounded-2xl shadow-xl">
              <h3 className="text-lg font-bold gradient-text mb-4">Filtrar por Rol</h3>
              <div className="space-y-2">
                <a 
                  href="/admin/users" 
                  className={`block px-4 py-3 rounded-xl transition-all duration-200 ${
                    !roleFilter 
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-white/50'
                  }`}
                >
                  Todos los usuarios
                </a>
                {availableRoles.map((role) => (
                  <a 
                    key={role}
                    href={`/admin/users?role=${role}`}
                    className={`block px-4 py-3 rounded-xl transition-all duration-200 ${
                      roleFilter === role 
                        ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg' 
                        : 'text-gray-700 hover:bg-white/50'
                    }`}
                  >
                    {roleDisplayNames[role] || role}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="glass rounded-2xl shadow-xl overflow-hidden">
              <UsersTable users={users} />
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-2xl shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold gradient-text">Acciones</h2>
                <Button variant="outline" asChild>
                  <Link href="/admin/users/new">
                    + Nuevo Usuario
                  </Link>
                </Button>
              </div>
              <p className="text-gray-600 text-sm">
                Crea un nuevo usuario con todos los campos necesarios.
              </p>
            </div>
            
            <div className="glass p-6 rounded-2xl shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold gradient-text">Gestión de Permisos</h2>
                <Button variant="outline" asChild>
                  <Link href="/admin/users/permissions">
                    Configurar Permisos
                  </Link>
                </Button>
              </div>
              <p className="text-gray-600 text-sm">
                Configura permisos granulares para usuarios y roles específicos.
              </p>
            </div>
            
            <div className="glass p-6 rounded-2xl shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold gradient-text">Gestión de Roles</h2>
                <Button variant="outline" asChild>
                  <Link href="/admin/users/roles">
                    Administrar Roles
                  </Link>
                </Button>
              </div>
              <p className="text-gray-600 text-sm">
                Crea, edita y elimina roles del sistema.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
