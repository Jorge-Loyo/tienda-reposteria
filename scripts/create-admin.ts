// scripts/create-admin.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Asegúrate de cambiar esta contraseña por una que sea segura y recuerdes
  const email = 'admin@casadulce.com'; 
  const password = 'admin123'; 

  console.log(`Creando o actualizando el usuario administrador con el email: ${email}`);

  // Encriptamos la contraseña antes de guardarla
  const hashedPassword = await bcrypt.hash(password, 10);

  // Usamos 'upsert' para crear el usuario si no existe, o actualizarlo si ya existe.
  const admin = await prisma.user.upsert({
    where: { email: email },
    update: {
      password: hashedPassword,
    },
    create: {
      email: email,
      password: hashedPassword,
      role: 'ADMIN', // Asignamos el rol de Administrador
    },
  });

  console.log('¡Usuario administrador creado/actualizado con éxito!');
  console.log(admin);
}

main()
  .catch((e) => {
    console.error('Hubo un error al ejecutar el script:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Nos aseguramos de cerrar la conexión a la base de datos
    await prisma.$disconnect();
  });
