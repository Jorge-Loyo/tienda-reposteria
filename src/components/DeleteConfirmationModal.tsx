'use client';

import { Button } from '@/components/ui/button';

interface DeleteConfirmationModalProps {
  userName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export default function DeleteConfirmationModal({
  userName,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmationModalProps) {
  return (
    // Fondo oscuro semi-transparente
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      {/* Panel del Modal */}
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-center">
        <h2 className="text-xl font-bold mb-2">¿Estás seguro?</h2>
        <p className="text-gray-600 mb-6">
          Estás a punto de eliminar al usuario <span className="font-semibold">{userName}</span>. Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
          </Button>
        </div>
      </div>
    </div>
  );
}