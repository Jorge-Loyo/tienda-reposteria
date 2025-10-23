import './globals.css';
import './layout.css';
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


const LocationMap = dynamic(() => import('@/components/LocationMap'), {
  ssr: false,
  loading: () => <div className="layout-map-loading">Cargando mapa...</div>
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

  
  const bcvRate = await getBcvRate();
  const { lat, lng, address } = APP_CONFIG.COMPANY_LOCATION;
  const { phone, email } = APP_CONFIG.CONTACT;

  return (
    // Se elimina la clase 'dark' de aquí. next-themes la gestionará.
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
          <CurrencyProvider rate={bcvRate}>
            <header className="glass layout-header">
              <div className="layout-header-container">
                <div className="layout-header-content">
                  <div className="layout-logo">
                    <Link 
                      href="/" 
                      className="layout-logo-link"
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
                  <nav className="layout-nav">
                    <Link href="/tienda" className="layout-nav-link group">
                      Tienda
                      <span className="layout-nav-link-underline"></span>
                    </Link>
                    <Link href="/ofertas" className="layout-nav-link ofertas group">
                      Ofertas
                      <span className="layout-nav-link-underline"></span>
                    </Link>
                  </nav>
                  <div className="layout-header-actions">
                    <CartIcon />
                    <UserSession />
                  </div>
                </div>
              </div>
            </header>

            <main className="layout-main">
              {children}
            </main>
            
            <footer className="layout-footer">
              <div className="layout-footer-bg">
                <div className="layout-footer-bg-circle-1"></div>
                <div className="layout-footer-bg-circle-2"></div>
              </div>
              
              <div className="layout-footer-content">
                  <div className="layout-footer-grid">
                      <div className="layout-footer-contact">
                          <div>
                              <h3 className="layout-footer-contact-title gradient-text">Contáctanos</h3>
                              <div className="layout-footer-contact-items">
                                  <a 
                                      href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="layout-footer-contact-item"
                                  >
                                      <div className="layout-footer-contact-icon pink">
                                          <MapPinIcon />
                                      </div>
                                      <div>
                                          <span className="layout-footer-contact-label">Dirección</span>
                                          <p className="layout-footer-contact-text">{address}</p>
                                      </div>
                                  </a>
                                  
                                  <a href="https://wa.me/584248536954" target="_blank" rel="noopener noreferrer" className="layout-footer-contact-item center">
                                      <div className="layout-footer-contact-icon green">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/></svg>
                                      </div>
                                      <div>
                                          <span className="layout-footer-contact-label">WhatsApp</span>
                                          <p className="layout-footer-contact-text small">+58 424-853-6954</p>
                                      </div>
                                  </a>
                                  
                                  <a href={`mailto:${email}`} className="layout-footer-contact-item center">
                                      <div className="layout-footer-contact-icon blue">
                                          <MailIcon />
                                      </div>
                                      <div>
                                          <span className="layout-footer-contact-label">Email</span>
                                          <p className="layout-footer-contact-text small">{email}</p>
                                      </div>
                                  </a>
                              </div>
                          </div>
                      </div>
                      
                      <div className="layout-footer-map">
                          <div className="layout-footer-map-container">
                              <LocationMap lat={lat} lon={lng} />
                          </div>
                      </div>
                  </div>
                  
                  <div className="layout-footer-copyright">
                      <div className="layout-footer-copyright-content">
                          <p className="layout-footer-copyright-text">
                              &copy; {new Date().getFullYear()} <span className="gradient-text layout-footer-copyright-brand">Casa Dulce Oriente</span>. Todos los derechos reservados.
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