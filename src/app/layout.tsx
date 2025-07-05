// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import CartIcon from '@/components/CartIcon';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { getBcvRate } from '@/lib/currency';
import React from 'react';
import UserSession from '@/components/UserSession';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Casa Dulce Oriente - Repostería',
  description: 'Los mejores insumos para tus creaciones.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bcvRate = await getBcvRate();

  return (
    <html lang="es">
      <body className={inter.className}>
        <CurrencyProvider rate={bcvRate}>
          <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex-shrink-0">
                  {/* Usando el color primario del tema */}
                  <Link href="/" className="text-2xl font-bold text-primary transition-colors">
                    Casa Dulce Oriente
                  </Link>
                </div>
                <nav className="hidden md:flex items-center gap-8">
                  <Link href="/tienda" className="text-sm font-medium text-gray-600 hover:text-primary">Tienda</Link>
                  <Link href="/ofertas" className="text-sm font-medium text-gray-600 hover:text-primary">Ofertas</Link>
                </nav>
                <div className="flex items-center gap-4">
                  <CartIcon />
                  <UserSession />
                </div>
              </div>
            </div>
          </header>

          <main className="bg-gray-50">
            {children}
          </main>
          
          <footer className="bg-white border-t">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
              <p>&copy; {new Date().getFullYear()} Casa Dulce Oriente. Todos los derechos reservados.</p>
            </div>
          </footer>
        </CurrencyProvider>
      </body>
    </html>
  );
}