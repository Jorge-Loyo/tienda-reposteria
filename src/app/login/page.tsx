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

  // Ya no necesitamos handleSubmit - solo usamos Cognito

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

          <div className="space-y-4">
            <CognitoLogin />
            
            <div className="text-center text-sm text-gray-600">
              <p>Usa tu cuenta de Casa Dulce Oriente</p>
              <p className="mt-2">¿Problemas para acceder? Contacta al administrador</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
