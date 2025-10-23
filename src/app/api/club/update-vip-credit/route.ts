import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionData } from '@/lib/session';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Update VIP request:', body);
    
    const { vipId, creditLimit, paymentDueDate } = body;
    console.log('Parsed data:', { vipId, creditLimit, paymentDueDate });

    // Handle monthly recurring dates
    let dueDateValue = null;
    if (paymentDueDate) {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      
      if (paymentDueDate === 'ultimo') {
        dueDateValue = new Date(currentYear, currentMonth + 1, 0);
      } else if (paymentDueDate === 'habil') {
        const firstDay = new Date(currentYear, currentMonth + 1, 1);
        while (firstDay.getDay() === 0 || firstDay.getDay() === 6) {
          firstDay.setDate(firstDay.getDate() + 1);
        }
        dueDateValue = firstDay;
      } else {
        const dayOfMonth = parseInt(paymentDueDate);
        dueDateValue = new Date(currentYear, currentMonth, dayOfMonth);
        if (dueDateValue < today) {
          dueDateValue = new Date(currentYear, currentMonth + 1, dayOfMonth);
        }
      }
    }

    await prisma.$executeRaw`
      UPDATE vip_credits SET
        credit_limit = ${creditLimit},
        current_balance = ${creditLimit},
        payment_due_date = ${dueDateValue},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${vipId}
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Detailed update error:', error);
    return NextResponse.json({ 
      error: `Error actualizando VIP: ${error.message || error}`,
      details: error.toString()
    }, { status: 500 });
  }
}