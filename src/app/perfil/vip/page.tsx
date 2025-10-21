import { getSessionData } from '@/lib/session';
import { redirect } from 'next/navigation';
import ProfileLayout from '@/components/ProfileLayout';

export default async function VipPage() {
  const session = await getSessionData();
  if (!session) {
    redirect('/login');
  }

  return (
    <ProfileLayout currentPage="vip">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold gradient-text mb-4">Casa Dulce VIP</h1>
        <p className="text-gray-600">Acceso exclusivo a Gift Cards de crédito y beneficios premium</p>
      </div>
      
      <div className="space-y-8">
        <div className="glass p-8 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm2 16h16"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold gradient-text mb-4">Estado de Membresía VIP</h2>
            <div className="inline-block bg-gray-100 px-6 py-3 rounded-full">
              <span className="text-gray-600 font-medium">No eres miembro VIP</span>
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold gradient-text mb-6">Beneficios VIP</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white/50 rounded-xl">
              <div className="w-12 h-12 mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                  <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                  <line x1="2" x2="22" y1="10" y2="10"></line>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Gift Cards de Crédito</h3>
              <p className="text-sm text-gray-600">Compra ahora y paga después con nuestro sistema de crédito exclusivo</p>
            </div>

            <div className="p-6 bg-white/50 rounded-xl">
              <div className="w-12 h-12 mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Atención Prioritaria</h3>
              <p className="text-sm text-gray-600">Soporte dedicado y procesamiento prioritario de pedidos</p>
            </div>

            <div className="p-6 bg-white/50 rounded-xl">
              <div className="w-12 h-12 mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Ofertas Exclusivas</h3>
              <p className="text-sm text-gray-600">Acceso anticipado a nuevos productos y descuentos especiales</p>
            </div>

            <div className="p-6 bg-white/50 rounded-xl">
              <div className="w-12 h-12 mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600">
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                  <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path>
                  <path d="M12 3v6"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Envío Gratuito</h3>
              <p className="text-sm text-gray-600">Envío sin costo en todos tus pedidos, sin monto mínimo</p>
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold gradient-text mb-6">Mi Crédito VIP</h2>
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-xl text-center">
            <h3 className="text-xl font-bold mb-2">Crédito Disponible</h3>
            <p className="text-3xl font-bold mb-4">$0.00</p>
            <p className="text-yellow-100 text-sm">Solicita tu membresía VIP para acceder a crédito</p>
          </div>
        </div>

        <div className="text-center">
          <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-200">
            Solicitar Membresía VIP
          </button>
          <p className="text-sm text-gray-600 mt-4">
            Contacta con nuestro equipo para evaluar tu solicitud de membresía VIP
          </p>
        </div>
      </div>
    </ProfileLayout>
  );
}