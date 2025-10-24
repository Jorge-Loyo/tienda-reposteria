import { NextRequest, NextResponse } from 'next/server';
import { listGroups, createGroup, addUserToGroup } from '@/lib/cognito';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export const dynamic = 'force-dynamic';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function verifyAdmin(request: NextRequest) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('sessionToken')?.value;
  
  if (!sessionToken) {
    return null;
  }
  
  try {
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    return payload.role === 'ADMIN' ? payload : null;
  } catch {
    return null;
  }
}

// Listar grupos
export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const groups = await listGroups();
    return NextResponse.json({ groups });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to list groups' }, { status: 500 });
  }
}

// Crear grupo
export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { groupName, description, precedence } = await request.json();
    
    if (!groupName) {
      return NextResponse.json({ error: 'Group name is required' }, { status: 400 });
    }
    
    const group = await createGroup(groupName, description, precedence);
    return NextResponse.json({ group });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
  }
}

// Agregar usuario a grupo
export async function PUT(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { username, groupName } = await request.json();
    
    if (!username || !groupName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    await addUserToGroup(username, groupName);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add user to group' }, { status: 500 });
  }
}