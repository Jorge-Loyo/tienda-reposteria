// src/components/OrderSearchInput.tsx
'use client';

import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function OrderSearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Esta función retrasa la búsqueda para no sobrecargar el servidor con cada tecla
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300); // Espera 300ms

  return (
    <div className="max-w-md">
      <Input
        type="text"
        placeholder="Buscar por Nº de Pedido, Cliente o Alias..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('search')?.toString() || ''}
      />
    </div>
  );
}