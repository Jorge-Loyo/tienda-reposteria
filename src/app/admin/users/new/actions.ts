'use server';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export async function createFullUser(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const identityCard = formData.get('identityCard') as string;
    const instagram = formData.get('instagram') as string;
    const address = formData.get('address') as string;
    const avatarUrl = formData.get('avatarUrl') as string;

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('Ya existe un usuario con este correo electrónico');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        phoneNumber: phoneNumber || null,
        identityCard: identityCard || null,
        instagram: instagram || null,
        address: address || null,
        avatarUrl: avatarUrl || null,
        isActive: true
      }
    });

    revalidatePath('/admin/users');
    redirect('/admin/users');
  } catch (error) {
    console.error('Error creando usuario:', error);
    throw new Error('Error creando usuario');
  }
}