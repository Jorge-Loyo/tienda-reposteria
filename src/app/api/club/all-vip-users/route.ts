import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const vipUsers = await prisma.$queryRaw`
      SELECT id, name, email FROM "User" WHERE role = 'CLIENTE_VIP'
    `;

    return NextResponse.json({ users: vipUsers });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error obteniendo usuarios VIP' }, { status: 500 });
  }
}