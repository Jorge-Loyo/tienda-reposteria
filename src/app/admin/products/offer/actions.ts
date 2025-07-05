'use server';

import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export interface OfferFormState {
  error?: string | null;
}

// 1. Añadimos 'productId' al esquema para validarlo
const offerSchema = z.object({
  productId: z.coerce.number(),
  offerPriceUSD: z.coerce.number().min(0.01, "El precio de oferta debe ser mayor que cero.").optional().or(z.literal('')),
  offerEndsAt: z.coerce.date().optional().or(z.literal('')),
  isOfferActive: z.coerce.boolean(),
});

// 2. Simplificamos la firma de la función. Ya no necesita recibir 'productId' como argumento.
export async function updateOffer(
    prevState: OfferFormState, 
    formData: FormData
): Promise<OfferFormState> {
  const result = offerSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!result.success) {
    return { error: "Datos inválidos. Revisa los campos." };
  }

  // 3. Obtenemos todos los datos validados, incluyendo el productId
  const { productId, isOfferActive, offerPriceUSD, offerEndsAt } = result.data;

  if (isOfferActive && (!offerPriceUSD || !offerEndsAt)) {
    return { error: "Si la oferta está activa, el precio y la fecha de finalización son obligatorios." };
  }

  try {
    await prisma.product.update({
      where: { id: productId }, // Usamos el ID del formulario
      data: {
        isOfferActive,
        offerPriceUSD: offerPriceUSD || null,
        offerEndsAt: offerEndsAt || null,
      },
    });
  } catch (error) {
    console.error("Error al actualizar la oferta:", error);
    return { error: "No se pudo actualizar la oferta en la base de datos." };
  }

  revalidatePath('/admin/products');
  redirect('/admin/products');
}