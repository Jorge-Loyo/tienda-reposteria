'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateOffer, OfferFormState } from '@/app/admin/products/offer/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Product } from '@prisma/client';
import { useState } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Guardando..." : "Guardar Cambios"}
    </Button>
  );
}

export function OfferForm({ product }: { product: Product }) {
  const initialState: OfferFormState = { error: null };
  // La llamada a useFormState ahora es más simple y no usa .bind()
  const [state, formAction] = useFormState(updateOffer, initialState);
  
  const [isActive, setIsActive] = useState(product.isOfferActive);

  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  return (
    <form action={formAction} className="space-y-6 max-w-lg mx-auto">
      {/* Añadimos un campo oculto para enviar el ID del producto */}
      <input type="hidden" name="productId" value={product.id} />

      <div className="flex items-center space-x-2 p-4 border rounded-md">
        <Switch
          id="isOfferActive"
          name="isOfferActive"
          checked={isActive}
          onCheckedChange={setIsActive}
        />
        <Label htmlFor="isOfferActive" className="text-base font-medium">
          {isActive ? "Oferta Activa" : "Oferta Inactiva"}
        </Label>
      </div>

      {isActive && (
        <div className="space-y-4 p-4 border rounded-md bg-gray-50">
          <div className="space-y-2">
            <Label htmlFor="offerPriceUSD">Precio de Oferta (USD)</Label>
            <Input
              type="number"
              id="offerPriceUSD"
              name="offerPriceUSD"
              step="0.01"
              defaultValue={product.offerPriceUSD ?? ''}
              placeholder={`Precio normal: $${product.priceUSD.toFixed(2)}`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="offerEndsAt">La oferta termina el:</Label>
            <Input
              type="datetime-local"
              id="offerEndsAt"
              name="offerEndsAt"
              defaultValue={formatDateForInput(product.offerEndsAt)}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <SubmitButton />
        {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
      </div>
    </form>
  );
}