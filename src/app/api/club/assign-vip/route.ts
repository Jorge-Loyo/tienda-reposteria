import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Raw request body:', body);
    
    const { userId, creditLimit, notes, paymentDueDate } = body;
    console.log('Parsed data:', { userId, creditLimit, notes, paymentDueDate });
    
    // Buscar usuario por email
    const user = await prisma.$queryRaw`
      SELECT id FROM "User" WHERE email = ${userId}
    ` as any[];
    
    if (!user || user.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const userRecord = user[0] as { id: number };

    // Crear o actualizar crédito VIP
    // Handle monthly recurring dates
    let dueDateValue = null;
    if (paymentDueDate) {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      
      if (paymentDueDate === 'ultimo') {
        // Last day of current month
        dueDateValue = new Date(currentYear, currentMonth + 1, 0);
      } else if (paymentDueDate === 'habil') {
        // First business day of next month
        const firstDay = new Date(currentYear, currentMonth + 1, 1);
        while (firstDay.getDay() === 0 || firstDay.getDay() === 6) {
          firstDay.setDate(firstDay.getDate() + 1);
        }
        dueDateValue = firstDay;
      } else {
        // Specific day of month
        const dayOfMonth = parseInt(paymentDueDate);
        dueDateValue = new Date(currentYear, currentMonth, dayOfMonth);
        // If the date has passed this month, set for next month
        if (dueDateValue < today) {
          dueDateValue = new Date(currentYear, currentMonth + 1, dayOfMonth);
        }
      }
    }
    console.log('Processing VIP credit for user:', userRecord.id);
    console.log('Credit data:', { creditLimit, notes, dueDateValue });
    
    // Check if VIP credit already exists
    const existingCredit = await prisma.$queryRaw`
      SELECT id FROM vip_credits WHERE user_id = ${userRecord.id}
    ` as any[];
    
    console.log('Existing credit check result:', existingCredit);
    
    if (existingCredit.length > 0) {
      // Update existing credit
      console.log('Updating existing credit');
      await prisma.$executeRaw`
        UPDATE vip_credits SET
          credit_limit = ${creditLimit},
          current_balance = ${creditLimit},
          is_active = true,
          notes = ${notes || ''},
          payment_due_date = ${dueDateValue},
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${userRecord.id}
      `;
    } else {
      // Insert new credit
      console.log('Inserting new credit');
      await prisma.$executeRaw`
        INSERT INTO vip_credits (user_id, credit_limit, current_balance, used_amount, is_active, notes, payment_due_date, created_at, updated_at)
        VALUES (${userRecord.id}, ${creditLimit}, ${creditLimit}, 0, true, ${notes || ''}, ${dueDateValue}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `;
    }

    // Actualizar rol del usuario a CLIENTE_VIP
    await prisma.$executeRaw`
      UPDATE "User" SET role = 'CLIENTE_VIP' WHERE id = ${userRecord.id}
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Detailed error:', error);
    return NextResponse.json({ 
      error: `Error asignando VIP: ${error.message || error}`,
      details: error.toString()
    }, { status: 500 });
  }
}