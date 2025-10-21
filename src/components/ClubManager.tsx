'use client';

import { useState } from 'react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trophy, Medal, Award, Settings, Users, Upload, X } from 'lucide-react';

interface PrizeObject {
  type: 'money' | 'product';
  amount?: number;
  image: string;
  description: string;
}

interface ClubConfig {
  points_per_dollar: number;
  first_prize: number;
  second_prize: number;
  third_prize: number;
  first_prize_object?: string;
  second_prize_object?: string;
  third_prize_object?: string;
  bronze_threshold: number;
  silver_threshold: number;
  gold_threshold: number;
  bronze_cashback: number;
  silver_cashback: number;
  gold_cashback: number;
}

interface TopUser {
  name: string;
  email: string;
  monthly_points: number;
  total_points: number;
  level: string;
  position: number;
}

interface ClubManagerProps {
  config: ClubConfig;
  topUsers: TopUser[];
}

export function ClubManager({ config, topUsers }: ClubManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(config);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('config');
  
  // Check URL params to auto-switch tab and reload
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('tab') === 'vip') {
      setActiveTab('vip');
      loadVipUsers();
      loadAllVipUsers();
    }
  }, []);
  const [vipUsers, setVipUsers] = useState([]);
  const [allVipUsers, setAllVipUsers] = useState([]);
  const [showVipForm, setShowVipForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [vipNotes, setVipNotes] = useState('');
  const [paymentDueDate, setPaymentDueDate] = useState('');
  const [editingVip, setEditingVip] = useState(null);
  const [newCreditAmount, setNewCreditAmount] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [updateMessageType, setUpdateMessageType] = useState<'success' | 'error' | ''>('');
  const [prizeObjects, setPrizeObjects] = useState({
    first: config.first_prize_object ? JSON.parse(config.first_prize_object) : { type: 'money', amount: 200, image: '', description: 'Vale de $200' },
    second: config.second_prize_object ? JSON.parse(config.second_prize_object) : { type: 'money', amount: 100, image: '', description: 'Vale de $100' },
    third: config.third_prize_object ? JSON.parse(config.third_prize_object) : { type: 'money', amount: 50, image: '', description: 'Vale de $50' }
  });
  const [uploading, setUploading] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, position: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(position);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'club_prizes');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await response.json();
      
      setPrizeObjects(prev => ({
        ...prev,
        [position]: { ...prev[position as keyof typeof prev], image: data.secure_url }
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/club/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          first_prize_object: JSON.stringify(prizeObjects.first),
          second_prize_object: JSON.stringify(prizeObjects.second),
          third_prize_object: JSON.stringify(prizeObjects.third)
        })
      });
      
      if (response.ok) {
        setIsEditing(false);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPodiumIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-gray-600">#{position}</span>;
    }
  };

  const loadVipUsers = async () => {
    try {
      const response = await fetch('/api/club/vip-users');
      const data = await response.json();
      setVipUsers(data.users || []);
    } catch (error) {
      console.error('Error loading VIP users:', error);
    }
  };

  const loadAllVipUsers = async () => {
    try {
      const response = await fetch('/api/club/all-vip-users');
      const data = await response.json();
      setAllVipUsers(data.users || []);
    } catch (error) {
      console.error('Error loading all VIP users:', error);
    }
  };

  const handleVipAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/club/assign-vip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser,
          creditLimit: parseFloat(creditAmount),
          notes: vipNotes,
          paymentDueDate: paymentDueDate || null
        })
      });
      
      if (response.ok) {
        setShowVipForm(false);
        setSelectedUser('');
        setCreditAmount('');
        setVipNotes('');
        setPaymentDueDate('');
        loadVipUsers();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateVipCredit = async (vipId: string) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/club/update-vip-credit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vipId,
          creditLimit: parseFloat(newCreditAmount),
          paymentDueDate: newDueDate || null
        })
      });
      
      if (response.ok) {
        setEditingVip(null);
        setNewCreditAmount('');
        setNewDueDate('');
        loadVipUsers();
        setUpdateMessage('Crédito VIP actualizado exitosamente');
        setUpdateMessageType('success');
        setTimeout(() => setUpdateMessage(''), 3000);
      } else {
        const error = await response.json();
        setUpdateMessage(`Error: ${error.error || 'Error desconocido'}`);
        setUpdateMessageType('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setUpdateMessage(`Error de conexión: ${error.message || 'Error desconocido'}`);
      setUpdateMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'config' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Configuración Club
        </button>
        <button
          onClick={() => { setActiveTab('vip'); loadVipUsers(); loadAllVipUsers(); }}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'vip' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Gestión VIP
        </button>
      </div>

      {activeTab === 'config' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuración del Club
              </h3>
              <Button 
                onClick={() => setIsEditing(!isEditing)} 
                variant={isEditing ? "outline" : "default"}
                size="sm"
              >
                {isEditing ? 'Cancelar' : 'Editar'}
              </Button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-6">
                  <div>
                    <Label>$ para ganar 1 punto</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.points_per_dollar}
                      onChange={(e) => setFormData({...formData, points_per_dollar: parseFloat(e.target.value)})}
                      placeholder="Ej: 5 (gastar $5 = 1 punto)"
                    />
                  </div>
                  
                  {['first', 'second', 'third'].map((position, index) => {
                    const prize = prizeObjects[position as keyof typeof prizeObjects];
                    const labels = ['1er Lugar 🥇', '2do Lugar 🥈', '3er Lugar 🥉'];
                    
                    return (
                      <div key={position} className="border rounded-lg p-4 space-y-3">
                        <h4 className="font-medium">{labels[index]}</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Tipo</Label>
                            <select 
                              className="w-full p-2 border rounded"
                              value={prize.type}
                              onChange={(e) => setPrizeObjects(prev => ({
                                ...prev,
                                [position]: { ...prize, type: e.target.value as 'money' | 'product' }
                              }))}
                            >
                              <option value="money">Dinero</option>
                              <option value="product">Producto</option>
                            </select>
                          </div>
                          {prize.type === 'money' && (
                            <div>
                              <Label>Monto ($)</Label>
                              <Input
                                type="number"
                                value={prize.amount || 0}
                                onChange={(e) => setPrizeObjects(prev => ({
                                  ...prev,
                                  [position]: { ...prize, amount: parseFloat(e.target.value) }
                                }))}
                              />
                            </div>
                          )}
                        </div>
                        <div>
                          <Label>Imagen del Premio</Label>
                          <div className="space-y-2">
                            {prize.image ? (
                              <div className="relative inline-block">
                                <img src={prize.image} alt="Premio" className="w-20 h-20 object-cover rounded border" />
                                <button
                                  type="button"
                                  onClick={() => setPrizeObjects(prev => ({
                                    ...prev,
                                    [position]: { ...prize, image: '' }
                                  }))}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ) : (
                              <label className={`flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${uploading === position ? 'opacity-50' : ''}`}>
                                <div className="flex flex-col items-center justify-center">
                                  <Upload className="w-6 h-6 text-gray-400" />
                                  <p className="text-xs text-gray-500">
                                    {uploading === position ? 'Subiendo...' : 'Subir imagen'}
                                  </p>
                                </div>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, position)}
                                  disabled={uploading === position}
                                />
                              </label>
                            )}
                          </div>
                        </div>
                        <div>
                          <Label>Descripción</Label>
                          <Input
                            value={prize.description}
                            onChange={(e) => setPrizeObjects(prev => ({
                              ...prev,
                              [position]: { ...prize, description: e.target.value }
                            }))}
                            placeholder="Descripción del premio"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Niveles y Cashback</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Bronce (pts)</Label>
                      <Input
                        type="number"
                        value={formData.bronze_threshold}
                        onChange={(e) => setFormData({...formData, bronze_threshold: parseInt(e.target.value)})}
                      />
                      <Label className="text-xs">Cashback %</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.bronze_cashback}
                        onChange={(e) => setFormData({...formData, bronze_cashback: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>Plata (pts)</Label>
                      <Input
                        type="number"
                        value={formData.silver_threshold}
                        onChange={(e) => setFormData({...formData, silver_threshold: parseInt(e.target.value)})}
                      />
                      <Label className="text-xs">Cashback %</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.silver_cashback}
                        onChange={(e) => setFormData({...formData, silver_cashback: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>Oro (pts)</Label>
                      <Input
                        type="number"
                        value={formData.gold_threshold}
                        onChange={(e) => setFormData({...formData, gold_threshold: parseInt(e.target.value)})}
                      />
                      <Label className="text-xs">Cashback %</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.gold_cashback}
                        onChange={(e) => setFormData({...formData, gold_cashback: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">$ para ganar 1 punto</p>
                    <p className="text-xl font-bold">${config.points_per_dollar}</p>
                  </div>
                  
                  {[prizeObjects.first, prizeObjects.second, prizeObjects.third].map((prize, index) => {
                    const colors = ['bg-yellow-50', 'bg-gray-100', 'bg-amber-50'];
                    const labels = ['🥇 Primer lugar', '🥈 Segundo lugar', '🥉 Tercer lugar'];
                    
                    return (
                      <div key={index} className={`p-4 ${colors[index]} rounded-lg`}>
                        <div className="flex items-center gap-3">
                          {prize.image && (
                            <img src={prize.image} alt="Premio" className="w-12 h-12 object-cover rounded" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">{labels[index]}</p>
                            <p className="font-bold">
                              {prize.type === 'money' ? `$${prize.amount}` : prize.description}
                            </p>
                            <p className="text-xs text-gray-500">{prize.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Ranking del Mes
            </h3>
            
            <div className="space-y-3">
              {topUsers.map((user) => (
                <div 
                  key={user.email}
                  className={`p-4 rounded-lg border ${
                    user.position <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getPodiumIcon(user.position)}
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{user.monthly_points} pts</p>
                      <p className="text-xs text-gray-500">Nivel: {user.level}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-6">Gestión Casa Dulce VIP</h3>
          </div>



          {updateMessage && (
            <div className={`mb-4 p-4 rounded-lg ${
              updateMessageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {updateMessage}
            </div>
          )}
          
          <div>
            <h4 className="font-medium mb-4 text-gray-700">Todos los Usuarios VIP</h4>
            <div className="space-y-3">
              {allVipUsers.map((user: any) => {
                const vipCredit = vipUsers.find((vip: any) => vip.user?.email === user.email);
                
                return (
                  <div key={user.email} className={`p-4 rounded-lg border ${
                    vipCredit ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200' : 'bg-gray-50'
                  }`}>
                    {vipCredit && editingVip === vipCredit.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Nuevo Límite de Crédito ($)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={newCreditAmount}
                              onChange={(e) => setNewCreditAmount(e.target.value)}
                              placeholder={vipCredit.credit_limit.toString()}
                            />
                          </div>
                          <div>
                            <Label>Nuevo Día de Corte Mensual</Label>
                            <select 
                              className="w-full p-2 border rounded"
                              value={newDueDate}
                              onChange={(e) => setNewDueDate(e.target.value)}
                            >
                              <option value="">Seleccionar día...</option>
                              <option value="1">Día 1 de cada mes</option>
                              <option value="5">Día 5 de cada mes</option>
                              <option value="10">Día 10 de cada mes</option>
                              <option value="15">Día 15 de cada mes</option>
                              <option value="20">Día 20 de cada mes</option>
                              <option value="25">Día 25 de cada mes</option>
                              <option value="ultimo">Ultimo día del mes</option>
                              <option value="habil">Primer día hábil del mes</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleUpdateVipCredit(vipCredit.id)}
                            disabled={isSubmitting}
                            size="sm"
                          >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setEditingVip(null)}
                            size="sm"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          {vipCredit ? (
                            <>
                              <p className="text-xs text-purple-600 mt-1">{vipCredit.notes}</p>
                              <p className="text-xs text-green-600 mt-1">
                                Crédito: ${vipCredit.credit_limit}
                              </p>
                              {vipCredit.payment_due_date && (
                                <p className="text-xs text-red-600 mt-1">
                                  Vence: {new Date(vipCredit.payment_due_date).toLocaleDateString()}
                                </p>
                              )}
                            </>
                          ) : (
                            <span className="inline-block px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 mt-2">
                              Sin crédito asignado
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          {vipCredit ? (
                            <>
                              <p className="text-lg font-bold text-purple-600">
                                ${vipCredit.current_balance} / ${vipCredit.credit_limit}
                              </p>
                              <p className="text-xs text-gray-500">
                                Usado: ${vipCredit.used_amount}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                  vipCredit.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {vipCredit.is_active ? 'Activo' : 'Inactivo'}
                                </span>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setEditingVip(vipCredit.id);
                                    setNewCreditAmount(vipCredit.credit_limit.toString());
                                    setNewDueDate(vipCredit.payment_due_date ? vipCredit.payment_due_date.split('T')[0] : '');
                                  }}
                                >
                                  Editar Crédito
                                </Button>
                              </div>
                            </>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.location.href = `/admin/vip-assign/${encodeURIComponent(user.email)}`}
                            >
                              Asignar Crédito
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>


        </div>
      )}
    </div>
  );
}