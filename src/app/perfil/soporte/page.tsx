import { getSessionData } from '@/lib/session';
import { redirect } from 'next/navigation';
import ProfileLayout from '@/components/ProfileLayout';
import SoporteForm from '@/components/SoporteForm';
import MisReportes from '@/components/MisReportes';

export default async function SoportePage() {
  const session = await getSessionData();
  if (!session) {
    redirect('/login');
  }

  return (
    <ProfileLayout currentPage="soporte">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold gradient-text mb-4">Soporte Técnico</h1>
        <p className="text-gray-600">Reporta incidentes y obtén ayuda de nuestro equipo</p>
      </div>
      
      <div className="space-y-8">
        <SoporteForm />

        <MisReportes />
      </div>
    </ProfileLayout>
  );
}