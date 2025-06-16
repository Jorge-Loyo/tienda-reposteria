// src/context/CurrencyContext.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';

// Definimos la forma de los datos que compartirá nuestro contexto
interface CurrencyContextType {
  bcvRate: number | null;
}

// Creamos el contexto con un valor inicial por defecto (null)
const CurrencyContext = createContext<CurrencyContextType>({ bcvRate: null });

// Creamos un "hook" personalizado. Esta es una forma fácil y limpia
// para que otros componentes usen nuestro contexto.
export function useCurrency() {
  return useContext(CurrencyContext);
}

// Creamos el componente "Proveedor". Este componente envolverá nuestra aplicación
// y le dará acceso a los datos del contexto.
interface CurrencyProviderProps {
  children: ReactNode;
  rate: number | null;
}

export function CurrencyProvider({ children, rate }: CurrencyProviderProps) {
  // El valor que se compartirá
  const value = {
    bcvRate: rate,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}