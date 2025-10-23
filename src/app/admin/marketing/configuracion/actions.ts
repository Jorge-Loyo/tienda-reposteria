'use server';

import db from '@/db/db';
import { revalidatePath } from 'next/cache';

export async function updateSiteConfig(key: string, value: string) {
  try {
    await db.siteConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });

    revalidatePath('/admin/marketing/configuracion');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating site config:', error);
    return { error: 'Error al actualizar la configuración' };
  }
}