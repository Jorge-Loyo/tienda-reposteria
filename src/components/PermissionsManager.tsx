'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { updateUserPermissions } from '@/app/admin/users/permissions/actions';

interface User {
  id: number;
  name: string | null;
  email: string;
  role: string;
  permissions: {
    permission: {
      id: number;
      name: string;
    };
  }[];
}

interface Permission {
  id: number;
  name: string;
  description: string | null;
}

interface PermissionsManagerProps {
  users: User[];
  permissions: Permission[];
}

export function PermissionsManager({ users, permissions }: PermissionsManagerProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userPermissions, setUserPermissions] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setUserPermissions(user.permissions.map(p => p.permission.id));
  };

  const handlePermissionToggle = (permissionId: number) => {
    setUserPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = async () => {
    if (!selectedUser) return;
    
    setIsSubmitting(true);
    try {
      await updateUserPermissions(selectedUser.id, userPermissions);
      window.location.reload();
    } catch (error) {
      console.error('Error actualizando permisos:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Seleccionar Usuario</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedUser?.id === user.id
                  ? 'bg-pink-50 border-pink-300'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium">{user.name || 'Sin nombre'}</div>
              <div className="text-sm text-gray-600">{user.email}</div>
              <div className="text-xs text-gray-500 mt-1">
                Rol: {user.role} | Permisos: {user.permissions.length}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">
          Permisos {selectedUser && `para ${selectedUser.name || selectedUser.email}`}
        </h3>
        
        {selectedUser ? (
          <div className="space-y-4">
            <div className="space-y-3">
              {permissions.map((permission) => (
                <label
                  key={permission.id}
                  className="flex items-center space-x-3 p-3 bg-white rounded-lg border"
                >
                  <input
                    type="checkbox"
                    checked={userPermissions.includes(permission.id)}
                    onChange={() => handlePermissionToggle(permission.id)}
                    className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{permission.name}</div>
                    {permission.description && (
                      <div className="text-sm text-gray-600">{permission.description}</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
            
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              variant="gradient"
              className="w-full"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Permisos'}
            </Button>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Selecciona un usuario para configurar sus permisos
          </div>
        )}
      </div>
    </div>
  );
}