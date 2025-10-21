const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updatePrizesSchema() {
  try {
    // Agregar nuevas columnas para objetos de premios
    await prisma.$executeRaw`
      ALTER TABLE club_config 
      ADD COLUMN IF NOT EXISTS first_prize_object TEXT,
      ADD COLUMN IF NOT EXISTS second_prize_object TEXT,
      ADD COLUMN IF NOT EXISTS third_prize_object TEXT
    `;

    // Inicializar con valores por defecto
    await prisma.$executeRaw`
      UPDATE club_config SET 
        first_prize_object = '{"type":"money","amount":200,"image":"","description":"Vale de $200 para compras"}',
        second_prize_object = '{"type":"money","amount":100,"image":"","description":"Vale de $100 para compras"}',
        third_prize_object = '{"type":"money","amount":50,"image":"","description":"Vale de $50 para compras"}'
      WHERE id = 1 AND first_prize_object IS NULL
    `;

    console.log('✅ Schema de premios actualizado');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePrizesSchema();