'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function createRole(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  await prisma.role.create({
    data: {
      name: name.toUpperCase(),
      description
    }
  });

  revalidatePath('/admin/users/roles');
}

export async function updateRole(roleId: number, formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  await prisma.role.update({
    where: { id: roleId },
    data: {
      name: name.toUpperCase(),
      description
    }
  });

  revalidatePath('/admin/users/roles');
}

export async function deleteRole(roleId: number) {
  await prisma.role.delete({
    where: { id: roleId }
  });

  revalidatePath('/admin/users/roles');
}

export async function updateRolePermissions(roleId: number, permissionIds: number[]) {
  try {
    // Eliminar permisos existentes del rol
    await prisma.rolePermission.deleteMany({
      where: { roleId }
    });

    // Agregar nuevos permisos al rol
    if (permissionIds.length > 0) {
      await prisma.rolePermission.createMany({
        data: permissionIds.map(permissionId => ({
          roleId,
          permissionId
        }))
      });
    }

    revalidatePath('/admin/users/roles');
    return { success: true };
  } catch (error) {
    console.error('Error updating role permissions:', error);
    throw error;
  }
}