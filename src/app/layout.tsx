import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';
import CartIcon from '@/components/CartIcon';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { getBcvRate } from '@/lib/currency';
import React from 'react';
import UserSession from '@/components/UserSession';
import { ThemeProvider } from './providers'; // Importar el ThemeProvider
import { ThemeToggle } from '@/components/ThemeToggle'; // Importar el botón

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Casa Dulce Oriente - Repostería',
  description: 'Los mejores insumos para tus creaciones.',
};

// --- Iconos para el pie de página ---
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 flex-shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81 .7A2 2 0 0 1 22 16.92z"></path></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 flex-shrink-0"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 flex-shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bcvRate = await getBcvRate();
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyA7NF5r-pJS1LO3ZvrYVYCDBlluGNC1Wq8";
  const lat = 10.135122;
  const lng = -64.682316;

  return (
    // Se elimina la clase 'dark' de aquí. next-themes la gestionará.
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Envolvemos todo con el ThemeProvider */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CurrencyProvider rate={bcvRate}>
            <header className="bg-card border-b sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex-shrink-0">
                    <Link 
                      href="/" 
                      className="relative block h-20 w-64"
                      aria-label="Página de inicio de Casa Dulce"
                    >
                      <Image
                        src="https://res.cloudinary.com/dnc0btnuv/image/upload/v1753391048/Logo_kewmlf.png"
                        alt="Logo de Casa Dulce Oriente"
                        fill
                        style={{ objectFit: 'contain' }}
                        priority 
                      />
                    </Link>
                  </div>
                  <nav className="hidden md:flex items-center gap-8">
                    <Link href="/tienda" className="text-sm font-medium text-muted-foreground hover:text-primary">Tienda</Link>
                    <Link href="/ofertas" className="text-sm font-medium text-muted-foreground hover:text-primary">Ofertas</Link>
                  </nav>
                  <div className="flex items-center gap-4">
                    <CartIcon />
                    <UserSession />
                    {/* Añadimos el botón para cambiar de tema */}
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </header>

            <main className="bg-muted">
              {children}
            </main>
            
            <footer className="bg-card border-t">
              <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                      <div className="md:col-span-2 space-y-4">
                          <h3 className="text-lg font-semibold text-foreground">Contáctanos</h3>
                          <a 
                              href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-start gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                              <MapPinIcon />
                              <span><strong>Dirección:</strong> 48P9+23P, Calle Bolívar, Barcelona 6001, Anzoátegui, Venezuela</span>
                          </a>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <PhoneIcon />
                              <span>0424-8536954</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MailIcon />
                              <a href="mailto:contacto@casadulce.com" className="hover:underline">contacto@casadulce.com</a>
                          </div>
                      </div>
                      <div className="w-full h-40 rounded-lg overflow-hidden border">
                          <Image
                              src={`https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=16&size=400x200&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`}
                              alt="Mapa de la ubicación de Casa Dulce Oriente"
                              width={400}
                              height={200}
                              className="w-full h-full object-cover"
                          />
                      </div>
                  </div>
                  <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
                      <p>&copy; {new Date().getFullYear()} Casa Dulce Oriente. Todos los derechos reservados.</p>
                  </div>
              </div>
            </footer>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}