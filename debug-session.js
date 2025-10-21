const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugSession() {
  try {
    // Check user session data
    const user = await prisma.$queryRaw`SELECT id, email, role FROM "User" WHERE email = 'clientevip@casadulce.com'`;
    console.log('User from DB:', user);
    
    if (user.length > 0) {
      const userId = user[0].id;
      const vipCredit = await prisma.$queryRaw`SELECT * FROM vip_credits WHERE user_id = ${userId}`;
      console.log('VIP Credit for user:', vipCredit);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugSession();