'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateShippingZone, deleteShippingZone, toggleZoneStatus, ZoneFormState, DeleteZoneFormState, ToggleZoneFormState } from '@/app/admin/zones/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ShippingZone } from '@prisma/client';
import { useEffect, useState } from 'react';
import { MapPin, DollarSign, Gift, Save, CheckCircle, AlertCircle, Trash2, Power, PowerOff, Square, CheckSquare } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="flex items-center gap-2">
      <Save className="h-4 w-4" />
      {pending ? "Guardando..." : "Guardar Cambios"}
    </Button>
  );
}

interface ZoneEditFormProps {
  zone: ShippingZone;
  isSelected?: boolean;
  onSelectionChange?: (zoneId: number, selected: boolean) => void;
}

export function ZoneEditForm({ zone, isSelected = false, onSelectionChange }: ZoneEditFormProps) {
  const initialState: ZoneFormState = {};
  const deleteInitialState: DeleteZoneFormState = {};
  const toggleInitialState: ToggleZoneFormState = {};
  
  const [state, formAction] = useFormState(updateShippingZone, initialState);
  const [deleteState, deleteAction] = useFormState(deleteShippingZone, deleteInitialState);
  const [toggleState, toggleAction] = useFormState(toggleZoneStatus, toggleInitialState);
  
  const [message, setMessage] = useState(state.success);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (state.success) {
      setMessage(state.success);
      const timer = setTimeout(() => setMessage(undefined), 3000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  useEffect(() => {
    if (deleteState.success) {
      setDeleteDialogOpen(false);
    }
  }, [deleteState]);

  const handleToggleActive = () => {
    const formData = new FormData();
    formData.append('zoneId', zone.id.toString());
    formData.append('isActive', (!zone.isActive).toString());
    toggleAction(formData);
  };

  const handleSelectionChange = () => {
    onSelectionChange?.(zone.id, !isSelected);
  };

  const hasFreeShipping = zone.freeShippingThreshold && zone.freeShippingThreshold > 0;

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onSelectionChange && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectionChange}
                className="p-1 h-8 w-8"
              >
                {isSelected ? (
                  <CheckSquare className="h-4 w-4 text-blue-600" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
              </Button>
            )}
            <div className={`p-2 rounded-lg ${
              zone.isActive 
                ? 'bg-green-100 dark:bg-green-900' 
                : 'bg-gray-100 dark:bg-gray-800'
            }`}>
              <MapPin className={`h-5 w-5 ${
                zone.isActive 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{zone.name}</CardTitle>
                <Badge 
                  variant={zone.isActive ? "default" : "secondary"}
                  className={zone.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                >
                  {zone.isActive ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  ${zone.cost} USD
                </Badge>
                {hasFreeShipping && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    <Gift className="h-3 w-3 mr-1" />
                    Envío gratis desde ${zone.freeShippingThreshold}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={`active-${zone.id}`} className="text-sm">
                {zone.isActive ? 'Activa' : 'Inactiva'}
              </Label>
              <Switch
                id={`active-${zone.id}`}
                checked={zone.isActive}
                onCheckedChange={handleToggleActive}
              />
            </div>
            
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Eliminar Zona</DialogTitle>
                  <DialogDescription>
                    ¿Estás seguro de que deseas eliminar la zona "{zone.name}"? Esta acción no se puede deshacer.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <form action={deleteAction}>
                    <input type="hidden" name="zoneId" value={zone.id} />
                    <Button type="submit" variant="destructive">
                      Eliminar
                    </Button>
                  </form>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="zoneId" value={zone.id} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`cost-${zone.id}`} className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="h-4 w-4" />
                Costo de Envío (USD)
              </Label>
              <Input
                type="number"
                id={`cost-${zone.id}`}
                name="cost"
                step="0.01"
                min="0"
                defaultValue={zone.cost}
                className="transition-colors focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`free-${zone.id}`} className="flex items-center gap-2 text-sm font-medium">
                <Gift className="h-4 w-4" />
                Envío Gratis desde (USD)
              </Label>
              <Input
                type="number"
                id={`free-${zone.id}`}
                name="freeShippingThreshold"
                step="0.01"
                min="0"
                defaultValue={zone.freeShippingThreshold ?? ''}
                placeholder="Opcional - dejar vacío si no aplica"
                className="transition-colors focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              {message && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  {message}
                </div>
              )}
              {state.error && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  {state.error}
                </div>
              )}
              {deleteState.error && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  {deleteState.error}
                </div>
              )}
              {toggleState.success && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  {toggleState.success}
                </div>
              )}
            </div>
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}