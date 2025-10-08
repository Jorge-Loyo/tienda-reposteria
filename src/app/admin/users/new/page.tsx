import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/PageHeader';
import { FullUserForm } from '@/components/FullUserForm';
import type { Role } from '@/app/admin/users/page';

const prisma = new PrismaClient();

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

export default async function NewUserPage() {
  const availableRoles = await getAvailableRoles();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Button variant="outline" asChild>
            <Link href="/admin/users">
              ← Volver a Usuarios
            </Link>
          </Button>
        </div>

        <PageHeader 
          title="Crear Nuevo Usuario"
          description="Completa todos los campos para crear un usuario completo"
        />

        <div className="glass rounded-2xl shadow-xl p-8">
          <FullUserForm availableRoles={availableRoles} />
        </div>
      </div>
    </div>
  );
}