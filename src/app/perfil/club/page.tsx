import { getSessionData } from '@/lib/session';
import { PrismaClient } from '@prisma/client';
import { ClubDashboard } from '@/components/ClubDashboard';
import { redirect } from 'next/navigation';
import ProfileLayout from '@/components/ProfileLayout';

const prisma = new PrismaClient();

async function getUserClubData(userId: number) {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const startOfMonth = new Date(currentYear, now.getMonth(), 1);
  const endOfMonth = new Date(currentYear, now.getMonth() + 1, 0, 23, 59, 59);

  // Obtener usuario
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('Usuario no encontrado');

  // Calcular puntos del mes basado en órdenes enviadas o completadas
  const monthlyOrders = await prisma.order.findMany({
    where: {
      customerEmail: user.email,
      status: { in: ['ENVIADO', 'COMPLETADO'] },
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth
      }
    }
  });
  
  const monthlyPoints = Math.floor(monthlyOrders.reduce((sum, order) => sum + order.total, 0));

  // Obtener o crear puntos del usuario
  let userPoints = await prisma.userPoints.findUnique({
    where: { userId }
  });

  if (!userPoints) {
    userPoints = await prisma.userPoints.create({
      data: {
        userId,
        totalPoints: monthlyPoints,
        monthlyPoints,
        level: 'BRONZE',
        currentMonth,
        currentYear
      }
    });
  } else if (userPoints.currentMonth !== currentMonth || userPoints.currentYear !== currentYear) {
    // Nuevo mes, resetear puntos mensuales
    userPoints = await prisma.userPoints.update({
      where: { userId },
      data: {
        monthlyPoints,
        currentMonth,
        currentYear
      }
    });
  } else {
    // Actualizar puntos del mes actual
    userPoints = await prisma.userPoints.update({
      where: { userId },
      data: {
        monthlyPoints,
        totalPoints: userPoints.totalPoints + (monthlyPoints - userPoints.monthlyPoints)
      }
    });
  }

  // Obtener o crear configuración del club
  let config = await prisma.clubConfig.findFirst();
  if (!config) {
    config = await prisma.clubConfig.create({
      data: {
        bronzeThreshold: 0,
        silverThreshold: 100,
        goldThreshold: 500,
        platinumThreshold: 1000,
        pointsPerDollar: 1.0,
        bronzeCashback: 2.0,
        silverCashback: 5.0,
        goldCashback: 10.0,
        firstPrize: 100.0,
        secondPrize: 50.0,
        thirdPrize: 25.0
      }
    });
  }

  // Obtener ranking del mes
  const allPoints = await prisma.userPoints.findMany({
    where: {
      currentMonth,
      currentYear
    },
    include: {
      user: { select: { name: true } }
    },
    orderBy: { monthlyPoints: 'desc' },
    take: 10
  });

  const ranking = allPoints.map((up, index) => ({
    name: up.user?.name || 'Usuario',
    monthly_points: up.monthlyPoints,
    level: up.level,
    position: index + 1
  }));

  // Calcular posición del usuario
  const userPosition = allPoints.findIndex(up => up.userId === userId) + 1 || 0;

  return {
    userPoints: {
      total_points: userPoints.totalPoints,
      monthly_points: userPoints.monthlyPoints,
      level: userPoints.level
    },
    config: {
      first_prize: config.firstPrize,
      second_prize: config.secondPrize,
      third_prize: config.thirdPrize,
      bronze_threshold: config.bronzeThreshold,
      silver_threshold: config.silverThreshold,
      gold_threshold: config.goldThreshold,
      bronze_cashback: config.bronzeCashback,
      silver_cashback: config.silverCashback,
      gold_cashback: config.goldCashback
    },
    ranking,
    userPosition
  };
}

export default async function ClubPage() {
  const session = await getSessionData();
  if (!session) redirect('/login');

  const clubData = await getUserClubData(session.userId);

  return (
    <ProfileLayout currentPage="club">
      <ClubDashboard {...clubData} />
    </ProfileLayout>
  );
}