import { 
  CognitoIdentityProviderClient, 
  AdminGetUserCommand, 
  AdminCreateUserCommand,
  AdminAddUserToGroupCommand,
  AdminRemoveUserFromGroupCommand,
  AdminListGroupsForUserCommand,
  CreateGroupCommand,
  ListGroupsCommand,
  AdminSetUserPasswordCommand,
  AdminDeleteUserCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

// Verificador JWT para tokens de Cognito
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID!,
  tokenUse: 'access',
  clientId: process.env.COGNITO_CLIENT_ID!,
});

export async function verifyCognitoToken(token: string) {
  try {
    const payload = await verifier.verify(token);
    return payload;
  } catch (error) {
    console.error('Error verifying Cognito token:', error);
    throw error;
  }
}

export async function getCognitoUser(username: string) {
  const command = new AdminGetUserCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: username,
  });
  
  try {
    const response = await cognitoClient.send(command);
    return response;
  } catch (error) {
    console.error('Error getting Cognito user:', error);
    throw error;
  }
}

export async function addUserToGroup(username: string, groupName: string) {
  const command = new AdminAddUserToGroupCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: username,
    GroupName: groupName,
  });
  
  try {
    await cognitoClient.send(command);
    return { success: true };
  } catch (error) {
    console.error('Error adding user to group:', error);
    throw error;
  }
}

export async function getUserGroups(username: string) {
  const command = new AdminListGroupsForUserCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: username,
  });
  
  try {
    const response = await cognitoClient.send(command);
    return response.Groups || [];
  } catch (error) {
    console.error('Error getting user groups:', error);
    throw error;
  }
}

export async function createGroup(groupName: string, description?: string, precedence?: number) {
  const command = new CreateGroupCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    GroupName: groupName,
    Description: description,
    Precedence: precedence,
  });
  
  try {
    const response = await cognitoClient.send(command);
    return response;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
}

export async function listGroups() {
  const command = new ListGroupsCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
  });
  
  try {
    const response = await cognitoClient.send(command);
    return response.Groups || [];
  } catch (error) {
    console.error('Error listing groups:', error);
    throw error;
  }
}

// Mapeo de roles de la aplicación a grupos de Cognito
export const COGNITO_GROUPS = {
  ADMIN: 'Administrators',
  ORDERS_MANAGER: 'OrdersManagers', 
  VIP_USER: 'VipUsers',
  ORDERS_USER: 'OrdersUsers'
} as const;