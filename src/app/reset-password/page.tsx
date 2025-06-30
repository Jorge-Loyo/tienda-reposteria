// src/app/reset-password/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

// El formulario se extrae a su propio componente para poder usar useSearchParams
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!token) {
      setError('Token de reseteo no encontrado. Por favor, solicita un nuevo enlace.');
      return;
    }
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo resetear la contraseña.');
      }
      setMessage(data.message);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Establecer Nueva Contraseña</h1>
        </div>
        
        {message ? (
          <div className="text-center p-4 bg-green-50 text-green-800 rounded-md">
            <p>{message}</p>
            <Link href="/login" className="text-sm font-semibold text-indigo-600 hover:underline mt-4 block">
              Ir a Iniciar Sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Nueva Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm font-medium text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar Nueva Contraseña'}
            </Button>
          </form>
        )}
      </div>
  );
}

// La página principal envuelve el formulario en <Suspense>
// Esto es necesario en el App Router de Next.js para que useSearchParams funcione correctamente.
export default function ResetPasswordPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-128px)] bg-gray-50 px-4">
            <Suspense fallback={<div>Cargando...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
