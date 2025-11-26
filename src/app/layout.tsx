import './globals.css';
import './layout.css';
import './modern-footer.css';
import './mobile.css';
import './responsive.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';
import CartIcon from '@/components/CartIcon';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { getBcvRate } from '@/lib/currency';
import React from 'react';
import UserSession from '@/components/UserSession';
import MobileMenu from '@/components/MobileMenu';
import { APP_CONFIG } from '@/lib/constants';
import dynamic from 'next/dynamic';
import Script from 'next/script';


const LocationMap = dynamic(() => import('@/components/LocationMap'), {
  ssr: false,
  loading: () => <div className="layout-map-loading">Cargando mapa...</div>
});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Casa Dulce Oriente - Repostería',
  description: 'Los mejores insumos para tus creaciones.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: '#ec4899',
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
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} scroll-top`}>
        <Script src="/scroll-fix.js" strategy="beforeInteractive" />
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
                    <MobileMenu />
                  </div>
                </div>
              </div>
            </header>

            <main className="layout-main" id="main-content">
              {children}
            </main>
            
            <footer className="modern-footer">
              <div className="modern-footer-bg">
                <div className="modern-footer-bg-gradient"></div>
                <div className="modern-footer-bg-pattern"></div>
              </div>
              
              <div className="modern-footer-content">
                <div className="modern-footer-main">
                  {/* Brand Section */}
                  <div className="modern-footer-brand">
                    <div className="modern-footer-logo">
                      <Image
                        src="https://res.cloudinary.com/dnc0btnuv/image/upload/v1760487147/CASADULCE_fwwhkm.png"
                        alt="Casa Dulce Oriente"
                        width={120}
                        height={40}
                        className="modern-footer-logo-img"
                        style={{ filter: 'none' }}
                      />
                    </div>
                    <p className="modern-footer-tagline">
                      Tu aliado perfecto para crear dulces momentos. Calidad premium en cada ingrediente.
                    </p>
                    <div className="modern-footer-social">
                      <a href="https://www.instagram.com/casadulceoriente" target="_blank" rel="noopener noreferrer" className="modern-footer-social-link instagram">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                      <a href="https://wa.me/584248536954" target="_blank" rel="noopener noreferrer" className="modern-footer-social-link whatsapp">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="modern-footer-section">
                    <h4 className="modern-footer-section-title">Navegación</h4>
                    <ul className="modern-footer-links">
                      <li><Link href="/" className="modern-footer-link">Inicio</Link></li>
                      <li><Link href="/tienda" className="modern-footer-link">Tienda</Link></li>
                      <li><Link href="/ofertas" className="modern-footer-link">Ofertas</Link></li>
                      <li><Link href="/perfil" className="modern-footer-link">Mi Cuenta</Link></li>
                    </ul>
                  </div>

                  {/* Contact Info */}
                  <div className="modern-footer-section">
                    <h4 className="modern-footer-section-title">Contacto</h4>
                    <div className="modern-footer-contact">
                      <a href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`} target="_blank" rel="noopener noreferrer" className="modern-footer-contact-item">
                        <MapPinIcon />
                        <span>{address}</span>
                      </a>
                      <a href="https://wa.me/584248536954" target="_blank" rel="noopener noreferrer" className="modern-footer-contact-item">
                        <PhoneIcon />
                        <span>+58 424-853-6954</span>
                      </a>
                      <a href={`mailto:${email}`} className="modern-footer-contact-item">
                        <MailIcon />
                        <span>{email}</span>
                      </a>
                    </div>
                  </div>

                  {/* Location Map */}
                  <div className="modern-footer-section">
                    <h4 className="modern-footer-section-title">Ubicación</h4>
                    <div className="modern-footer-map">
                      <LocationMap lat={lat} lon={lng} />
                    </div>
                  </div>
                </div>
                
                {/* Bottom Bar */}
                <div className="modern-footer-bottom">
                  <div className="modern-footer-bottom-content">
                    <p className="modern-footer-copyright">
                      &copy; {new Date().getFullYear()} <span className="gradient-text">Casa Dulce Oriente</span>. Todos los derechos reservados.
                    </p>
                    <div className="modern-footer-badges">
                      <span className="modern-footer-badge">🍰 Calidad Premium</span>
                      <span className="modern-footer-badge">🚚 Envío Rápido</span>
                      <span className="modern-footer-badge">💯 Garantizado</span>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </CurrencyProvider>
      </body>
    </html>
  );
}