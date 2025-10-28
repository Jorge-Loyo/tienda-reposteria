'use client';

import { useState } from 'react';

export function CognitoLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCognitoLogin = () => {
    setIsLoading(true);
    
    const clientId = '49g9h9j91atgnhh7ja4qsm2tkl';
    const redirectUri = 'https://18.235.130.104/api/auth/callback';
    const loginUrl = `https://us-east-1szlfv5goz.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${redirectUri}`;

    console.log('Redirigiendo a:', loginUrl);
    window.location.href = loginUrl;
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