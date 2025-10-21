import { getSessionData } from '@/lib/session';
import { PrismaClient } from '@prisma/client';
import { ClubDashboard } from '@/components/ClubDashboard';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

async function getUserClubData(userId: number) {
  const [userPoints, config, ranking, userRank] = await Promise.all([
    prisma.$queryRaw`
      SELECT * FROM user_points 
      WHERE user_id = ${userId}
    `,
    prisma.$queryRaw`SELECT * FROM club_config WHERE id = 1`,
    prisma.$queryRaw`
      SELECT u.name, up.monthly_points, up.level,
             ROW_NUMBER() OVER (ORDER BY up.monthly_points DESC) as position
      FROM user_points up 
      JOIN "User" u ON up.user_id = u.id 
      WHERE up.current_month = EXTRACT(MONTH FROM CURRENT_DATE)
      AND up.current_year = EXTRACT(YEAR FROM CURRENT_DATE)
      ORDER BY up.monthly_points DESC 
      LIMIT 10
    `,
    prisma.$queryRaw`
      SELECT COUNT(*) + 1 as position FROM user_points 
      WHERE monthly_points > (
        SELECT monthly_points FROM user_points WHERE user_id = ${userId}
      )
      AND current_month = EXTRACT(MONTH FROM CURRENT_DATE)
      AND current_year = EXTRACT(YEAR FROM CURRENT_DATE)
    `
  ]);

  return {
    userPoints: userPoints[0] || { total_points: 0, monthly_points: 0, level: 'BRONZE' },
    config: config[0],
    ranking: ranking || [],
    userPosition: userRank[0]?.position || 0
  };
}

export default async function ClubPage() {
  const session = await getSessionData();
  if (!session) redirect('/login');

  const clubData = await getUserClubData(session.userId);

  return <ClubDashboard {...clubData} />;
}