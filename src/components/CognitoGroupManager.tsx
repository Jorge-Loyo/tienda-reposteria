'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface CognitoGroup {
  GroupName?: string;
  Description?: string;
  Precedence?: number;
}

export function CognitoGroupManager() {
  const [groups, setGroups] = useState<CognitoGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGroup, setNewGroup] = useState({
    groupName: '',
    description: '',
    precedence: 0
  });

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const response = await fetch('/api/cognito/groups');
      if (response.ok) {
        const data = await response.json();
        setGroups(data.groups);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async () => {
    if (!newGroup.groupName) return;
    
    try {
      const response = await fetch('/api/cognito/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGroup)
      });
      
      if (response.ok) {
        setNewGroup({ groupName: '', description: '', precedence: 0 });
        loadGroups();
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  if (loading) {
    return <div className="p-4">Cargando grupos...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Gestión de Grupos AWS Cognito</h2>
      
      {/* Lista de grupos */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Grupos Existentes</h3>
        <div className="space-y-2">
          {groups.map((group) => (
            <div key={group.GroupName} className="flex justify-between items-center p-3 border rounded">
              <div>
                <span className="font-medium">{group.GroupName}</span>
                {group.Description && (
                  <p className="text-sm text-gray-600">{group.Description}</p>
                )}
              </div>
              <span className="text-sm text-gray-500">
                Precedencia: {group.Precedence || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Crear grupo */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Crear Nuevo Grupo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Nombre del grupo"
            value={newGroup.groupName}
            onChange={(e) => setNewGroup({...newGroup, groupName: e.target.value})}
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Descripción"
            value={newGroup.description}
            onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Precedencia"
            value={newGroup.precedence}
            onChange={(e) => setNewGroup({...newGroup, precedence: parseInt(e.target.value)})}
            className="border rounded px-3 py-2"
          />
        </div>
        <Button onClick={createGroup} className="mt-4">
          Crear Grupo
        </Button>
      </div>

      {/* Grupos recomendados */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Grupos Recomendados</h3>
        <ul className="space-y-2 text-sm">
          <li><strong>Administrators:</strong> Acceso completo</li>
          <li><strong>OrdersManagers:</strong> Gestión de pedidos</li>
          <li><strong>VipUsers:</strong> Usuarios VIP</li>
          <li><strong>OrdersUsers:</strong> Usuarios regulares</li>
        </ul>
      </div>
    </div>
  );
}