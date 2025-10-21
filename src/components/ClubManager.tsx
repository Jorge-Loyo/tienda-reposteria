'use client';

import { useState } from 'react';
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Configuración */}
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
              
              {/* Premios */}
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

      {/* Ranking Actual */}
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
  );
}