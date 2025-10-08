import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PermissionsManager } from '@/components/PermissionsManager';

const prisma = new PrismaClient();

async function getPermissionsData() {
  const [users, permissions] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        permissions: {
          include: {
            permission: true
          }
        }
      },
      orderBy: { name: 'asc' }
    }),
    prisma.permission.findMany({
      orderBy: { name: 'asc' }
    })
  ]);

  return { users, permissions };
}

export default async function PermissionsPage() {
  const { users, permissions } = await getPermissionsData();

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
          <h1 className="text-4xl font-bold gradient-text mb-4">Gestión de Permisos</h1>
          <p className="text-gray-600">Configura permisos específicos para cada usuario</p>
        </div>

        <div className="glass rounded-2xl shadow-xl p-8">
          <PermissionsManager users={users} permissions={permissions} />
        </div>
      </div>
    </div>
  );
}