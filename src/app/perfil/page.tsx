import { getSessionData } from '@/lib/session';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import ChangePasswordForm from '@/components/ChangePasswordForm';
import UpdateProfileForm from '@/components/UpdateProfileForm';
import ProfileLayout from '@/components/ProfileLayout';

const prisma = new PrismaClient();


export default async function ProfilePage() {
  const session = await getSessionData();
  if (!session) {
    redirect('/login');
  }

  // Se actualiza la consulta para obtener el nuevo campo de cédula
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { 
        name: true, 
        email: true, 
        role: true,
        instagram: true,
        phoneNumber: true,
        address: true,
        identityCard: true,
        avatarUrl: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <ProfileLayout currentPage="perfil">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold gradient-text mb-4">Mi Perfil</h1>
        <p className="text-gray-600">Gestiona tu información personal y configuración</p>
      </div>
      
      <div className="space-y-8">
        <div className="glass p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold gradient-text mb-6">Información Personal</h2>
          <UpdateProfileForm user={user} />
        </div>

        <div className="glass p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold gradient-text mb-6">Seguridad</h2>
          <ChangePasswordForm />
        </div>
      </div>
    </ProfileLayout>
  );
}