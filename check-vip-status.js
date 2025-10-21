const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkVipStatus() {
  try {
    const credits = await prisma.$queryRaw`
      SELECT vc.*, u.email 
      FROM vip_credits vc 
      JOIN "User" u ON vc.user_id = u.id
    `;
    console.log('All VIP Credits:', credits);
    
    // Check what the API returns
    const vipUsersQuery = await prisma.$queryRaw`
      SELECT 
        vc.id, vc.user_id, vc.credit_limit, vc.current_balance, vc.used_amount, 
        vc.is_active, vc.notes, vc.payment_due_date,
        u.id as user_id_check, u.name, u.email
      FROM vip_credits vc
      JOIN "User" u ON vc.user_id = u.id
      WHERE vc.is_active = true
    `;
    console.log('VIP Users API Query Result:', vipUsersQuery);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkVipStatus();