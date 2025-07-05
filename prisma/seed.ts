// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

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
    await prisma.category.create({
      data: {
        name: categoryName,
      },
    });
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