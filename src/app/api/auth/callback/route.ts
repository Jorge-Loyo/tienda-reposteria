import { NextRequest, NextResponse } from 'next/server';
import { verifyCognitoToken, getCognitoUser, getUserGroups } from '@/lib/cognito';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';
import db from '@/db/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  
  if (error) {
    return NextResponse.redirect(new URL('/login?error=cognito_error', request.url));
  }
  
  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  }
  
  try {
    // Intercambiar código por tokens
    const tokenResponse = await fetch('https://us-east-1szlfv5goz.auth.us-east-1.amazoncognito.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: '49g9h9j91atgnhh7ja4qsm2tkl',
        code: code,
        redirect_uri: 'https://18.235.130.104/api/auth/callback',
      }),
    });
    
    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens');
    }
    
    const tokens = await tokenResponse.json();
    const { access_token } = tokens;
    
    // Verificar el token de acceso
    const payload = await verifyCognitoToken(access_token);
    const username = payload.username as string;
    
    // Obtener información del usuario de Cognito
    const cognitoUser = await getCognitoUser(username);
    const userGroups = await getUserGroups(username);
    
    // Extraer email de los atributos
    const emailAttr = cognitoUser.UserAttributes?.find((attr: any) => attr.Name === 'email');
    const email = emailAttr?.Value;
    
    if (!email) {
      throw new Error('No email found in Cognito user');
    }
    
    // Determinar rol basado en grupos de Cognito
    let role = 'ORDERS_USER';
    if (userGroups.some((group: any) => group.GroupName === 'Administrators')) {
      role = 'ADMIN';
    } else if (userGroups.some((group: any) => group.GroupName === 'OrdersManagers')) {
      role = 'ORDERS_MANAGER';
    } else if (userGroups.some((group: any) => group.GroupName === 'VipUsers')) {
      role = 'VIP_USER';
    }
    
    // Buscar o crear usuario en la base de datos local
    let user = await db.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      user = await db.user.create({
        data: {
          email,
          name: username,
          password: 'COGNITO_USER',
          role,
          isActive: true,
        }
      });
    } else {
      if (user.role !== role) {
        user = await db.user.update({
          where: { id: user.id },
          data: { role }
        });
      }
    }
    
    // Crear JWT para la sesión local
    const jwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      cognitoUser: true
    };
    
    const sessionToken = sign(jwtPayload, process.env.JWT_SECRET!, {
      expiresIn: '7d'
    });
    
    // Establecer cookie de sesión
    const response = NextResponse.redirect(new URL('/admin', request.url));
    
    response.cookies.set('sessionToken', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    });
    
    return response;
    
  } catch (error) {
    console.error('Error processing Cognito callback:', error);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }
}