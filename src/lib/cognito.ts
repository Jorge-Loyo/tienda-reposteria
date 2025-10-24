import { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminSetUserPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID!;

export async function createCognitoUser(email: string, password: string, name?: string) {
  try {
    await cognitoClient.send(new AdminCreateUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' },
        ...(name ? [{ Name: 'name', Value: name }] : [])
      ],
      MessageAction: 'SUPPRESS',
      TemporaryPassword: password
    }));

    await cognitoClient.send(new AdminSetUserPasswordCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
      Password: password,
      Permanent: true
    }));

    return { success: true };
  } catch (error) {
    console.error('Error creating Cognito user:', error);
    return { success: false, error };
  }
}