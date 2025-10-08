import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPermissions() {
  const permissions = [
    { name: 'MARKETING', description: 'Acceso al panel de marketing' },
    { name: 'PRODUCTS', description: 'Gestión de productos' },
    { name: 'ORDERS', description: 'Gestión de pedidos' },
    { name: 'USERS', description: 'Gestión de usuarios' },
    { name: 'CATEGORIES', description: 'Gestión de categorías' },
    { name: 'ZONES', description: 'Gestión de zonas de envío' },
    { name: 'BANNER', description: 'Gestión de banner' },
    { name: 'INSTAGRAM', description: 'Gestión de Instagram' }
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission
    });
  }

  console.log('✅ Permisos creados exitosamente');
}

seedPermissions()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });