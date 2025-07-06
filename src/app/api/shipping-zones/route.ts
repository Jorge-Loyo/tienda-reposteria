import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Esta función se encarga de obtener todas las zonas de envío de la base de datos.
export async function GET() {
  try {
    const shippingZones = await prisma.shippingZone.findMany({
        orderBy: { id: 'asc' } // Se ordenan para que aparezcan siempre en el mismo orden
    });
    return NextResponse.json(shippingZones);
  } catch (error) {
    console.error("Error al obtener las zonas de envío:", error);
    return NextResponse.json({ error: "No se pudieron obtener las zonas de envío" }, { status: 500 });
  }
}