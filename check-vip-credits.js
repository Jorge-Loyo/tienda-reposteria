const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkVipCredits() {
  try {
    const credits = await prisma.$queryRaw`SELECT * FROM vip_credits`;
    console.log('VIP Credits:', credits);
    
    const user = await prisma.$queryRaw`SELECT id, email FROM "User" WHERE email = 'clientevip@casadulce.com'`;
    console.log('User:', user);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkVipCredits();