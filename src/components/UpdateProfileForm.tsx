'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateProfile, UpdateProfileState } from '@/app/perfil/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Guardando...' : 'Guardar Cambios'}
    </Button>
  );
}

// Se actualiza la interfaz para recibir el nuevo campo de cédula
interface UpdateProfileFormProps {
    user: {
        name: string | null;
        email: string;
        instagram: string | null;
        phoneNumber: string | null;
        address: string | null;
        identityCard: string | null;
    }
}

export default function UpdateProfileForm({ user }: UpdateProfileFormProps) {
  const initialState: UpdateProfileState = { success: false, message: null, errors: null };
  const [state, formAction] = useFormState(updateProfile, initialState);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-900">Información de la Cuenta</h2>
      <p className="mt-1 text-sm text-gray-600">Actualiza tus datos de perfil y contacto.</p>
      <form action={formAction} className="mt-6 space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" defaultValue={user.name ?? ''} />
              {state.errors?.name && <p className="text-red-500 text-xs mt-1">{state.errors.name[0]}</p>}
            </div>

            {/* Cédula de Identidad */}
            <div>
              <Label htmlFor="identityCard">Cédula de Identidad</Label>
              <Input id="identityCard" name="identityCard" defaultValue={user.identityCard ?? ''} placeholder="V-12345678" />
              {state.errors?.identityCard && <p className="text-red-500 text-xs mt-1">{state.errors.identityCard[0]}</p>}
            </div>
        </div>

        {/* Correo (no editable) */}
        <div>
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input id="email" name="email" value={user.email} disabled className="bg-gray-100"/>
        </div>

        {/* Instagram */}
        <div>
          <Label htmlFor="instagram">Instagram (Usuario)</Label>
          <Input id="instagram" name="instagram" defaultValue={user.instagram ?? ''} placeholder="@usuario" />
          {state.errors?.instagram && <p className="text-red-500 text-xs mt-1">{state.errors.instagram[0]}</p>}
        </div>

        {/* Teléfono */}
        <div>
          <Label htmlFor="phoneNumber">Número de Teléfono</Label>
          <Input id="phoneNumber" name="phoneNumber" type="tel" defaultValue={user.phoneNumber ?? ''} placeholder="0412-1234567" />
           {state.errors?.phoneNumber && <p className="text-red-500 text-xs mt-1">{state.errors.phoneNumber[0]}</p>}
        </div>

        {/* Dirección */}
        <div>
          <Label htmlFor="address">Dirección</Label>
          <Textarea 
            id="address" 
            name="address" 
            defaultValue={user.address ?? ''} 
            placeholder="Av. Principal, Edificio X, Piso Y, Apto Z. Ciudad."
            rows={3}
          />
          {state.errors?.address && <p className="text-red-500 text-xs mt-1">{state.errors.address[0]}</p>}
        </div>
        
        <div className="flex items-center gap-4 pt-2">
            <SubmitButton />
            {state.message && (
                <p className={`text-sm font-medium ${state.success ? 'text-green-600' : 'text-red-600'}`}>
                    {state.message}
                </p>
            )}
        </div>
      </form>
    </div>
  );
}