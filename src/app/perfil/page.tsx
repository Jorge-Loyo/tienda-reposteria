import { getSessionData } from '@/lib/session';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import ChangePasswordForm from '@/components/ChangePasswordForm';
import UpdateProfileForm from '@/components/UpdateProfileForm';
import ProfileLayout from '@/components/ProfileLayout';
import './perfil.css';

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
      <div className="perfil-header">
        <h1 className="perfil-title gradient-text">Mi Perfil</h1>
        <p className="perfil-subtitle">Gestiona tu información personal y configuración</p>
      </div>
      
      <div className="perfil-content">
        <div className="perfil-card glass">
          <h2 className="perfil-card-title gradient-text">Información Personal</h2>
          <UpdateProfileForm user={user} />
        </div>

        <div className="perfil-card glass">
          <h2 className="perfil-card-title gradient-text">Seguridad</h2>
          <ChangePasswordForm />
        </div>
      </div>
    </ProfileLayout>
  );
}