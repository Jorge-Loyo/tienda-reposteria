import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedRoles() {
  const roles = [
    { name: 'ADMIN', description: 'Administrador con acceso completo' },
    { name: 'ORDERS_USER', description: 'Usuario con acceso a gestión de pedidos' },
    { name: 'MARKETING', description: 'Usuario con acceso a herramientas de marketing' },
    { name: 'CLIENT', description: 'Cliente regular' },
    { name: 'CLIENT_VIP', description: 'Cliente VIP con beneficios especiales' }
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role
    });
  }

  console.log('✅ Roles creados exitosamente');
}

seedRoles()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });