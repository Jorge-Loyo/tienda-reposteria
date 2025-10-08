import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateRoles() {
  // Eliminar roles antiguos
  await prisma.role.deleteMany({});

  // Crear nuevos roles
  const roles = [
    { name: 'MASTER', description: 'Desarrollador con acceso completo al sistema' },
    { name: 'ADMINISTRADOR', description: 'Administrador general de la tienda' },
    { name: 'CLIENTE', description: 'Cliente regular' },
    { name: 'CLIENTE_VIP', description: 'Cliente VIP con beneficios especiales' },
    { name: 'MARKETING', description: 'Usuario con acceso a herramientas de marketing' },
    { name: 'OPERARIO', description: 'Usuario operativo para gestión de pedidos' }
  ];

  for (const role of roles) {
    await prisma.role.create({
      data: role
    });
  }

  console.log('✅ Roles actualizados exitosamente');
}

updateRoles()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });