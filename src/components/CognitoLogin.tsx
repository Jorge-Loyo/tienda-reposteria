'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function CognitoLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCognitoLogin = () => {
    setIsLoading(true);
    const clientId = '49g9h9j91atgnhh7ja4qsm2tkl';
    const redirectUri = encodeURIComponent('https://18.235.130.104/api/auth/callback');
    const cognitoUrl = `https://us-east-1szlfv5goz.auth.us-east-1.amazoncognito.com/login?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${redirectUri}`;
    window.location.href = cognitoUrl;
  };

  return (
    <Button 
      onClick={handleCognitoLogin}
      disabled={isLoading}
      className="w-full bg-orange-600 hover:bg-orange-700"
    >
      {isLoading ? 'Redirigiendo...' : 'Iniciar sesión con AWS Cognito'}
    </Button>
  );
}