const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testAssignVip() {
  try {
    const email = 'clientevip@casadulce.com';
    const creditLimit = 500;
    const notes = 'Test assignment';
    
    // Find user
    const user = await prisma.$queryRaw`
      SELECT id FROM "User" WHERE email = ${email}
    `;
    
    console.log('User found:', user);
    
    if (user && user.length > 0) {
      const userRecord = user[0];
      
      // Check existing credit
      const existingCredit = await prisma.$queryRaw`
        SELECT id FROM vip_credits WHERE user_id = ${userRecord.id}
      `;
      
      console.log('Existing credit:', existingCredit);
      
      if (existingCredit && existingCredit.length > 0) {
        // Update
        await prisma.$executeRaw`
          UPDATE vip_credits SET
            credit_limit = ${creditLimit},
            current_balance = ${creditLimit},
            is_active = true,
            notes = ${notes},
            updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ${userRecord.id}
        `;
        console.log('Credit updated successfully');
      } else {
        // Insert
        await prisma.$executeRaw`
          INSERT INTO vip_credits (user_id, credit_limit, current_balance, used_amount, is_active, notes, created_at, updated_at)
          VALUES (${userRecord.id}, ${creditLimit}, ${creditLimit}, 0, true, ${notes}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `;
        console.log('Credit inserted successfully');
      }
      
      // Verify
      const finalCredit = await prisma.$queryRaw`
        SELECT * FROM vip_credits WHERE user_id = ${userRecord.id}
      `;
      console.log('Final credit:', finalCredit);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAssignVip();