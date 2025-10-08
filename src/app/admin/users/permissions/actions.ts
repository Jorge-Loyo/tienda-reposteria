'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function updateUserPermissions(userId: number, permissionIds: number[]) {
  try {
    // Eliminar permisos existentes
    await prisma.userPermission.deleteMany({
      where: { userId }
    });

    // Agregar nuevos permisos
    if (permissionIds.length > 0) {
      await prisma.userPermission.createMany({
        data: permissionIds.map(permissionId => ({
          userId,
          permissionId
        }))
      });
    }

    revalidatePath('/admin/users/permissions');
    return { success: true };
  } catch (error) {
    console.error('Error actualizando permisos:', error);
    throw new Error('Error actualizando permisos');
  }
}