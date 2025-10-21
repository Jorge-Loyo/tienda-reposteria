import { PrismaClient } from '@prisma/client';
import VipAssignForm from '@/components/VipAssignForm';

const prisma = new PrismaClient();

export default async function VipAssignPage({ params }: { params: { email: string } }) {

  const decodedEmail = decodeURIComponent(params.email);
  
  const user = await prisma.$queryRaw`
    SELECT id, name, email FROM "User" WHERE email = ${decodedEmail} AND role = 'CLIENTE_VIP'
  ` as any[];

  if (!user || user.length === 0) {
    redirect('/admin/club');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Asignar Crédito VIP</h1>
          <div className="mb-6 p-4 bg-purple-50 rounded-lg">
            <h2 className="font-semibold text-purple-900">Usuario Seleccionado</h2>
            <p className="text-purple-700">{user[0].name}</p>
            <p className="text-purple-600 text-sm">{user[0].email}</p>
          </div>
          <VipAssignForm user={user[0]} />
        </div>
      </div>
    </div>
  );
}