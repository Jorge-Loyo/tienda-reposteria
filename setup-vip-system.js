const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setupVipSystem() {
  try {
    // Tabla de créditos VIP
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS vip_credits (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES "User"(id),
        credit_limit DECIMAL(10,2) DEFAULT 0,
        current_balance DECIMAL(10,2) DEFAULT 0,
        used_amount DECIMAL(10,2) DEFAULT 0,
        is_active BOOLEAN DEFAULT false,
        assigned_by INTEGER REFERENCES "User"(id),
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_reset TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notes TEXT
      )
    `;

    // Historial de transacciones VIP
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS vip_transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES "User"(id),
        order_id INTEGER REFERENCES "Order"(id),
        amount DECIMAL(10,2),
        type VARCHAR(20), -- 'PURCHASE', 'RESET', 'ADJUSTMENT'
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Productos exclusivos VIP
    await prisma.$executeRaw`
      ALTER TABLE "Product" 
      ADD COLUMN IF NOT EXISTS is_vip_exclusive BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS early_access_hours INTEGER DEFAULT 0
    `;

    // Configuración VIP en club_config
    await prisma.$executeRaw`
      ALTER TABLE club_config 
      ADD COLUMN IF NOT EXISTS vip_early_access_hours INTEGER DEFAULT 24,
      ADD COLUMN IF NOT EXISTS vip_support_enabled BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS monthly_reset_day INTEGER DEFAULT 1
    `;

    console.log('✅ Sistema VIP creado exitosamente');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupVipSystem();