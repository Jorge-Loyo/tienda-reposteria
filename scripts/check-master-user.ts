import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkMasterUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'sni15396@gmail.com' }
    });
    
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }
    
    console.log('✅ Usuario encontrado:');
    console.log('- Email:', user.email);
    console.log('- Rol:', user.role);
    console.log('- Activo:', user.isActive);
    console.log('- Hash de contraseña:', user.password.substring(0, 20) + '...');
    
    // Verificar si la contraseña coincide
    const passwordMatch = await bcrypt.compare('IFTS39404Ñ', user.password);
    console.log('- Contraseña válida:', passwordMatch ? '✅' : '❌');
    
  } catch (error) {
    console.error('Error verificando usuario:', error);
  }
}

checkMasterUser()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });