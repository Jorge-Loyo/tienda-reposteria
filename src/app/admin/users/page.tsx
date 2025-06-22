// src/app/admin/users/page.tsx
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CreateUserForm from '@/components/CreateUserForm';
import UsersTable from '@/components/UsersTable';

const prisma = new PrismaClient();

async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      // Seleccionamos los campos a mostrar, excluyendo la contraseña por seguridad
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
    return users;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return [];
  }
}

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <Button variant="outline" asChild>
          <Link href="/admin">Volver al Dashboard</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Lista de Usuarios */}
        <div className="lg:col-span-2">
          <UsersTable users={users} />
        </div>

        {/* Columna Derecha: Formulario para Crear Usuario */}
        <div className="lg:col-span-1">
          <CreateUserForm />
        </div>
      </div>
    </div>
  );
}