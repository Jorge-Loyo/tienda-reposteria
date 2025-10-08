import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const now = new Date();
    
    const offers = await prisma.product.findMany({
      where: {
        published: true,
        isOfferActive: true,
        offerPriceUSD: { not: null },
        offerEndsAt: { gte: now },
      },
      select: {
        id: true,
        name: true,
        priceUSD: true,
        imageUrl: true,
        stock: true,
        isOfferActive: true,
        offerPriceUSD: true,
        offerEndsAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 4
    });

    return NextResponse.json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json({ error: 'Error al obtener ofertas' }, { status: 500 });
  }
}