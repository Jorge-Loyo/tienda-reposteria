//src/app/order/[orderId]/pago/page.tsx

import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { getBcvRate, formatToVes } from '@/lib/currency';
import PaymentInstructionsClient from './PaymentInstructionsClient';

const prisma = new PrismaClient();




export default async function PaymentInstructionsPage({ params }: { params: { orderId: string } }) {
  const orderId = Number(params.orderId);
  if (isNaN(orderId)) {
    notFound();
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            select: { name: true },
          },
        },
      },
    },
  });

  const bcvRate = await getBcvRate();

  if (!order) {
    notFound();
  }

  return <PaymentInstructionsClient order={order} bcvRate={bcvRate} />;
}