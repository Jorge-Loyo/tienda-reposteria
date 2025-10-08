'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { updateProfile, UpdateProfileState } from '@/app/perfil/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

function SubmitButton({ isUploading }: { isUploading: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = pending || isUploading;
  return (
    <Button type="submit" disabled={isDisabled}>
      {isUploading ? 'Subiendo imagen...' : pending ? 'Guardando...' : 'Guardar Cambios'}
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
        avatarUrl: string | null;
    }
}

export default function UpdateProfileForm({ user }: UpdateProfileFormProps) {
  const initialState: UpdateProfileState = { success: false, message: null, errors: null };
  const [state, formAction] = useFormState(updateProfile, initialState);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    const avatarFile = formData.get('avatar') as File;
    
    if (avatarFile && avatarFile.size > 0) {
      setIsUploading(true);
      try {
        const uploadFormData = new FormData();
        uploadFormData.append('file', avatarFile);
        
        const response = await fetch('/api/upload/avatar', {
          method: 'POST',
          body: uploadFormData,
        });
        
        if (response.ok) {
          const { url } = await response.json();
          formData.set('avatarUrl', url);
        }
      } catch (error) {
        console.error('Error subiendo imagen:', error);
      } finally {
        setIsUploading(false);
      }
    }
    
    formAction(formData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-900">Información de la Cuenta</h2>
      <p className="mt-1 text-sm text-gray-600">Actualiza tus datos de perfil y contacto.</p>
      <form action={handleSubmit} className="mt-6 space-y-6">
        
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

        {/* Avatar */}
        <div>
          <Label htmlFor="avatar">Imagen de Perfil</Label>
          <div className="mt-2 flex items-center gap-4">
            {user.avatarUrl && (
              <img 
                src={user.avatarUrl} 
                alt="Avatar actual" 
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <input
              id="avatar"
              name="avatar"
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Sube una imagen para tu perfil (JPG, PNG, máx. 5MB)</p>
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
            <SubmitButton isUploading={isUploading} />
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