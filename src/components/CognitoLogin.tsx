'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function CognitoLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCognitoLogin = () => {
    setIsLoading(true);
    const cognitoUrl = `https://lkfc0s.auth.us-east-1.amazoncognito.com/login?client_id=${process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=http://localhost:3000/api/auth/callback`;
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