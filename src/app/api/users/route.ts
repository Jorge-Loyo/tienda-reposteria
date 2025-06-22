// src/app/api/users/route.ts
import { PrismaClient, Role } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Función para obtener todos los usuarios
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      // Excluimos la contraseña del resultado por seguridad
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// Función para crear un nuevo usuario
export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    // Verificamos si el usuario ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'El correo electrónico ya está en uso' }, { status: 409 });
    }

    // Encriptamos la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role as Role, // Nos aseguramos de que el rol sea del tipo correcto
      },
    });

    // Devolvemos el nuevo usuario sin la contraseña
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });

  } catch (error) {
    console.error("Error al crear usuario:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}