const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updatePointsValue() {
  try {
    await prisma.$executeRaw`UPDATE club_config SET points_per_dollar = 5.00 WHERE id = 1`;
    console.log('✅ Valor actualizado: $5 para ganar 1 punto');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePointsValue();