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

export interface CreateZoneFormState {
  success?: string | null;
  error?: string | null;
}

export interface DeleteZoneFormState {
  success?: string | null;
  error?: string | null;
}

export interface ToggleZoneFormState {
  success?: string | null;
  error?: string | null;
}

// 2. Esquemas de validación
const zoneSchema = z.object({
  zoneId: z.coerce.number().positive("ID de zona inválido"),
  cost: z.coerce.number().min(0, "El costo no puede ser negativo").max(999.99, "El costo no puede exceder $999.99"),
  freeShippingThreshold: z.preprocess(
    (val) => val === '' || val === null || val === undefined ? null : Number(val),
    z.number().min(0.01, "El umbral debe ser mayor a $0.01").max(9999.99, "El umbral no puede exceder $9999.99").nullable()
  ),
});

const createZoneSchema = z.object({
  identifier: z.string().min(1, "El identificador es requerido").max(50, "Máximo 50 caracteres"),
  name: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
  cost: z.coerce.number().min(0, "El costo no puede ser negativo").max(999.99, "El costo no puede exceder $999.99"),
  freeShippingThreshold: z.preprocess(
    (val) => val === '' || val === null || val === undefined ? null : Number(val),
    z.number().min(0.01, "El umbral debe ser mayor a $0.01").max(9999.99, "El umbral no puede exceder $9999.99").nullable()
  ),
  postalCodes: z.string().optional(),
});

const deleteZoneSchema = z.object({
  zoneId: z.coerce.number().positive("ID de zona inválido"),
});

const toggleZoneSchema = z.object({
  zoneId: z.coerce.number().positive("ID de zona inválido"),
  isActive: z.coerce.boolean(),
});

// Helper function to create audit log
async function createAuditLog(
  zoneId: number,
  action: string,
  oldValues?: any,
  newValues?: any,
  userId?: string
) {
  try {
    await prisma.zoneAuditLog.create({
      data: {
        zoneId,
        action,
        oldValues: oldValues ? JSON.stringify(oldValues) : null,
        newValues: newValues ? JSON.stringify(newValues) : null,
        userId,
      },
    });
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
}

// 3. Modificamos la firma de la acción para que sea compatible con useFormState
export async function updateShippingZone(
    prevState: ZoneFormState, 
    formData: FormData
): Promise<ZoneFormState> {
  try {
    const result = zoneSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const firstError = Object.values(errors)[0]?.[0] || "Datos inválidos";
      console.error("Validation errors:", errors);
      return { error: firstError };
    }
    
    const { zoneId, cost, freeShippingThreshold } = result.data;

    // Validación adicional: si hay umbral de envío gratis, debe ser mayor al costo
    if (freeShippingThreshold && freeShippingThreshold <= cost) {
      return { error: "El umbral de envío gratis debe ser mayor al costo de envío" };
    }

    // Verificar que la zona existe
    const existingZone = await prisma.shippingZone.findUnique({
      where: { id: zoneId }
    });

    if (!existingZone) {
      return { error: "La zona de envío no existe" };
    }

    const updatedZone = await prisma.shippingZone.update({
      where: { id: zoneId },
      data: {
        cost,
        freeShippingThreshold,
        updatedAt: new Date(),
      },
    });

    // Create audit log
    await createAuditLog(
      zoneId,
      'UPDATE',
      { cost: existingZone.cost, freeShippingThreshold: existingZone.freeShippingThreshold },
      { cost, freeShippingThreshold },
      'admin' // TODO: Get actual user ID from session
    );

    revalidatePath('/admin/zones');
    return { success: `Zona "${existingZone.name}" actualizada correctamente` };

  } catch (error) {
    console.error("Error al actualizar la zona:", error);
    return { error: "Error interno del servidor. Inténtalo de nuevo." };
  }
}

export async function createShippingZone(
  prevState: CreateZoneFormState,
  formData: FormData
): Promise<CreateZoneFormState> {
  try {
    const result = createZoneSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const firstError = Object.values(errors)[0]?.[0] || "Datos inválidos";
      return { error: firstError };
    }

    const { identifier, name, cost, freeShippingThreshold } = result.data;

    // Verificar que no exista una zona con el mismo identificador
    const existingZone = await prisma.shippingZone.findUnique({
      where: { identifier }
    });

    if (existingZone) {
      return { error: "Ya existe una zona con este identificador" };
    }

    // Validación adicional
    if (freeShippingThreshold && freeShippingThreshold <= cost) {
      return { error: "El umbral de envío gratis debe ser mayor al costo de envío" };
    }

    const newZone = await prisma.shippingZone.create({
      data: {
        identifier: identifier.toUpperCase(),
        name,
        cost,
        freeShippingThreshold,
        postalCodes: result.data.postalCodes || null,
      },
    });

    // Create audit log
    await createAuditLog(
      newZone.id,
      'CREATE',
      null,
      { identifier: newZone.identifier, name, cost, freeShippingThreshold },
      'admin' // TODO: Get actual user ID from session
    );

    revalidatePath('/admin/zones');
    return { success: `Zona "${name}" creada exitosamente` };

  } catch (error) {
    console.error("Error al crear la zona:", error);
    return { error: "Error interno del servidor. Inténtalo de nuevo." };
  }
}

export async function deleteShippingZone(
  prevState: DeleteZoneFormState,
  formData: FormData
): Promise<DeleteZoneFormState> {
  try {
    const result = deleteZoneSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!result.success) {
      return { error: "ID de zona inválido" };
    }

    const { zoneId } = result.data;

    // Check if zone exists
    const existingZone = await prisma.shippingZone.findUnique({
      where: { id: zoneId }
    });

    if (!existingZone) {
      return { error: "La zona no existe" };
    }

    // Check if zone has associated orders
    const ordersCount = await prisma.order.count({
      where: { shippingZoneIdentifier: existingZone.identifier }
    });

    if (ordersCount > 0) {
      return { error: `No se puede eliminar. Hay ${ordersCount} pedidos asociados a esta zona` };
    }

    // Create audit log before deletion
    await createAuditLog(
      zoneId,
      'DELETE',
      existingZone,
      null,
      'admin' // TODO: Get actual user ID from session
    );

    await prisma.shippingZone.delete({
      where: { id: zoneId }
    });

    revalidatePath('/admin/zones');
    return { success: `Zona "${existingZone.name}" eliminada correctamente` };

  } catch (error) {
    console.error("Error al eliminar la zona:", error);
    return { error: "Error interno del servidor. Inténtalo de nuevo." };
  }
}

export async function toggleZoneStatus(
  prevState: ToggleZoneFormState,
  formData: FormData
): Promise<ToggleZoneFormState> {
  try {
    const result = toggleZoneSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!result.success) {
      return { error: "Datos inválidos" };
    }

    const { zoneId, isActive } = result.data;

    // Check if zone exists
    const existingZone = await prisma.shippingZone.findUnique({
      where: { id: zoneId }
    });

    if (!existingZone) {
      return { error: "La zona no existe" };
    }

    const updatedZone = await prisma.shippingZone.update({
      where: { id: zoneId },
      data: { isActive }
    });

    // Create audit log
    await createAuditLog(
      zoneId,
      isActive ? 'ACTIVATE' : 'DEACTIVATE',
      { isActive: existingZone.isActive },
      { isActive },
      'admin' // TODO: Get actual user ID from session
    );

    revalidatePath('/admin/zones');
    const action = isActive ? 'activada' : 'desactivada';
    return { success: `Zona "${existingZone.name}" ${action} correctamente` };

  } catch (error) {
    console.error("Error al cambiar estado de la zona:", error);
    return { error: "Error interno del servidor. Inténtalo de nuevo." };
  }
}

// Get zone analytics
export async function getZoneAnalytics() {
  try {
    const zones = await prisma.shippingZone.findMany({
      include: {
        _count: {
          select: {
            auditLogs: true
          }
        }
      }
    });

    const analytics = await Promise.all(
      zones.map(async (zone) => {
        const ordersCount = await prisma.order.count({
          where: { shippingZoneIdentifier: zone.identifier }
        });

        const totalRevenue = await prisma.order.aggregate({
          where: { 
            shippingZoneIdentifier: zone.identifier,
            status: { not: 'CANCELADO' }
          },
          _sum: { total: true }
        });

        return {
          ...zone,
          ordersCount,
          totalRevenue: totalRevenue._sum.total || 0,
          changesCount: zone._count.auditLogs
        };
      })
    );

    return analytics;
  } catch (error) {
    console.error('Error getting zone analytics:', error);
    return [];
  }
}
