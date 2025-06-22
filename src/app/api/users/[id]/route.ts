// src/app/api/users/[id]/route.ts
import { PrismaClient, Role } from '@prisma/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET as string);

// --- FUNCIÓN GET (Corregida) ---
// Obtiene los datos de un único usuario para la página de edición.
export async function GET(
  _request: Request, // Se nombra con guion bajo para indicar que no se usa.
  { params }: { params: { id: string } }
) {
  try {
    // Se accede a las cookies de la forma correcta para App Router.
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('sessionToken')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    if (payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acción no permitida' }, { status: 403 });
    }

    const userId = Number(params.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "ID de usuario inválido." }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, role: true }, // Solo devolvemos datos seguros.
    });
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (_error) {
    console.error("Error al obtener el usuario:", _error);
    return NextResponse.json({ error: "Token inválido o error interno." }, { status: 500 });
  }
}

// --- FUNCIÓN PUT (Corregida) ---
// Se añade una interfaz para dar un tipo seguro al body de la petición.
interface UpdateUserPayload {
  role: Role;
}
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('sessionToken')?.value;
    if (!sessionToken) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    if (payload.role !== 'ADMIN') return NextResponse.json({ error: 'Acción no permitida' }, { status: 403 });

    const userIdToUpdate = Number(params.id);
    if (isNaN(userIdToUpdate)) return NextResponse.json({ error: "ID de usuario inválido." }, { status: 400 });

    const { role } = await request.json() as UpdateUserPayload;
    if (!role || !Object.values(Role).includes(role)) {
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

// --- FUNCIÓN DELETE (Corregida) ---
export async function DELETE(
  _request: Request, // Se nombra con guion bajo.
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('sessionToken')?.value;
    if (!sessionToken) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    if (payload.role !== 'ADMIN') return NextResponse.json({ error: 'Acción no permitida' }, { status: 403 });

    const userIdToDelete = Number(params.id);
    if (isNaN(userIdToDelete)) return NextResponse.json({ error: "ID de usuario inválido." }, { status: 400 });
    
    const adminUserId = payload.userId as number;
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