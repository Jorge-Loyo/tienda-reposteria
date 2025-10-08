'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export async function createInstagramPost(formData: FormData) {
  const url = formData.get('url') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const caption = formData.get('caption') as string;
  const order = parseInt(formData.get('order') as string) || 0;

  await prisma.instagramPost.create({
    data: {
      url,
      imageUrl,
      caption,
      order,
      isActive: true,
    },
  });

  revalidatePath('/admin/instagram');
  redirect('/admin/instagram');
}

export async function updateInstagramPost(id: number, formData: FormData) {
  const url = formData.get('url') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const caption = formData.get('caption') as string;
  const order = parseInt(formData.get('order') as string) || 0;

  await prisma.instagramPost.update({
    where: { id },
    data: {
      url,
      imageUrl,
      caption,
      order,
    },
  });

  revalidatePath('/admin/instagram');
  redirect('/admin/instagram');
}

export async function deleteInstagramPost(id: number) {
  await prisma.instagramPost.delete({
    where: { id },
  });

  revalidatePath('/admin/instagram');
}

export async function toggleInstagramPostStatus(id: number) {
  const post = await prisma.instagramPost.findUnique({
    where: { id },
  });

  if (post) {
    await prisma.instagramPost.update({
      where: { id },
      data: {
        isActive: !post.isActive,
      },
    });
  }

  revalidatePath('/admin/instagram');
}