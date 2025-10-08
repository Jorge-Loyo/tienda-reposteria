'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Percent, Power, PowerOff } from 'lucide-react';

interface ZoneBulkActionsProps {
  selectedZones: number[];
  onBulkUpdate: (action: string, value?: any) => void;
}

export function ZoneBulkActions({ selectedZones, onBulkUpdate }: ZoneBulkActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [priceAdjustment, setPriceAdjustment] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<'percentage' | 'fixed'>('percentage');

  if (selectedZones.length === 0) return null;

  const handlePriceUpdate = () => {
    const value = parseFloat(priceAdjustment);
    if (isNaN(value)) return;
    
    onBulkUpdate('updatePrices', { 
      type: adjustmentType, 
      value,
      zones: selectedZones 
    });
    setPriceAdjustment('');
    setIsOpen(false);
  };

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-100">
          <Settings className="h-5 w-5" />
          Acciones en Lote ({selectedZones.length} seleccionadas)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Percent className="h-4 w-4" />
                Ajustar Precios
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajustar Precios en Lote</DialogTitle>
                <DialogDescription>
                  Aplicar cambios de precio a {selectedZones.length} zona(s) seleccionada(s)
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={adjustmentType === 'percentage' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAdjustmentType('percentage')}
                  >
                    Porcentaje
                  </Button>
                  <Button
                    variant={adjustmentType === 'fixed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAdjustmentType('fixed')}
                  >
                    Valor Fijo
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adjustment">
                    {adjustmentType === 'percentage' 
                      ? 'Porcentaje de ajuste (ej: 10 para +10%, -5 para -5%)'
                      : 'Valor a sumar/restar (ej: 2.50 para +$2.50, -1.00 para -$1.00)'
                    }
                  </Label>
                  <Input
                    id="adjustment"
                    type="number"
                    step="0.01"
                    value={priceAdjustment}
                    onChange={(e) => setPriceAdjustment(e.target.value)}
                    placeholder={adjustmentType === 'percentage' ? '10' : '2.50'}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handlePriceUpdate}>
                  Aplicar Cambios
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkUpdate('activate')}
            className="flex items-center gap-2 text-green-700"
          >
            <Power className="h-4 w-4" />
            Activar Todas
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkUpdate('deactivate')}
            className="flex items-center gap-2 text-red-700"
          >
            <PowerOff className="h-4 w-4" />
            Desactivar Todas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}