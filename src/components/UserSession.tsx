'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Actualizamos la forma de los datos del usuario que esperamos
interface User {
  name: string | null; // Añadimos el nombre
  email: string;
  role: string;
}

// Icono de usuario
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
    </svg>
);


export default function UserSession() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (user) {
    // Si hay un usuario, mostramos el enlace al perfil y el botón de cerrar sesión
    return (
      <div className="flex items-center gap-4">
        <Link href="/perfil" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors">
          <UserIcon />
          {/* Mostramos el nombre, y si no existe, el email como alternativa */}
          <span className="hidden sm:inline">{user.name || user.email}</span>
        </Link>
        <Button onClick={handleLogout} variant="outline" size="sm">
          Cerrar Sesión
        </Button>
      </div>
    );
  }

  // Si no hay usuario, mostramos el botón para iniciar sesión
  return (
    <Button asChild variant="ghost" size="sm">
      <Link href="/login">Iniciar Sesión</Link>
    </Button>
  );
}