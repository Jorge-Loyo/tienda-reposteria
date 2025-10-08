'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, ShoppingCart, Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/store/cartStore';

export function FloatingActions() {
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setEmail('');
    setIsSubmitting(false);
    setShowNewsletter(false);
    
    // Aquí podrías agregar la lógica real de suscripción
    alert('¡Gracias por suscribirte! Te mantendremos informado de nuestras novedades.');
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent('¡Hola! Me interesa conocer más sobre sus productos de repostería.');
    window.open(`https://wa.me/584241234567?text=${message}`, '_blank');
  };

  return (
    <>
      {/* WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={openWhatsApp}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>

      {/* Cart Button */}
      <div className="fixed bottom-24 right-6 z-40">
        <Button
          asChild
          className="bg-pink-500 hover:bg-pink-600 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 relative"
        >
          <a href="/cart">
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </a>
        </Button>
      </div>

      {/* Newsletter Button */}
      <div className="fixed bottom-42 right-6 z-40">
        <Button
          onClick={() => setShowNewsletter(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <Mail className="w-6 h-6" />
        </Button>
      </div>

      {/* Newsletter Modal */}
      {showNewsletter && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold gradient-text">
                📧 Newsletter
              </h3>
              <button
                onClick={() => setShowNewsletter(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Suscríbete para recibir ofertas exclusivas, nuevos productos y tips de repostería.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
              >
                {isSubmitting ? 'Suscribiendo...' : 'Suscribirme'}
              </Button>
            </form>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              No spam. Puedes cancelar en cualquier momento.
            </p>
          </div>
        </div>
      )}
    </>
  );
}