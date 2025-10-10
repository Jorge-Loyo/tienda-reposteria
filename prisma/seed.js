// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Crear usuario master
  const hashedPassword = await bcrypt.hash('258025', 10);
  
  try {
    await prisma.user.upsert({
      where: { email: 'jorgenayati@gmail.com' },
      update: {},
      create: {
        email: 'jorgenayati@gmail.com',
        name: 'Jorge Nayati',
        password: hashedPassword,
        role: 'MASTER',
        isActive: true
      }
    });
    console.log('Usuario master creado/actualizado');
  } catch (error) {
    console.log('Usuario master ya existe o error:', error);
  }

  const categories = [
    'Chantilly',
    'Colorantes',
    'Encajes de azúcar comestibles',
    'Polvos',
    'Arequipes',
    'Utensilios',
    'Sprinkles',
    'Moldes',
    'Toppers',
    'Cajas y envases',
    'Discos',
  ];

  for (const categoryName of categories) {
    try {
      await prisma.category.upsert({
        where: { name: categoryName },
        update: {},
        create: { name: categoryName }
      });
    } catch (error) {
      console.log(`Categoría ${categoryName} ya existe`);
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });