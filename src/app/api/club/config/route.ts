import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    await prisma.$executeRaw`
      UPDATE club_config SET 
        points_per_dollar = ${data.points_per_dollar},
        first_prize = ${data.first_prize},
        second_prize = ${data.second_prize},
        third_prize = ${data.third_prize},
        first_prize_object = ${data.first_prize_object},
        second_prize_object = ${data.second_prize_object},
        third_prize_object = ${data.third_prize_object},
        bronze_threshold = ${data.bronze_threshold},
        silver_threshold = ${data.silver_threshold},
        gold_threshold = ${data.gold_threshold},
        bronze_cashback = ${data.bronze_cashback},
        silver_cashback = ${data.silver_cashback},
        gold_cashback = ${data.gold_cashback},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating config' }, { status: 500 });
  }
}