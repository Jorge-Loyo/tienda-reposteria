// src/app/api/users/[id]/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getSessionData } from '@/lib/session'; // 1. Usamos nuestra función de sesión centralizada
import bcrypt from 'bcrypt'; 
const prisma = new PrismaClient();

// Definimos el tipo 'Role' y los roles disponibles (incluyendo roles antiguos temporalmente)
type Role = 'MASTER' | 'ADMINISTRADOR' | 'CLIENTE' | 'CLIENTE_VIP' | 'MARKETING' | 'OPERARIO' | 'ADMIN' | 'ORDERS_USER' | 'CLIENT' | 'CLIENT_VIP';
const availableRoles: Role[] = ['MASTER', 'ADMINISTRADOR', 'CLIENTE', 'CLIENTE_VIP', 'MARKETING', 'OPERARIO', 'ADMIN', 'ORDERS_USER', 'CLIENT', 'CLIENT_VIP'];

// --- FUNCIÓN GET ---
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionData();
    // 2. Verificamos si el usuario tiene sesión iniciada
    if (!session) {
      return NextResponse.json({ error: 'No autorizado - Sin sesión' }, { status: 401 });
    }
    
    // Verificar si tiene permisos
    const allowedRoles = ['ADMINISTRADOR', 'MASTER', 'ADMIN', 'ORDERS_USER'];
    if (!allowedRoles.includes(session.role)) {
      return NextResponse.json({ 
        error: `No autorizado - Rol '${session.role}' no permitido. Roles permitidos: ${allowedRoles.join(', ')}` 
      }, { status: 401 });
    }

    const userId = Number(params.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "ID de usuario inválido." }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        name: true,
        email: true, 
        role: true,
        phoneNumber: true,
        address: true,
        identityCard: true,
        instagram: true,
        avatarUrl: true
      },
    });
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (_error) {
    console.error("Error al obtener el usuario:", _error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}

// --- FUNCIÓN PUT ---
interface UpdateUserPayload {
  name?: string | null;
  role: Role;
  password?: string;
  phoneNumber?: string | null;
  address?: string | null;
  identityCard?: string | null;
  instagram?: string | null;
  avatarUrl?: string | null;
}
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionData();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado - Sin sesión' }, { status: 401 });
    }
    
    // Verificar si tiene permisos
    const allowedRoles = ['ADMINISTRADOR', 'MASTER', 'ADMIN', 'ORDERS_USER'];
    if (!allowedRoles.includes(session.role)) {
      return NextResponse.json({ 
        error: `No autorizado - Rol '${session.role}' no permitido. Roles permitidos: ${allowedRoles.join(', ')}` 
      }, { status: 401 });
    }

    const userIdToUpdate = Number(params.id);
    if (isNaN(userIdToUpdate)) return NextResponse.json({ error: "ID de usuario inválido." }, { status: 400 });

    const { name, role, password, phoneNumber, address, identityCard, instagram, avatarUrl } = await request.json() as UpdateUserPayload;
    if (!role || !availableRoles.includes(role)) {
        return NextResponse.json({ error: "Rol inválido." }, { status: 400 });
    }

    // 3. Preparamos los datos a actualizar
    const dataToUpdate: { 
      name?: string | null;
      role: Role; 
      password?: string;
      phoneNumber?: string | null;
      address?: string | null;
      identityCard?: string | null;
      instagram?: string | null;
      avatarUrl?: string | null;
    } = { 
      name,
      role,
      phoneNumber,
      address,
      identityCard,
      instagram,
      avatarUrl
    };

    // 4. Si se proporcionó una nueva contraseña, la encriptamos y la añadimos a los datos a actualizar
    if (password && password.length > 0) {
        if (password.length < 6) {
            return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres." }, { status: 400 });
        }
        dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
        where: { id: userIdToUpdate },
        data: dataToUpdate,
    });
    const { password: _, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword);
  } catch (_error) {
     console.error("Error al actualizar el usuario:", _error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}

// --- FUNCIÓN DELETE ---
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionData();
    // 4. Y también la ruta para eliminar
    if (!session) {
      return NextResponse.json({ error: 'No autorizado - Sin sesión' }, { status: 401 });
    }
    
    // Verificar si tiene permisos
    const allowedRoles = ['ADMINISTRADOR', 'MASTER', 'ADMIN', 'ORDERS_USER'];
    if (!allowedRoles.includes(session.role)) {
      return NextResponse.json({ 
        error: `No autorizado - Rol '${session.role}' no permitido. Roles permitidos: ${allowedRoles.join(', ')}` 
      }, { status: 401 });
    }

    const userIdToDelete = Number(params.id);
    if (isNaN(userIdToDelete)) return NextResponse.json({ error: "ID de usuario inválido." }, { status: 400 });
    
    const adminUserId = session.userId;
    if (adminUserId === userIdToDelete) return NextResponse.json({ error: 'No puedes eliminar tu propia cuenta.' }, { status: 400 });

    await prisma.user.delete({
      where: { id: userIdToDelete },
    });
    
    return new NextResponse(null, { status: 204 });
  } catch (_error) {
    console.error("Error al eliminar el usuario:", _error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}