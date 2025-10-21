const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addPaymentDueDateColumn() {
  try {
    await prisma.$executeRaw`
      ALTER TABLE vip_credits 
      ADD COLUMN IF NOT EXISTS payment_due_date TIMESTAMP
    `;
    console.log('Column payment_due_date added successfully');
  } catch (error) {
    console.error('Error adding column:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addPaymentDueDateColumn();