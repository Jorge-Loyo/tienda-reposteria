import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RolesManager } from '@/components/RolesManager';
import { ArrowLeft, Shield, Users, Settings } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild className="hover:bg-white/50">
              <Link href="/admin/users" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Usuarios
              </Link>
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Roles</h1>
                <p className="text-sm text-gray-500">Administra roles y permisos del sistema</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Roles</p>
                <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuarios Asignados</p>
                <p className="text-2xl font-bold text-gray-900">{roles.reduce((acc, role) => acc + role.userCount, 0)}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Permisos Disponibles</p>
                <p className="text-2xl font-bold text-gray-900">{permissions.length}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <RolesManager roles={roles} permissions={permissions} />
        </div>
      </div>
    </div>
  );
}