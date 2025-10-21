import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const rawUsers = await prisma.$queryRaw`
      SELECT vc.*, u.name, u.email 
      FROM vip_credits vc
      JOIN "User" u ON vc.user_id = u.id
      ORDER BY vc.created_at DESC
    ` as any[];

    // Format data to match expected structure
    const users = rawUsers.map(user => ({
      id: user.id,
      user_id: user.user_id,
      credit_limit: user.credit_limit,
      current_balance: user.current_balance,
      used_amount: user.used_amount,
      is_active: user.is_active,
      notes: user.notes,
      payment_due_date: user.payment_due_date,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email
      }
    }));

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching VIP users' }, { status: 500 });
  }
}