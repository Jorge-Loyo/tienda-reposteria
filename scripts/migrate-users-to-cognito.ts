import { PrismaClient } from '@prisma/client';
import { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminAddUserToGroupCommand } from '@aws-sdk/client-cognito-identity-provider';

const prisma = new PrismaClient();
const cognitoClient = new CognitoIdentityProviderClient({ region: 'us-east-1' });

const USER_POOL_ID = 'us-east-1_sZLFV5GOz';

// Mapeo de roles locales a grupos Cognito
const ROLE_TO_GROUP_MAP = {
  'ADMIN': 'Administrators',
  'ORDERS_MANAGER': 'OrdersManagers', 
  'VIP_USER': 'VipUsers',
  'ORDERS_USER': 'ClubUsers',
  'MARKETING': 'Marketing'
};

async function migrateUsersToCognito() {
  try {
    console.log('🚀 Iniciando migración de usuarios a AWS Cognito...');
    
    // Obtener todos los usuarios activos de la BD local
    const users = await prisma.user.findMany({
      where: { isActive: true }
    });

    console.log(`📊 Encontrados ${users.length} usuarios para migrar`);

    for (const user of users) {
      try {
        console.log(`👤 Migrando usuario: ${user.email}`);

        // Crear usuario en Cognito
        const createUserCommand = new AdminCreateUserCommand({
          UserPoolId: USER_POOL_ID,
          Username: user.email,
          UserAttributes: [
            { Name: 'email', Value: user.email },
            { Name: 'email_verified', Value: 'true' },
            { Name: 'name', Value: user.name || user.email }
          ],
          TemporaryPassword: 'TempPass123!',
          MessageAction: 'SUPPRESS' // No enviar email de bienvenida
        });

        await cognitoClient.send(createUserCommand);
        console.log(`✅ Usuario creado en Cognito: ${user.email}`);

        // Asignar al grupo correspondiente
        const cognitoGroup = ROLE_TO_GROUP_MAP[user.role as keyof typeof ROLE_TO_GROUP_MAP] || 'ClubUsers';
        
        const addToGroupCommand = new AdminAddUserToGroupCommand({
          UserPoolId: USER_POOL_ID,
          Username: user.email,
          GroupName: cognitoGroup
        });

        await cognitoClient.send(addToGroupCommand);
        console.log(`🏷️ Usuario asignado al grupo: ${cognitoGroup}`);

        // Marcar como migrado en BD local
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            // Agregar campo para marcar como migrado si no existe
            password: 'COGNITO_MIGRATED' 
          }
        });

      } catch (error: any) {
        if (error.name === 'UsernameExistsException') {
          console.log(`⚠️ Usuario ya existe en Cognito: ${user.email}`);
        } else {
          console.error(`❌ Error migrando ${user.email}:`, error.message);
        }
      }
    }

    console.log('🎉 Migración completada');
    
  } catch (error) {
    console.error('💥 Error en la migración:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar migración
migrateUsersToCognito().catch(console.error);