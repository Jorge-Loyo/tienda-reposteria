'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function createRole(formData: FormData) {
  try {
    const name = (formData.get('name') as string).toUpperCase();
    const description = formData.get('description') as string;
    
    // Validar que el rol esté en la lista de roles permitidos
    const validRoles = ['MASTER', 'ADMINISTRADOR', 'CLIENTE', 'CLIENTE_VIP', 'MARKETING', 'OPERARIO'];
    if (!validRoles.includes(name)) {
      throw new Error(`Rol no válido. Roles permitidos: ${validRoles.join(', ')}`);
    }

    await prisma.role.create({
      data: {
        name,
        description: description || null
      }
    });

    revalidatePath('/admin/users/roles');
    return { success: true };
  } catch (error) {
    console.error('Error creando rol:', error);
    throw new Error('Error creando rol');
  }
}

export async function updateRole(id: number, formData: FormData) {
  try {
    const name = (formData.get('name') as string).toUpperCase();
    const description = formData.get('description') as string;
    
    // Validar que el rol esté en la lista de roles permitidos
    const validRoles = ['MASTER', 'ADMINISTRADOR', 'CLIENTE', 'CLIENTE_VIP', 'MARKETING', 'OPERARIO'];
    if (!validRoles.includes(name)) {
      throw new Error(`Rol no válido. Roles permitidos: ${validRoles.join(', ')}`);
    }

    await prisma.role.update({
      where: { id },
      data: {
        name,
        description: description || null
      }
    });

    revalidatePath('/admin/users/roles');
    return { success: true };
  } catch (error) {
    console.error('Error actualizando rol:', error);
    throw new Error('Error actualizando rol');
  }
}

export async function deleteRole(id: number) {
  try {
    // Verificar que no hay usuarios con este rol
    const role = await prisma.role.findUnique({
      where: { id }
    });

    if (!role) {
      throw new Error('Rol no encontrado');
    }

    const userCount = await prisma.user.count({
      where: { role: role.name }
    });

    if (userCount > 0) {
      throw new Error('No se puede eliminar un rol que tiene usuarios asignados');
    }

    await prisma.role.delete({
      where: { id }
    });

    revalidatePath('/admin/users/roles');
    return { success: true };
  } catch (error) {
    console.error('Error eliminando rol:', error);
    throw new Error('Error eliminando rol');
  }
}