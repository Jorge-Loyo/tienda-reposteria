'use client';

import { Button } from '@/components/ui/button';

export function CognitoLogin() {
  return (
    <Button 
      disabled
      className="w-full bg-gray-400 cursor-not-allowed"
    >
      AWS Cognito (En desarrollo)
    </Button>
  );
}