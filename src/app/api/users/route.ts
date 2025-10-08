// src/app/api/users/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/logger';
import { sanitizeText, isValidEmail } from '@/lib/sanitizer';
import { getSessionData } from '@/lib/session';
import { rateLimit, getClientIP } from '@/lib/rate-limit';

// Función para obtener todos los usuarios
export async function GET() {
  try {
    // Verificar autenticación y permisos
    const session = await getSessionData();
    if (!session || !['ADMINISTRADOR', 'MASTER'].includes(session.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(users);
  } catch (error) {
    logError('Error al obtener usuarios', error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// Función para crear un nuevo usuario
export async function POST(request: Request) {
  try {
    // Verificar autenticación y permisos
    const session = await getSessionData();
    if (!session || !['ADMINISTRADOR', 'MASTER'].includes(session.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = rateLimit(`create-user:${clientIP}`, 5, 300000); // 5 usuarios por 5 minutos
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes de creación de usuarios' },
        { status: 429 }
      );
    }

    const { email, password, role, name, phoneNumber, address, identityCard, instagram } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Email, contraseña y rol son requeridos' }, { status: 400 });
    }

    // Validar y sanitizar datos
    const sanitizedEmail = sanitizeText(email);
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 });
    }

    const validRoles = ['MASTER', 'ADMINISTRADOR', 'CLIENTE', 'CLIENTE_VIP', 'MARKETING', 'OPERARIO'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Rol inválido' }, { status: 400 });
    }

    // Verificamos si el usuario ya existe
    const existingUser = await prisma.user.findUnique({ where: { email: sanitizedEmail } });
    if (existingUser) {
      return NextResponse.json({ error: 'El correo electrónico ya está en uso' }, { status: 409 });
    }

    // Encriptamos la contraseña
    const hashedPassword = await bcrypt.hash(password, 12); // Aumentamos el costo a 12

    const newUser = await prisma.user.create({
      data: {
        name: name ? sanitizeText(name) : null,
        email: sanitizedEmail,
        password: hashedPassword,
        role: role,
        phoneNumber: phoneNumber ? sanitizeText(phoneNumber) : null,
        address: address ? sanitizeText(address) : null,
        identityCard: identityCard ? sanitizeText(identityCard) : null,
        instagram: instagram ? sanitizeText(instagram) : null,
        isActive: true
      },
    });

    // Devolvemos el nuevo usuario sin la contraseña
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });

  } catch (error) {
    logError('Error al crear usuario', error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}