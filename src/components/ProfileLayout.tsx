import { getSessionData } from '@/lib/session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Iconos para el menú
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const ShoppingBagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
const LayoutDashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const SlidersHorizontalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><line x1="21" x2="14" y1="4" y2="4"></line><line x1="10" x2="3" y1="4" y2="4"></line><line x1="21" x2="12" y1="12" y2="12"></line><line x1="8" x2="3" y1="12" y2="12"></line><line x1="21" x2="16" y1="20" y2="20"></line><line x1="12" x2="3" y1="20" y2="20"></line><line x1="14" x2="14" y1="2" y2="6"></line><line x1="8" x2="8" y1="10" y2="14"></line><line x1="16" x2="16" y1="18" y2="22"></line></svg>;
const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M10 17.5V14H3V4h14v10h-4v3.5h-3zM2 9h16"></path><path d="M16 14h2l3.1-6.2A.5.5 0 0 0 20.6 7H18"></path><circle cx="5.5" cy="17.5" r="2.5"></circle><circle cx="14.5" cy="17.5" r="2.5"></circle></svg>;
const MegaphoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const CrownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm2 16h16"></path></svg>;
const HeadphonesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path></svg>;
const MessageSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;

interface ProfileLayoutProps {
  children: React.ReactNode;
  currentPage?: 'perfil' | 'pedidos' | 'club' | 'vip' | 'soporte';
}

export default async function ProfileLayout({ children, currentPage = 'perfil' }: ProfileLayoutProps) {
  const session = await getSessionData();
  
  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { 
      name: true, 
      email: true, 
      role: true,
      avatarUrl: true,
    },
  });

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <aside className="lg:col-span-1">
            <div className="glass p-6 rounded-2xl shadow-xl">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden">
                  {user.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={user.name || 'Usuario'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {user.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-800">{user.name || 'Usuario'}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              
              <nav className="space-y-2">
                <a 
                  href="/perfil" 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    currentPage === 'perfil' 
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-white/50'
                  }`}
                >
                  <UserIcon /> Mi Perfil
                </a>
                <a 
                  href="/pedidos" 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    currentPage === 'pedidos' 
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-white/50'
                  }`}
                >
                  <ShoppingBagIcon /> Mis Pedidos
                </a>
                <a 
                  href="/perfil/club" 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    currentPage === 'club' 
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-white/50'
                  }`}
                >
                  <StarIcon /> El Club de Casa Dulce
                </a>
                <a 
                  href="/perfil/vip" 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    currentPage === 'vip' 
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-white/50'
                  }`}
                >
                  <CrownIcon /> Casa Dulce VIP
                </a>
                <a 
                  href="/perfil/soporte" 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    currentPage === 'soporte' 
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-white/50'
                  }`}
                >
                  <HeadphonesIcon /> Soporte
                </a>
                {(user.role === 'MASTER' || user.role === 'ADMINISTRADOR' || user.role === 'MARKETING') && (
                  <>
                    <div className="pt-4 mt-4 border-t border-white/20">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        {user.role === 'MASTER' ? 'Sistema Completo' : user.role === 'ADMINISTRADOR' ? 'Administración' : 'Marketing'}
                      </p>
                      {user.role === 'MASTER' && (
                        <>
                          <a href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-200">
                            <SlidersHorizontalIcon /> Panel Principal
                          </a>
                          <a href="/admin/club" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-200">
                            <StarIcon /> Gestión del Club
                          </a>
                          <a href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-200">
                            <ShoppingBagIcon /> Productos
                          </a>
                          <a href="/admin/categories" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-200">
                            <LayoutDashboardIcon /> Categorías
                          </a>
                          <a href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-200">
                            <TruckIcon /> Órdenes
                          </a>
                          <a href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-200">
                            <UserIcon /> Usuarios
                          </a>
                          <a href="/admin/zones" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-200">
                            <HomeIcon /> Zonas
                          </a>
                          <a href="/admin/marketing" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-200">
                            <MegaphoneIcon /> Marketing
                          </a>
                          <a href="/admin/consultas" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-200">
                            <MessageSquareIcon /> Consultas
                          </a>
                        </>
                      )}
                      {user.role === 'ADMINISTRADOR' && (
                        <>
                          <a href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-200">
                            <SlidersHorizontalIcon /> Gestión
                          </a>
                          <a href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-200">
                            <ShoppingBagIcon /> Órdenes
                          </a>
                          <a href="/admin/marketing" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-200">
                            <MegaphoneIcon /> Marketing
                          </a>
                          <a href="/admin/consultas" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-200">
                            <MessageSquareIcon /> Consultas
                          </a>
                        </>
                      )}
                      {user.role === 'MARKETING' && (
                        <>
                          <a href="/admin/marketing" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-200">
                            <MegaphoneIcon /> Marketing
                          </a>
                          <a href="/admin/consultas" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-200">
                            <MessageSquareIcon /> Consultas
                          </a>
                        </>
                      )}
                    </div>
                  </>
                )}
              </nav>
            </div>
          </aside>

          <main className="lg:col-span-3">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}