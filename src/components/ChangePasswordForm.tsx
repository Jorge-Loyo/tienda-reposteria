'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { changePassword, ChangePasswordState } from '@/app/perfil/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useRef } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Actualizando...' : 'Actualizar Contraseña'}
    </Button>
  );
}

export default function ChangePasswordForm() {
  const initialState: ChangePasswordState = { success: false, message: null, errors: null };
  const [state, formAction] = useFormState(changePassword, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="currentPassword">Contraseña Actual</Label>
        <Input type="password" id="currentPassword" name="currentPassword" required />
        {state.errors?.currentPassword && <p className="text-red-500 text-xs mt-1">{state.errors.currentPassword[0]}</p>}
      </div>
      <div>
        <Label htmlFor="newPassword">Nueva Contraseña</Label>
        <Input type="password" id="newPassword" name="newPassword" required />
        {state.errors?.newPassword && <p className="text-red-500 text-xs mt-1">{state.errors.newPassword[0]}</p>}
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
        <Input type="password" id="confirmPassword" name="confirmPassword" required />
        {state.errors?.confirmPassword && <p className="text-red-500 text-xs mt-1">{state.errors.confirmPassword[0]}</p>}
      </div>

      <SubmitButton />

      {state.message && (
        <p className={`mt-4 text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
