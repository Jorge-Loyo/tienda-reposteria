// src/components/UserSession.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Definimos la forma de los datos del usuario que esperamos
interface User {
  email: string;
  role: string;
}

export default function UserSession() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Usamos useEffect para verificar el estado de la sesión cuando el componente se carga
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Hacemos una llamada a una API que nos dirá quién es el usuario actual
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch { // --- CORRECCIÓN APLICADA ---
        // Si hay cualquier error (de red, etc.), asumimos que no hay sesión.
        // No necesitamos el objeto de error, así que omitimos el parámetro.
        setUser(null);
      }
    };
    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      // Redirigimos al inicio y refrescamos para asegurar que el estado se actualice en toda la app
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (user) {
    // Si hay un usuario, mostramos el saludo y el botón de cerrar sesión
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 hidden sm:inline">Hola, {user.email}</span>
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