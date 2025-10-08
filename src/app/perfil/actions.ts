'use server';

import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { getSessionData } from '@/lib/session';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

// --- Tipos de Estado para los Formularios ---
export interface UpdateProfileState {
  success: boolean;
  message: string | null;
  errors?: {
    name?: string[];
    instagram?: string[];
    phoneNumber?: string[];
    address?: string[];
    identityCard?: string[];
    avatarUrl?: string[];
  } | null;
}

export interface ChangePasswordState {
  success: boolean;
  message: string | null;
  errors?: {
    currentPassword?: string[];
    newPassword?: string[];
    confirmPassword?: string[];
  } | null;
}

// --- Esquemas de Validación (Actualizado) ---
const profileSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  instagram: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  identityCard: z.string().optional(),
  avatarUrl: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "La contraseña actual es requerida."),
  newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres."),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Las nuevas contraseñas no coinciden.",
  path: ["confirmPassword"],
});


// --- Acción para Actualizar el Perfil (Actualizada) ---
export async function updateProfile(
  prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
    try {
        const session = await getSessionData();
        if (!session?.userId) {
            return { success: false, message: "No estás autenticado.", errors: null };
        }

        const validatedFields = profileSchema.safeParse(Object.fromEntries(formData.entries()));

        if (!validatedFields.success) {
            return {
                success: false,
                message: "Datos inválidos.",
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }
        
        const { name, instagram, phoneNumber, address, identityCard, avatarUrl } = validatedFields.data;

        await prisma.user.update({
            where: { id: session.userId },
            data: { 
                name,
                instagram,
                phoneNumber,
                address,
                identityCard,
                avatarUrl: avatarUrl || null,
            },
        });

        revalidatePath('/perfil');
        return { success: true, message: "¡Perfil actualizado con éxito!", errors: null };

    } catch (error) {
        console.error("Error al actualizar el perfil:", error);
        return { success: false, message: "Ocurrió un error en el servidor.", errors: null };
    }
}


// --- Acción para Cambiar la Contraseña (Sin cambios) ---
export async function changePassword(
  prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  // ... (código sin cambios)
  try {
    const session = await getSessionData();
    if (!session?.userId) {
      return { success: false, message: "No estás autenticado.", errors: null };
    }

    const validatedFields = passwordSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Datos inválidos.",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { currentPassword, newPassword } = validatedFields.data;

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user || !user.password) {
      return { success: false, message: "Usuario no encontrado.", errors: null };
    }

    const passwordsMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordsMatch) {
      return { success: false, message: "La contraseña actual es incorrecta.", errors: null };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

    revalidatePath('/perfil');
    return { success: true, message: "¡Contraseña actualizada con éxito!", errors: null };

  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    return { success: false, message: "Ocurrió un error en el servidor.", errors: null };
  }
}