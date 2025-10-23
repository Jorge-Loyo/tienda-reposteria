'use server';

import db from '@/db/db';
import { revalidatePath } from 'next/cache';

export async function createGalleryImage(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const alt = formData.get('alt') as string;
    const order = parseInt(formData.get('order') as string) || 0;

    await db.galleryImage.create({
      data: {
        title,
        description,
        imageUrl,
        alt,
        order,
        isActive: true
      }
    });

    revalidatePath('/admin/marketing/galeria');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error creating gallery image:', error);
    return { error: 'Error al crear la imagen' };
  }
}

export async function updateGalleryImage(id: number, formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const alt = formData.get('alt') as string;
    const order = parseInt(formData.get('order') as string) || 0;

    await db.galleryImage.update({
      where: { id },
      data: {
        title,
        description,
        imageUrl,
        alt,
        order
      }
    });

    revalidatePath('/admin/marketing/galeria');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating gallery image:', error);
    return { error: 'Error al actualizar la imagen' };
  }
}

export async function toggleGalleryImageStatus(id: number) {
  try {
    const image = await db.galleryImage.findUnique({
      where: { id }
    });

    if (!image) {
      return { error: 'Imagen no encontrada' };
    }

    await db.galleryImage.update({
      where: { id },
      data: {
        isActive: !image.isActive
      }
    });

    revalidatePath('/admin/marketing/galeria');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error toggling gallery image status:', error);
    return { error: 'Error al cambiar el estado' };
  }
}

export async function deleteGalleryImage(id: number) {
  try {
    await db.galleryImage.delete({
      where: { id }
    });

    revalidatePath('/admin/marketing/galeria');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return { error: 'Error al eliminar la imagen' };
  }
}