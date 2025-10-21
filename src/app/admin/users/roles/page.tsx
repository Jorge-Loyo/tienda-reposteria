import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RolesManager } from '@/components/RolesManager';

const prisma = new PrismaClient();

async function getRolesData() {
  // Roles nuevos que queremos gestionar
  const validRoles = ['MASTER', 'ADMINISTRADOR', 'CLIENTE', 'CLIENTE_VIP', 'MARKETING', 'OPERARIO'];
  
  const [roles, userCounts, permissions] = await Promise.all([
    prisma.role.findMany({
      where: {
        name: {
          in: validRoles
        }
      },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      },
      orderBy: { name: 'asc' }
    }),
    prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true
      },
      where: {
        role: {
          in: validRoles
        }
      }
    }),
    prisma.permission.findMany({
      orderBy: { name: 'asc' }
    })
  ]);

  // Asegurar que todos los roles nuevos existan en la BD
  const existingRoleNames = roles.map(r => r.name);
  const missingRoles = validRoles.filter(role => !existingRoleNames.includes(role));
  
  // Crear roles faltantes
  for (const roleName of missingRoles) {
    await prisma.role.create({
      data: {
        name: roleName,
        description: getRoleDescription(roleName)
      }
    });
  }
  
  // Obtener roles actualizados si se crearon nuevos
  const finalRoles = missingRoles.length > 0 
    ? await prisma.role.findMany({
        where: { name: { in: validRoles } },
        orderBy: { name: 'asc' }
      })
    : roles;

  const rolesWithCounts = finalRoles.map(role => ({
    ...role,
    userCount: userCounts.find(uc => uc.role === role.name)?._count.role || 0
  }));

  return { roles: rolesWithCounts, permissions };
}

function getRoleDescription(roleName: string): string {
  const descriptions: Record<string, string> = {
    'MASTER': 'Desarrollador con acceso completo al sistema',
    'ADMINISTRADOR': 'Administrador con permisos completos de gestión',
    'CLIENTE': 'Cliente regular del sistema',
    'CLIENTE_VIP': 'Cliente VIP con beneficios especiales',
    'MARKETING': 'Equipo de marketing con permisos limitados',
    'OPERARIO': 'Personal operativo con acceso básico'
  };
  return descriptions[roleName] || 'Rol del sistema';
}

export default async function RolesPage() {
  const { roles, permissions } = await getRolesData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Button variant="outline" asChild>
            <Link href="/admin/users">
              ← Volver a Usuarios
            </Link>
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">Gestión de Roles</h1>
          <p className="text-gray-600">Crea, edita y elimina roles del sistema</p>
        </div>

        <div className="glass rounded-2xl shadow-xl p-8">
          <RolesManager roles={roles} permissions={permissions} />
        </div>
      </div>
    </div>
  );
}