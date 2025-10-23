// src/app/reset-password/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import './reset-password.css';

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
      <div className="reset-password-card">
        <div className="reset-password-header">
          <h1 className="reset-password-title">Establecer Nueva Contraseña</h1>
        </div>
        
        {message ? (
          <div className="reset-password-success">
            <p>{message}</p>
            <Link href="/login" className="reset-password-success-link">
              Ir a Iniciar Sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="reset-password-form">
            <div className="reset-password-field">
              <Label htmlFor="password">Nueva Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="reset-password-field">
              <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="reset-password-error">{error}</p>}
            <Button type="submit" className="reset-password-submit" disabled={isLoading}>
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
        <div className="reset-password-container">
            <Suspense fallback={<div className="reset-password-loading">Cargando...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
