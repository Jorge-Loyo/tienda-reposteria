import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (code) {
    // Procesar código de autorización de Cognito
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  
  return NextResponse.redirect(new URL('/login', request.url));
}