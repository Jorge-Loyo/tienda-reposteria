// src/app/api/users/[id]/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getSessionData } from '@/lib/session'; // 1. Usamos nuestra función de sesión centralizada

const prisma = new PrismaClient();

// Definimos el tipo 'Role' y los roles disponibles, igual que en la página de usuarios.
type Role = 'ADMIN' | 'ORDERS_USER' | 'CLIENT' | 'CLIENT_VIP';
const availableRoles: Role[] = ['ADMIN', 'ORDERS_USER', 'CLIENT', 'CLIENT_VIP'];

// --- FUNCIÓN GET ---
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionData();
    // 2. Verificamos si el usuario tiene sesión iniciada y si es un ADMIN
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userId = Number(params.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "ID de usuario inválido." }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, role: true },
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
  role: Role;
}
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionData();
    // 3. También protegemos la ruta de actualización
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userIdToUpdate = Number(params.id);
    if (isNaN(userIdToUpdate)) return NextResponse.json({ error: "ID de usuario inválido." }, { status: 400 });

    const { role } = await request.json() as UpdateUserPayload;
    if (!role || !availableRoles.includes(role)) {
        return NextResponse.json({ error: "Rol inválido." }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
        where: { id: userIdToUpdate },
        data: { role },
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
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
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