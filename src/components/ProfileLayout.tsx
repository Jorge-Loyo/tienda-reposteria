import { getSessionData } from '@/lib/session';
import { PrismaClient } from '@prisma/client';
import { 
  User, ShoppingBag, LayoutDashboard, Home, SlidersHorizontal, 
  Truck, Megaphone, Star, Crown, Headphones, MessageSquare 
} from 'lucide-react';

const prisma = new PrismaClient();

type UserRole = 'MASTER' | 'ADMINISTRADOR' | 'MARKETING';
type PageType = 'perfil' | 'pedidos' | 'club' | 'vip' | 'soporte';

const CONFIG = {
  ROLE_LABELS: {
    MASTER: 'Sistema Completo',
    ADMINISTRADOR: 'Administración', 
    MARKETING: 'Marketing'
  } as Record<UserRole, string>,
  
  ADMIN_ROLES: ['MASTER', 'ADMINISTRADOR', 'MARKETING'] as const,
  
  MAIN_NAV: [
    { href: '/perfil', icon: User, label: 'Mi Perfil', page: 'perfil' },
    { href: '/pedidos', icon: ShoppingBag, label: 'Mis Pedidos', page: 'pedidos' },
    { href: '/perfil/club', icon: Star, label: 'El Club de Casa Dulce', page: 'club' },
    { href: '/perfil/vip', icon: Crown, label: 'Casa Dulce VIP', page: 'vip' },
    { href: '/perfil/soporte', icon: Headphones, label: 'Soporte', page: 'soporte' }
  ] as const,
  
  ADMIN_NAV: {
    MASTER: [
      { href: '/admin', icon: SlidersHorizontal, label: 'Panel Principal' },
      { href: '/admin/club', icon: Star, label: 'Gestión del Club' },
      { href: '/admin/products', icon: ShoppingBag, label: 'Productos' },
      { href: '/admin/categories', icon: LayoutDashboard, label: 'Categorías' },
      { href: '/admin/orders', icon: Truck, label: 'Órdenes' },
      { href: '/admin/users', icon: User, label: 'Usuarios' },
      { href: '/admin/zones', icon: Home, label: 'Zonas' },
      { href: '/admin/marketing', icon: Megaphone, label: 'Marketing' },
      { href: '/admin/consultas', icon: MessageSquare, label: 'Consultas' }
    ],
    ADMINISTRADOR: [
      { href: '/admin', icon: SlidersHorizontal, label: 'Gestión' },
      { href: '/admin/orders', icon: ShoppingBag, label: 'Órdenes' },
      { href: '/admin/marketing', icon: Megaphone, label: 'Marketing' },
      { href: '/admin/consultas', icon: MessageSquare, label: 'Consultas' }
    ],
    MARKETING: [
      { href: '/admin/marketing', icon: Megaphone, label: 'Marketing' },
      { href: '/admin/consultas', icon: MessageSquare, label: 'Consultas' }
    ]
  }
};

const isAdminRole = (role: string): role is UserRole => 
  CONFIG.ADMIN_ROLES.includes(role as UserRole);

interface ProfileLayoutProps {
  children: React.ReactNode;
  currentPage?: PageType;
}

interface NavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive?: boolean;
}

const NavLink = ({ href, icon: Icon, label, isActive }: NavLinkProps) => {
  const classes = [
    "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
    isActive 
      ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg"
      : "text-gray-700 hover:bg-white/50"
  ].join(" ");
  
  return (
    <a href={href} className={classes}>
      <Icon className="h-5 w-5" /> {label}
    </a>
  );
};

const AdminSection = ({ userRole }: { userRole: UserRole }) => (
  <div className="pt-4 mt-4 border-t border-white/20">
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
      {CONFIG.ROLE_LABELS[userRole]}
    </p>
    {CONFIG.ADMIN_NAV[userRole].map(({ href, icon: Icon, label }) => (
      <a key={href} href={href} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-200">
        <Icon className="h-5 w-5" /> {label}
      </a>
    ))}
  </div>
);



const UserAvatar = ({ user }: { user: { name?: string | null; avatarUrl?: string | null } }) => (
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
);

export default async function ProfileLayout({ children, currentPage = 'perfil' }: ProfileLayoutProps) {
  const session = await getSessionData();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, email: true, role: true, avatarUrl: true },
  });
  
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="glass p-6 rounded-2xl shadow-xl">
              <div className="text-center mb-6">
                <UserAvatar user={user} />
                <h3 className="font-semibold text-gray-800">{user.name || 'Usuario'}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              
              <nav className="space-y-2">
                {CONFIG.MAIN_NAV.map((item) => (
                  <NavLink 
                    key={item.href}
                    href={item.href} 
                    icon={item.icon} 
                    label={item.label} 
                    isActive={currentPage === item.page}
                  />
                ))}
                {isAdminRole(user.role) && <AdminSection userRole={user.role} />}
              </nav>
            </div>
          </aside>
          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}