'use server';

import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

// 1. Definimos un tipo para el estado del formulario
export interface ZoneFormState {
  success?: string | null;
  error?: string | null;
}

// 2. Añadimos 'zoneId' al esquema de validación
const zoneSchema = z.object({
  zoneId: z.coerce.number(),
  cost: z.coerce.number().min(0, "El costo no puede ser negativo."),
  freeShippingThreshold: z.coerce.number().min(0, "El umbral no puede ser negativo.").optional().or(z.literal('')),
});

// 3. Modificamos la firma de la acción para que sea compatible con useFormState
export async function updateShippingZone(
    prevState: ZoneFormState, 
    formData: FormData
): Promise<ZoneFormState> {
  const result = zoneSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!result.success) {
    console.error(result.error.flatten().fieldErrors);
    return { error: "Datos inválidos." };
  }
  
  // 4. Obtenemos el zoneId desde los datos del formulario
  const { zoneId, cost, freeShippingThreshold } = result.data;

  try {
    await prisma.shippingZone.update({
      where: { id: zoneId }, // Usamos el ID del formulario
      data: {
        cost,
        freeShippingThreshold: freeShippingThreshold || null,
      },
    });

    revalidatePath('/admin/zones');
    return { success: "¡Zona actualizada con éxito!" };

  } catch (error) {
    console.error("Error al actualizar la zona:", error);
    return { error: "No se pudo actualizar la zona." };
  }
}
