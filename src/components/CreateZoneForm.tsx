'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { createShippingZone, CreateZoneFormState } from '@/app/admin/zones/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Save, X, MapPin, DollarSign, Gift } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="flex items-center gap-2">
      <Save className="h-4 w-4" />
      {pending ? "Creando..." : "Crear Zona"}
    </Button>
  );
}

export function CreateZoneForm() {
  const [isOpen, setIsOpen] = useState(false);
  const initialState: CreateZoneFormState = {};
  const [state, formAction] = useFormState(createShippingZone, initialState);

  // Cerrar formulario si se creó exitosamente
  if (state.success && isOpen) {
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Agregar Nueva Zona
      </Button>
    );
  }

  return (
    <Card className="border-dashed border-2 border-blue-300 bg-blue-50/50 dark:bg-blue-950/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <MapPin className="h-5 w-5" />
            Nueva Zona de Envío
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="identifier" className="flex items-center gap-2 text-sm font-medium">
                Identificador
              </Label>
              <Input
                id="identifier"
                name="identifier"
                placeholder="ej: VALENCIA"
                className="uppercase"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                Nombre de la Zona
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="ej: Valencia"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost" className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="h-4 w-4" />
                Costo de Envío (USD)
              </Label>
              <Input
                type="number"
                id="cost"
                name="cost"
                step="0.01"
                min="0"
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="freeShippingThreshold" className="flex items-center gap-2 text-sm font-medium">
                <Gift className="h-4 w-4" />
                Envío Gratis desde (USD)
              </Label>
              <Input
                type="number"
                id="freeShippingThreshold"
                name="freeShippingThreshold"
                step="0.01"
                min="0"
                placeholder="Opcional"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="postalCodes" className="flex items-center gap-2 text-sm font-medium">
              Códigos Postales (opcional)
            </Label>
            <Input
              id="postalCodes"
              name="postalCodes"
              placeholder="ej: 6001, 6002, 6003 (separados por comas)"
            />
            <p className="text-xs text-muted-foreground">
              Lista de códigos postales que pertenecen a esta zona, separados por comas
            </p>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              {state.success && (
                <p className="text-sm text-green-600">{state.success}</p>
              )}
              {state.error && (
                <p className="text-sm text-red-500">{state.error}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <SubmitButton />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}