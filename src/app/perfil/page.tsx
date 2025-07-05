import { getSessionData } from '@/lib/session';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import ChangePasswordForm from '@/components/ChangePasswordForm';
import UpdateProfileForm from '@/components/UpdateProfileForm';

const prisma = new PrismaClient();

// --- Iconos para el Menú ---
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const ShoppingBagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
const LayoutDashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const SlidersHorizontalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><line x1="21" x2="14" y1="4" y2="4"></line><line x1="10" x2="3" y1="4" y2="4"></line><line x1="21" x2="12" y1="12" y2="12"></line><line x1="8" x2="3" y1="12" y2="12"></line><line x1="21" x2="16" y1="20" y2="20"></line><line x1="12" x2="3" y1="20" y2="20"></line><line x1="14" x2="14" y1="2" y2="6"></line><line x1="8" x2="8" y1="10" y2="14"></line><line x1="16" x2="16" y1="18" y2="22"></line></svg>;
const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M10 17.5V14H3V4h14v10h-4v3.5h-3zM2 9h16"></path><path d="M16 14h2l3.1-6.2A.5.5 0 0 0 20.6 7H18"></path><circle cx="5.5" cy="17.5" r="2.5"></circle><circle cx="14.5" cy="17.5" r="2.5"></circle></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;


export default async function ProfilePage() {
  const session = await getSessionData();
  if (!session) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { 
        name: true, 
        email: true, 
        role: true,
        instagram: true,
        phoneNumber: true,
        address: true
    },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <aside className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Navegación</h2>
              <nav className="space-y-2">
                <a href="/" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
                  <HomeIcon /> Inicio
                </a>
                <a href="/perfil" className="flex items-center gap-3 px-3 py-2 bg-gray-100 text-gray-900 rounded-md font-medium">
                  <UserIcon /> Mi Perfil
                </a>
                <a href="/pedidos" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
                  <ShoppingBagIcon /> Mis Pedidos
                </a>
                <a href="/envios" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
                  <TruckIcon /> Envíos
                </a>
                <a href="/club" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
                  <StarIcon /> Casa Dulce Club
                </a>

                {/* Menú condicional para administradores */}
                {user.role === 'ADMIN' && (
                  <>
                    <div className="pt-2 mt-2 border-t">
                      <a href="/admin" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
                        <SlidersHorizontalIcon /> Gestión
                      </a>
                      <a href="/admin/orders" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
                        <ShoppingBagIcon /> Órdenes
                      </a>
                      {/* Se elimina el evento onClick para evitar el error en componentes de servidor */}
                      <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-400 rounded-md cursor-not-allowed">
                        <LayoutDashboardIcon /> Dashboard
                      </a>
                    </div>
                  </>
                )}
              </nav>
            </div>
          </aside>

          <main className="md:col-span-2 space-y-8">
            <UpdateProfileForm user={user} />

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Cambiar Contraseña</h2>
              <ChangePasswordForm />
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}