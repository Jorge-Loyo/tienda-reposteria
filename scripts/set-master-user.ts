import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setMasterUser() {
  try {
    const user = await prisma.user.update({
      where: { email: 'jorgenayati@gmail.com' },
      data: { role: 'MASTER' }
    });
    
    console.log('✅ Usuario jorgenayati@gmail.com actualizado a rol MASTER');
  } catch (error) {
    console.error('Error actualizando usuario:', error);
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