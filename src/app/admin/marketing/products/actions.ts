'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { sanitizeText } from '@/lib/sanitizer';
import { getSessionData } from '@/lib/session';

export async function updateMarketingProduct(id: number, formData: FormData) {
  // Verificar permisos
  const session = await getSessionData();
  if (!session || !['MARKETING', 'ADMINISTRADOR', 'MASTER'].includes(session.role)) {
    throw new Error('No autorizado');
  }

  const name = sanitizeText(formData.get('name') as string);
  const imageUrl = formData.get('imageUrl') as string;
  const description = formData.get('description') as string;
  const categoryId = parseInt(formData.get('categoryId') as string);

  // Validaciones
  if (!name || name.length < 2) {
    throw new Error('Nombre del producto inválido');
  }

  if (isNaN(categoryId) || categoryId <= 0) {
    throw new Error('Categoría inválida');
  }

  await prisma.product.update({
    where: { id },
    data: {
      name,
      imageUrl: imageUrl ? sanitizeText(imageUrl) : null,
      description: description ? sanitizeText(description) : null,
      categoryId,
    },
  });

  revalidatePath('/admin/marketing/products');
  redirect('/admin/marketing/products');
}