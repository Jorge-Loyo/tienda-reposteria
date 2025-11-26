'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './MobileMenu.css';

interface User {
  name: string | null;
  email: string;
  role: string;
}

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch {
        setUser(null);
      }
    };
    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setIsOpen(false);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
      <button
        className="mobile-menu-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menú"
      >
        <svg className="mobile-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsOpen(false)}>
          <nav className="mobile-menu-nav" onClick={(e) => e.stopPropagation()}>
            <Link href="/" className="mobile-menu-link" onClick={() => setIsOpen(false)}>
              🏠 Inicio
            </Link>
            <Link href="/tienda" className="mobile-menu-link" onClick={() => setIsOpen(false)}>
              🛍️ Tienda
            </Link>
            <Link href="/ofertas" className="mobile-menu-link ofertas" onClick={() => setIsOpen(false)}>
              🔥 Ofertas
            </Link>
            <div className="mobile-menu-divider"></div>
            {user ? (
              <>
                <Link href="/perfil" className="mobile-menu-link" onClick={() => setIsOpen(false)}>
                  👤 Perfil
                </Link>
                <button className="mobile-menu-link logout" onClick={handleLogout}>
                  🚪 Cerrar Sesión
                </button>
              </>
            ) : (
              <Link href="/login" className="mobile-menu-link" onClick={() => setIsOpen(false)}>
                🔑 Iniciar Sesión
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
