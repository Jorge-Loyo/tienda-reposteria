'use client';

import { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createRole, updateRole, deleteRole, updateRolePermissions } from '@/app/admin/users/roles/actions';

interface Role {
  id: number;
  name: string;
  description: string | null;
  userCount: number;
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

interface RolesManagerProps {
  roles: Role[];
  permissions: Permission[];
}

const ROLE_DISPLAY_NAMES: Record<string, string> = {
  'MASTER': 'Master',
  'ADMINISTRADOR': 'Administrador', 
  'CLIENTE': 'Cliente',
  'CLIENTE_VIP': 'Cliente VIP',
  'MARKETING': 'Marketing',
  'OPERARIO': 'Operario'
};

const getRoleDisplayName = (roleName: string): string => 
  ROLE_DISPLAY_NAMES[roleName] || roleName;

const getFormTitle = (isCreating: boolean, isEditing: boolean, showPermissions: boolean, selectedRole: Role | null): string => {
  if (isCreating) return 'Crear Nuevo Rol';
  if (isEditing) return `Editar Rol: ${getRoleDisplayName(selectedRole?.name || '')}`;
  if (showPermissions) return `Permisos: ${getRoleDisplayName(selectedRole?.name || '')}`;
  return 'Selecciona un rol';
};

const getButtonText = (isSubmitting: boolean, isCreating: boolean): string => {
  if (isSubmitting) return 'Guardando...';
  return isCreating ? 'Crear Rol' : 'Actualizar Rol';
};

export function RolesManager({ roles, permissions }: RolesManagerProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rolePermissions, setRolePermissions] = useState<number[]>([]);
  const [showPermissions, setShowPermissions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setIsEditing(true);
    setIsCreating(false);
    setShowPermissions(false);
  };

  const handlePermissions = (role: Role) => {
    setSelectedRole(role);
    setRolePermissions(role.permissions.map(p => p.permission.id));
    setShowPermissions(true);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setSelectedRole(null);
    setIsEditing(false);
    setIsCreating(true);
  };

  const handleCancel = () => {
    setSelectedRole(null);
    setIsEditing(false);
    setIsCreating(false);
    setShowPermissions(false);
  };

  const handlePermissionToggle = useCallback((permissionId: number) => {
    setRolePermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  }, []);

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    
    setIsSubmitting(true);
    setError(null);
    try {
      await updateRolePermissions(selectedRole.id, rolePermissions);
      window.location.reload();
    } catch (error) {
      setError('Error al guardar permisos. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (isCreating) {
        await createRole(formData);
      } else if (selectedRole) {
        await updateRole(selectedRole.id, formData);
      }
      window.location.reload();
    } catch (error) {
      setError(isCreating ? 'Error al crear el rol. Inténtalo de nuevo.' : 'Error al actualizar el rol. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (role: Role) => {
    if (role.userCount > 0) {
      setError('No se puede eliminar un rol que tiene usuarios asignados');
      return;
    }
    
    if (confirm(`¿Estás seguro de que quieres eliminar el rol "${getRoleDisplayName(role.name)}"?`)) {
      setError(null);
      try {
        await deleteRole(role.id);
        window.location.reload();
      } catch (error) {
        setError('Error al eliminar el rol. Inténtalo de nuevo.');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Roles Existentes</h3>
          <Button onClick={handleCreate} variant="gradient" size="sm">
            + Nuevo Rol
          </Button>
        </div>
        
        <div className="space-y-3">
          {roles.map((role) => (
            <div
              key={role.id}
              className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium">{getRoleDisplayName(role.name)}</div>
                  {role.description && (
                    <div className="text-sm text-gray-600 mt-1">{role.description}</div>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    {role.userCount} usuario{role.userCount !== 1 ? 's' : ''} asignado{role.userCount !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handlePermissions(role)}
                    variant="outline"
                    size="sm"
                  >
                    Permisos
                  </Button>
                  <Button
                    onClick={() => handleEdit(role)}
                    variant="outline"
                    size="sm"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDelete(role)}
                    variant="destructive"
                    size="sm"
                    disabled={role.userCount > 0}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">
          {getFormTitle(isCreating, isEditing, showPermissions, selectedRole)}
        </h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        
        {showPermissions ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
              {permissions.map((permission) => {
                const isChecked = rolePermissions.includes(permission.id);
                return (
                  <label
                    key={permission.id}
                    className="flex items-start space-x-3 p-3 bg-white rounded-lg border hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handlePermissionToggle(permission.id)}
                      className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{permission.name}</div>
                      {permission.description && (
                        <div className="text-sm text-gray-600">{permission.description}</div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSavePermissions}
                disabled={isSubmitting}
                variant="gradient"
                className="flex-1"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Permisos'}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (isCreating || isEditing) ? (
          <form action={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre del Rol</Label>
              <Input
                id="name"
                name="name"
                defaultValue={selectedRole?.name || ''}
                placeholder="Ej: Marketing, Operario"
                required
                className="mt-2"
              />
              <div className="text-xs text-gray-500 mt-1">
                Roles válidos: Master, Administrador, Cliente, Cliente VIP, Marketing, Operario
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={selectedRole?.description || ''}
                placeholder="Descripción del rol..."
                className="mt-2"
                rows={3}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="gradient"
                className="flex-1"
              >
                {getButtonText(isSubmitting, isCreating)}
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Selecciona un rol para editarlo, configurar permisos o crea uno nuevo
          </div>
        )}
      </div>
    </div>
  );
}