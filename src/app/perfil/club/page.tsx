import { getSessionData } from '@/lib/session';
import { ClubDashboard } from '@/components/ClubDashboard';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

async function getUserClubData(userId: number) {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [userPoints, config, ranking] = await Promise.all([
    prisma.userPoints.findUnique({
      where: { userId },
      include: { user: true }
    }),
    prisma.clubConfig.findFirst(),
    prisma.userPoints.findMany({
      where: {
        currentMonth,
        currentYear
      },
      include: { user: true },
      orderBy: { monthlyPoints: 'desc' },
      take: 10
    })
  ]);

  const finalUserPoints = userPoints || await prisma.userPoints.create({
    data: {
      userId,
      currentMonth,
      currentYear
    },
    include: { user: true }
  });

  const userPosition = ranking.findIndex(r => r.userId === userId) + 1;

  return {
    userPoints: {
      total_points: finalUserPoints.totalPoints,
      monthly_points: finalUserPoints.monthlyPoints,
      level: finalUserPoints.level
    },
    config: config ? {
      first_prize: 100,
      second_prize: 50,
      third_prize: 25,
      bronze_threshold: config.bronzeThreshold,
      silver_threshold: config.silverThreshold,
      gold_threshold: config.goldThreshold,
      bronze_cashback: 2,
      silver_cashback: 5,
      gold_cashback: 10
    } : {
      first_prize: 100,
      second_prize: 50,
      third_prize: 25,
      bronze_threshold: 0,
      silver_threshold: 100,
      gold_threshold: 500,
      bronze_cashback: 2,
      silver_cashback: 5,
      gold_cashback: 10
    },
    ranking: ranking.map((r, index) => ({
      name: r.user.name || r.user.email,
      monthly_points: r.monthlyPoints,
      level: r.level,
      position: index + 1
    })),
    userPosition: userPosition || 0
  };
}

export default async function ClubPage() {
  const session = await getSessionData();
  if (!session) redirect('/login');

  const clubData = await getUserClubData(session.userId);

  return <ClubDashboard {...clubData} />;
}