'use server';

import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

// Esquema de validación para el nombre de la categoría
const categorySchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
});

// Acción para agregar una nueva categoría
export async function addCategory(formData: FormData) {
  const result = categorySchema.safeParse({
    name: formData.get('name'),
  });

  if (!result.success) {
    // Si la validación falla, podrías devolver los errores.
    // Por simplicidad, aquí solo lo mostraremos en la consola.
    console.error(result.error.flatten().fieldErrors);
    return;
  }

  const { name } = result.data;

  // Verificamos si la categoría ya existe para evitar duplicados
  const existingCategory = await prisma.category.findUnique({
    where: { name },
  });

  if (existingCategory) {
    // Aquí también podrías devolver un mensaje de error al formulario.
    console.error("Una categoría con este nombre ya existe.");
    return;
  }

  // Creamos la nueva categoría en la base de datos
  await prisma.category.create({
    data: { name },
  });

  // Revalidamos la ruta del dashboard de categorías para que la lista se actualice
  revalidatePath('/admin/categories'); 
  // Redirigimos al usuario de vuelta a la página principal de categorías
  redirect('/admin/categories');
}