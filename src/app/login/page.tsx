'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import './login.css';
import { CognitoLogin } from '@/components/CognitoLogin';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      let message = 'Error de autenticación';
      switch (error) {
        case 'cognito_error':
          message = 'Error en la autenticación con AWS Cognito';
          break;
        case 'no_code':
          message = 'No se recibió código de autorización';
          break;
        case 'auth_failed':
          message = 'Falló la autenticación. Verifica tus credenciales';
          break;
        case 'invalid_credentials':
          message = 'Credenciales inválidas. Verifica tu email y contraseña';
          break;
        case 'account_disabled':
          message = 'Cuenta desactivada. Contacta al administrador';
          break;
        case 'missing_fields':
          message = 'El correo y la contraseña son requeridos';
          break;
        case 'invalid_email':
          message = 'Formato de email inválido';
          break;
        case 'server_error':
          message = 'Error interno del servidor. Inténtalo de nuevo';
          break;
        default:
          message = 'Error de autenticación';
      }
      alert(message);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    // No preventDefault - permitir submit normal para que funcione el redirect del servidor
  };

  return (
    <div className="login-container">
      <div className="login-bg">
        <div className="login-bg-circle-1"></div>
        <div className="login-bg-circle-2"></div>
        <div className="login-bg-circle-3"></div>
      </div>

      <div className="login-card-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <Image
                src="https://res.cloudinary.com/dnc0btnuv/image/upload/v1753391048/Logo_kewmlf.png"
                alt="Casa Dulce Oriente"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <h1 className="login-title">
              Iniciar Sesión
            </h1>
            <p className="login-subtitle">Accede a tu cuenta</p>
          </div>

          <form action="/api/auth/login" method="POST" onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="email" className="login-label">
                Correo Electrónico
              </label>
              <div className="login-input-container">
                <div className="login-input-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={isLoading}
                  placeholder="correo@ejemplo.com"
                  className="login-input"
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="password" className="login-label">
                Contraseña
              </label>
              <div className="login-input-container">
                <div className="login-input-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isLoading}
                  placeholder="••••••••"
                  className="login-input password"
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="login-submit">
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-4">
            <CognitoLogin />
          </div>
        </div>
      </div>
    </div>
  );
}
