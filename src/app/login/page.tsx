'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import './login.css';
import { CognitoLogin } from '@/components/CognitoLogin';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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
      setErrorMessage(message);
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

          {errorMessage && (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fca5a5',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
              {errorMessage}
            </div>
          )}

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
