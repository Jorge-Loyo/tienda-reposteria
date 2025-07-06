'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateShippingZone, ZoneFormState } from '@/app/admin/zones/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShippingZone } from '@prisma/client';
import { useEffect, useState } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Guardando..." : "Guardar"}
    </Button>
  );
}

export function ZoneEditForm({ zone }: { zone: ShippingZone }) {
  const initialState: ZoneFormState = {};
  const [state, formAction] = useFormState(updateShippingZone, initialState);
  const [message, setMessage] = useState(state.success);

  useEffect(() => {
    if (state.success) {
      setMessage(state.success);
      const timer = setTimeout(() => setMessage(undefined), 3000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <form action={formAction} className="p-4 bg-white rounded-lg shadow-sm border space-y-4">
      {/* Añadimos un campo oculto para enviar el ID de la zona */}
      <input type="hidden" name="zoneId" value={zone.id} />

      <h3 className="font-semibold text-lg">{zone.name}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
              <Label htmlFor={`cost-${zone.id}`}>Costo de Envío (USD)</Label>
              <Input
                  type="number"
                  id={`cost-${zone.id}`}
                  name="cost"
                  step="0.01"
                  defaultValue={zone.cost}
                  required
              />
          </div>
          <div className="space-y-1.5">
              <Label htmlFor={`free-${zone.id}`}>Envío Gratis a partir de (USD)</Label>
              <Input
                  type="number"
                  id={`free-${zone.id}`}
                  name="freeShippingThreshold"
                  step="0.01"
                  defaultValue={zone.freeShippingThreshold ?? ''}
                  placeholder="Dejar vacío si no aplica"
              />
          </div>
      </div>
      <div className="flex items-center gap-4">
          <SubmitButton />
          {message && <p className="text-sm text-green-600">{message}</p>}
          {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      </div>
    </form>
  );
}