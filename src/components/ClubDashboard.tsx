'use client';

import { Trophy, Medal, Award, Star, TrendingUp, Gift, Crown } from 'lucide-react';

interface ClubDashboardProps {
  userPoints: {
    total_points: number;
    monthly_points: number;
    level: string;
  };
  config: {
    first_prize: number;
    second_prize: number;
    third_prize: number;
    bronze_threshold: number;
    silver_threshold: number;
    gold_threshold: number;
    bronze_cashback: number;
    silver_cashback: number;
    gold_cashback: number;
  };
  ranking: Array<{
    name: string;
    monthly_points: number;
    level: string;
    position: number;
  }>;
  userPosition: number;
}

export function ClubDashboard({ userPoints, config, ranking, userPosition }: ClubDashboardProps) {
  const getLevelInfo = (level: string) => {
    switch (level) {
      case 'GOLD':
        return { 
          color: 'from-yellow-400 to-yellow-600', 
          icon: Crown, 
          name: 'Oro',
          cashback: config.gold_cashback,
          next: null,
          nextThreshold: 0
        };
      case 'SILVER':
        return { 
          color: 'from-gray-300 to-gray-500', 
          icon: Medal, 
          name: 'Plata',
          cashback: config.silver_cashback,
          next: 'Oro',
          nextThreshold: config.gold_threshold - userPoints.total_points
        };
      default:
        return { 
          color: 'from-amber-600 to-amber-800', 
          icon: Award, 
          name: 'Bronce',
          cashback: config.bronze_cashback,
          next: 'Plata',
          nextThreshold: config.silver_threshold - userPoints.total_points
        };
    }
  };

  const levelInfo = getLevelInfo(userPoints.level);
  const LevelIcon = levelInfo.icon;
  const daysLeft = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate();

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">El Club de Casa Dulce</h1>
        <p className="text-gray-600">¡Compite, acumula puntos y gana increíbles premios!</p>
      </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-2">
              <Star className="h-6 w-6 text-purple-600" />
              <span className="font-medium">Puntos Totales</span>
            </div>
            <p className="text-3xl font-bold text-purple-600">{userPoints.total_points}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <span className="font-medium">Este Mes</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{userPoints.monthly_points}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="h-6 w-6 text-orange-600" />
              <span className="font-medium">Posición</span>
            </div>
            <p className="text-3xl font-bold text-orange-600">#{userPosition}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-2">
              <Gift className="h-6 w-6 text-red-600" />
              <span className="font-medium">Días Restantes</span>
            </div>
            <p className="text-3xl font-bold text-red-600">{daysLeft}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Mi Nivel */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-xl font-bold mb-4">Mi Nivel Actual</h3>
            <div className={`bg-gradient-to-r ${levelInfo.color} rounded-lg p-6 text-white mb-4`}>
              <div className="flex items-center gap-3 mb-2">
                <LevelIcon className="h-8 w-8" />
                <span className="text-2xl font-bold">{levelInfo.name}</span>
              </div>
              <p className="text-lg">{levelInfo.cashback}% Cashback en compras</p>
            </div>
            
            {levelInfo.next && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Próximo nivel: {levelInfo.next}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.max(0, Math.min(100, ((config.silver_threshold - levelInfo.nextThreshold) / config.silver_threshold) * 100))}%` 
                    }}
                  ></div>
                </div>
                <p className="text-sm font-medium">
                  {levelInfo.nextThreshold > 0 
                    ? `${levelInfo.nextThreshold} puntos para ${levelInfo.next}`
                    : `¡Ya alcanzaste ${levelInfo.next}!`
                  }
                </p>
              </div>
            )}
          </div>

          {/* Premios del Mes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-xl font-bold mb-4">Premios del Mes</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-3">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                  <span className="font-medium">🥇 Primer Lugar</span>
                </div>
                <span className="text-xl font-bold text-yellow-600">${config.first_prize}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <Medal className="h-6 w-6 text-gray-600" />
                  <span className="font-medium">🥈 Segundo Lugar</span>
                </div>
                <span className="text-xl font-bold text-gray-600">${config.second_prize}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-amber-600" />
                  <span className="font-medium">🥉 Tercer Lugar</span>
                </div>
                <span className="text-xl font-bold text-amber-600">${config.third_prize}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ranking */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-xl font-bold mb-6">🏆 Ranking del Mes</h3>
          <div className="space-y-3">
            {ranking.map((user, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100">
                    {index === 0 && <Trophy className="h-5 w-5 text-yellow-600" />}
                    {index === 1 && <Medal className="h-5 w-5 text-gray-600" />}
                    {index === 2 && <Award className="h-5 w-5 text-amber-600" />}
                    {index > 2 && <span className="text-sm font-bold">#{index + 1}</span>}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">Nivel: {user.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{user.monthly_points}</p>
                  <p className="text-sm text-gray-600">puntos</p>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}