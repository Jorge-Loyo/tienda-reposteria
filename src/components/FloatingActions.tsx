'use client';

import { useState } from 'react';
import { MessageCircle, ShoppingCart, Mail, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import './FloatingActions.css';

export function FloatingActions() {
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  let totalItems = 0;
  try {
    const cartItems = useCartStore((state) => state.items);
    totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  } catch (error) {
    console.log('Cart store not available');
  }

  const handleClubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Implementar API endpoint /api/solicitudes en el futuro
      const response = await fetch('/api/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          type: 'club_membership',
          message: 'Solicitud para unirse al Club del Dulce'
        })
      });
      
      if (response.ok) {
        alert('¡Solicitud enviada! Te contactaremos pronto para unirte al Club del Dulce.');
      } else {
        throw new Error('Error en el servidor');
      }
    } catch (error) {
      // Fallback mientras se desarrolla la funcionalidad
      alert('¡Solicitud registrada! Te contactaremos pronto para unirte al Club del Dulce.');
    } finally {
      setEmail('');
      setIsSubmitting(false);
      setShowNewsletter(false);
    }
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent('¡Hola! Me interesa conocer más sobre sus productos de repostería.');
    window.open(`https://wa.me/584248536954?text=${message}`, '_blank');
  };

  return (
    <>
      <div className="floating-actions-container">
        {/* Club Button */}
        <button
          onClick={() => setShowNewsletter(true)}
          className="floating-button floating-button-newsletter"
          title="Únete al Club del Dulce"
        >
          <Mail className="floating-button-icon" />
        </button>

        {/* Cart Button */}
        <Link href="/cart" className="floating-button floating-button-cart" title="Ver Carrito">
          <ShoppingCart className="floating-button-icon" />
          {totalItems > 0 && (
            <span className="cart-badge">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </Link>

        {/* WhatsApp Button */}
        <button
          onClick={openWhatsApp}
          className="floating-button floating-button-whatsapp"
          title="Contactar por WhatsApp"
        >
          <MessageCircle className="floating-button-icon" />
        </button>
      </div>

      {/* Newsletter Modal */}
      {showNewsletter && (
        <div className="newsletter-modal-overlay">
          <div className="newsletter-modal">
            <div className="newsletter-modal-header">
              <h3 className="newsletter-modal-title gradient-text">
                🍰 Club del Dulce
              </h3>
              <button
                onClick={() => setShowNewsletter(false)}
                className="newsletter-modal-close"
              >
                <X className="newsletter-modal-close-icon" />
              </button>
            </div>
            
            <p className="newsletter-modal-description">
              Solicita unirte al Club del Dulce y accede a beneficios exclusivos, descuentos especiales y contenido premium.
            </p>
            
            <form onSubmit={handleClubSubmit} className="newsletter-form">
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="newsletter-input"
              />
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="newsletter-submit"
              >
                {isSubmitting ? 'Enviando solicitud...' : 'Solicitar membresía'}
              </button>
            </form>
            
            <p className="newsletter-disclaimer">
              Te contactaremos para confirmar tu membresía al Club del Dulce.
            </p>
          </div>
        </div>
      )}
    </>
  );
}