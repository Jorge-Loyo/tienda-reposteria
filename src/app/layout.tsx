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
import { APP_CONFIG } from '@/lib/constants';
import dynamic from 'next/dynamic';
import { initializeScheduler } from '@/lib/scheduler';

const LocationMap = dynamic(() => import('@/components/LocationMap'), {
  ssr: false,
  loading: () => <div className="h-48 bg-gray-700 rounded-lg animate-pulse flex items-center justify-center text-gray-300">Cargando mapa...</div>
});

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
  // Inicializar scheduler solo en servidor
  if (typeof window === 'undefined') {
    initializeScheduler();
  }
  
  const bcvRate = await getBcvRate();
  const { lat, lng, address } = APP_CONFIG.COMPANY_LOCATION;
  const { phone, email } = APP_CONFIG.CONTACT;

  return (
    // Se elimina la clase 'dark' de aquí. next-themes la gestionará.
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
          <CurrencyProvider rate={bcvRate}>
            <header className="glass sticky top-0 z-50 border-b border-white/10">
              <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                  <div className="flex-shrink-0 relative z-10">
                    <Link 
                      href="/" 
                      className="relative block h-32 w-72 mt-6 -mb-6 transition-transform duration-300 hover:scale-105"
                      aria-label="Página de inicio de Casa Dulce"
                    >
                      <Image
                        src="https://res.cloudinary.com/dnc0btnuv/image/upload/v1760487147/CASADULCE_fwwhkm.png"
                        alt="Logo de Casa Dulce Oriente"
                        fill
                        style={{ objectFit: 'contain' }}
                        priority 
                      />
                    </Link>
                  </div>
                  <nav className="hidden md:flex items-center gap-12">
                    <Link href="/tienda" className="relative text-base font-semibold text-gray-700 hover:text-pink-600 transition-all duration-300 group">
                      Tienda
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    <Link href="/ofertas" className="relative text-base font-semibold text-gray-700 hover:text-orange-500 transition-all duration-300 group">
                      Ofertas
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </nav>
                  <div className="flex items-center gap-6">
                    <CartIcon />
                    <UserSession />
                  </div>
                </div>
              </div>
            </header>

            <main className="bg-muted">
              {children}
            </main>
            
            <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
              {/* Elementos decorativos de fondo */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-500 rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative max-w-7xl mx-auto py-8 px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                      {/* Información de contacto */}
                      <div className="lg:col-span-2 space-y-4">
                          <div>
                              <h3 className="text-xl font-bold gradient-text mb-4">Contáctanos</h3>
                              <div className="space-y-3">
                                  <a 
                                      href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                                  >
                                      <div className="text-pink-400">
                                          <MapPinIcon />
                                      </div>
                                      <div>
                                          <span className="font-semibold text-white">Dirección</span>
                                          <p className="text-gray-200 text-sm mt-1">{address}</p>
                                      </div>
                                  </a>
                                  
                                  
                                  <a href="https://wa.me/584248536954" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                                      <div className="text-green-500">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/></svg>
                                      </div>
                                      <div>
                                          <span className="font-semibold text-white">WhatsApp</span>
                                          <p className="text-gray-200 text-sm">+58 424-853-6954</p>
                                      </div>
                                  </a>
                                  
                                  <a href={`mailto:${email}`} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                                      <div className="text-blue-400">
                                          <MailIcon />
                                      </div>
                                      <div>
                                          <span className="font-semibold text-white">Email</span>
                                          <p className="text-gray-200 text-sm">{email}</p>
                                      </div>
                                  </a>
                              </div>
                          </div>
                      </div>
                      
                      {/* Mapa */}
                      <div className="w-full">
                          <div className="bg-white/5 rounded-xl overflow-hidden shadow-xl border border-white/10">
                              <LocationMap lat={lat} lon={lng} />
                          </div>
                      </div>
                  </div>
                  
                  {/* Copyright */}
                  <div className="mt-8 pt-4 border-t border-white/10">
                      <div className="text-center">
                          <p className="text-gray-400 text-sm">
                              &copy; {new Date().getFullYear()} <span className="gradient-text font-semibold">Casa Dulce Oriente</span>. Todos los derechos reservados.
                          </p>
                      </div>
                  </div>
              </div>
            </footer>
          </CurrencyProvider>
      </body>
    </html>
  );
}