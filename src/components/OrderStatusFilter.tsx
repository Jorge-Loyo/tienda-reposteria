// src/components/OrderStatusFilter.tsx
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

// Definimos todos los estados posibles, incluyendo una opción para ver "Todos"
const statuses = ["Todos", "PENDIENTE_DE_PAGO", "PAGADO", "ARMADO", "ENVIADO", "CANCELADO"];

export function OrderStatusFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Obtenemos el estado actual desde la URL, o 'Todos' por defecto
  const currentStatus = searchParams.get('status') || 'Todos';

  const handleClick = (status: string) => {
    const params = new URLSearchParams(searchParams);
    // Si el estado es 'Todos', eliminamos el parámetro de la URL.
    // Si es otro estado, lo establecemos.
    if (status && status !== 'Todos') {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    // Reemplazamos la URL actual con la nueva, activando el filtro
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-white rounded-lg shadow-md mb-6">
      <p className="text-sm font-semibold mr-4">Filtrar por estado:</p>
      {statuses.map((status) => (
        <Button
          key={status}
          // El botón del estado activo tendrá un estilo diferente
          variant={currentStatus === status ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleClick(status)}
          className="capitalize" // Muestra el texto con mayúscula inicial
        >
          {status.replace(/_/g, ' ').toLowerCase()}
        </Button>
      ))}
    </div>
  );
}
