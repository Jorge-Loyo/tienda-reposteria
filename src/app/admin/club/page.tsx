import { getSessionData } from '@/lib/session';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function ClubManagementPage() {
  const session = await getSessionData();
  if (!session) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true },
  });

  if (!user || user.role !== 'MASTER') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">Gestión del Club de Casa Dulce</h1>
          <p className="text-gray-600">Configura las condiciones y beneficios del sistema de puntos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold gradient-text mb-6">Configuración de Puntos</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puntos por cada $1 gastado
                </label>
                <input 
                  type="number" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto mínimo para acumular puntos
                </label>
                <input 
                  type="number" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="5.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor de cada punto (en $)
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="0.10"
                />
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold gradient-text mb-6">Niveles de Membresía</h2>
            <div className="space-y-4">
              <div className="p-4 bg-white/50 rounded-xl">
                <h3 className="font-semibold text-gray-800">Bronce (0-499 puntos)</h3>
                <p className="text-sm text-gray-600">Beneficios básicos del club</p>
              </div>
              <div className="p-4 bg-white/50 rounded-xl">
                <h3 className="font-semibold text-gray-800">Plata (500-999 puntos)</h3>
                <p className="text-sm text-gray-600">5% descuento adicional</p>
              </div>
              <div className="p-4 bg-white/50 rounded-xl">
                <h3 className="font-semibold text-gray-800">Oro (1000+ puntos)</h3>
                <p className="text-sm text-gray-600">10% descuento + envío gratis</p>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-2xl shadow-xl lg:col-span-2">
            <h2 className="text-2xl font-bold gradient-text mb-6">Estado del Sistema</h2>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">Sistema de Puntos</h3>
                <p className="text-sm text-gray-600">Activar o desactivar el club de fidelidad</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );
}