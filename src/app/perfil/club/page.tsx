import { getSessionData } from '@/lib/session';
import { redirect } from 'next/navigation';
import ProfileLayout from '@/components/ProfileLayout';

export default async function ClubPage() {
  const session = await getSessionData();
  if (!session) {
    redirect('/login');
  }

  return (
    <ProfileLayout currentPage="club">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold gradient-text mb-4">El Club de Casa Dulce</h1>
        <p className="text-gray-600">Sistema de acumulación de puntos y beneficios exclusivos</p>
      </div>
      
      <div className="glass p-12 rounded-2xl shadow-xl text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-4">¡Próximamente!</h2>
          <p className="text-lg text-gray-600 mb-8">
            Estamos preparando algo especial para ti. Muy pronto podrás acumular puntos con cada compra y canjearlos por increíbles beneficios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white/50 rounded-xl">
            <div className="w-12 h-12 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-600">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Acumula Puntos</h3>
            <p className="text-sm text-gray-600">Gana puntos con cada compra que realices</p>
          </div>

          <div className="p-6 bg-white/50 rounded-xl">
            <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Beneficios Exclusivos</h3>
            <p className="text-sm text-gray-600">Accede a descuentos y promociones especiales</p>
          </div>

          <div className="p-6 bg-white/50 rounded-xl">
            <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                <path d="M9 12l2 2 4-4"></path>
                <path d="M21 12c.552 0 1-.448 1-1V8c0-.552-.448-1-1-1h-1V4c0-.552-.448-1-1-1H4c-.552 0-1 .448-1 1v3H2c-.552 0-1 .448-1 1v3c0 .552.448 1 1 1h1v3c0 .552.448 1 1 1h15c.552 0 1-.448 1-1v-3h1z"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Canjea Premios</h3>
            <p className="text-sm text-gray-600">Utiliza tus puntos para obtener productos gratis</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-2">¡Mantente atento!</h3>
          <p className="text-pink-100">Te notificaremos cuando el Club de Casa Dulce esté disponible. Mientras tanto, sigue disfrutando de nuestros deliciosos productos.</p>
        </div>
      </div>
    </ProfileLayout>
  );
}