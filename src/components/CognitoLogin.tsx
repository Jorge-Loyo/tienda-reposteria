'use client';

import { useState } from 'react';
// Removido import del Button component

export function CognitoLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCognitoLogin = () => {
    setIsLoading(true);
    // URL directa y simple para probar
    const cognitoUrl = 'https://us-east-1szlfv5goz.auth.us-east-1.amazoncognito.com/login?client_id=49g9h9j91atgnhh7ja4qsm2tkl&response_type=code&scope=email+openid+profile&redirect_uri=https://18.235.130.104/api/auth/callback';
    console.log('Redirigiendo a:', cognitoUrl);
    window.location.href = cognitoUrl;
  };

  return (
    <button 
      onClick={handleCognitoLogin}
      disabled={isLoading}
      style={{
        width: '100%',
        padding: '12px',
        backgroundColor: '#ea580c',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.7 : 1
      }}
    >
      {isLoading ? 'Redirigiendo...' : '🔐 Iniciar sesión con AWS Cognito'}
    </button>
  );
}