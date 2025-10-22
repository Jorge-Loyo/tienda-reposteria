import { PrismaClient } from '@prisma/client';
import { ClubManager } from '@/components/ClubManager';
import { ArrowLeft, Trophy, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const prisma = new PrismaClient();

async function getClubData() {
  const config = await prisma.$queryRaw`SELECT * FROM club_config WHERE id = 1` as any[];
  const topUsers = await prisma.$queryRaw`
    SELECT u.name, u.email, up.monthly_points, up.total_points, up.level,
           ROW_NUMBER() OVER (ORDER BY up.monthly_points DESC) as position
    FROM user_points up 
    JOIN "User" u ON up.user_id = u.id 
    WHERE up.current_month = EXTRACT(MONTH FROM CURRENT_DATE)
    AND up.current_year = EXTRACT(YEAR FROM CURRENT_DATE)
    ORDER BY up.monthly_points DESC 
    LIMIT 10
  ` as any[];
  const totalUsers = await prisma.$queryRaw`SELECT COUNT(*) as count FROM user_points WHERE monthly_points > 0` as any[];

  return {
    config: config[0] || {},
    topUsers: topUsers || [],
    totalUsers: (totalUsers[0] as any)?.count || 0
  };
}

export default async function ClubPage() {
  const { config, topUsers, totalUsers } = await getClubData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-16 mt-8">
          <div></div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión del Club</h1>
            </div>
            <p className="text-sm text-gray-500">Administra premios, puntos y configuración</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/perfil" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Atrás
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Miembros Activos</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">$ para 1 Punto</p>
                <p className="text-2xl font-bold text-gray-900">${config.points_per_dollar || 1}</p>
              </div>
              <Settings className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Premio 1er Lugar</p>
                <p className="text-2xl font-bold text-gray-900">${config.first_prize || 200}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <ClubManager config={config} topUsers={topUsers} />
        </div>
      </div>
    </div>
  );
}