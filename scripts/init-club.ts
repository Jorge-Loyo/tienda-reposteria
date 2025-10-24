import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initClub() {
  try {
    // Crear configuración del club
    await prisma.clubConfig.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        pointsPerDollar: 1.0,
        bronzeThreshold: 0,
        silverThreshold: 100,
        goldThreshold: 500,
        platinumThreshold: 1000
      }
    });

    console.log('✅ Configuración del club inicializada');
  } catch (error) {
    console.error('Error inicializando club:', error);
  }
}

initClub()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });