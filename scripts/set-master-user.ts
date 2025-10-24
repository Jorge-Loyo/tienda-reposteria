import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function setMasterUser() {
  try {
    const hashedPassword = await bcrypt.hash('IFTS39404Ñ', 12);
    
    const user = await prisma.user.upsert({
      where: { email: 'sni15396@gmail.com' },
      update: {
        role: 'MASTER',
        password: hashedPassword
      },
      create: {
        email: 'sni15396@gmail.com',
        password: hashedPassword,
        role: 'MASTER',
        name: 'Master User',
        isActive: true
      }
    });
    
    console.log('✅ Usuario master creado/actualizado:', user.email);
  } catch (error) {
    console.error('Error creando/actualizando usuario master:', error);
  }
}

setMasterUser()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });