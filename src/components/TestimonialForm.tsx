'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star, Send } from 'lucide-react';

export function TestimonialForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    rating: 5,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData({ name: '', email: '', role: '', rating: 5, comment: '' });
        setShowForm(false);
        alert('¡Gracias! Tu testimonio ha sido enviado para revisión.');
      } else {
        alert('Error al enviar el testimonio. Inténtalo de nuevo.');
      }
    } catch (error) {
      alert('Error al enviar el testimonio. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showForm) {
    return (
      <div className="text-center mt-8">
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white"
        >
          Comparte tu experiencia
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <div className="glass rounded-2xl p-6">
        <h3 className="text-xl font-bold text-center mb-6">Comparte tu experiencia</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Tu nombre"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              type="email"
              placeholder="Tu email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          
          <Input
            placeholder="Tu rol (ej: Repostera, Chef, Aficionado)"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
          
          <div>
            <label className="block text-sm font-medium mb-2">Calificación</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="p-1"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <Textarea
            placeholder="Cuéntanos sobre tu experiencia con Casa Dulce Oriente..."
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            rows={4}
            required
          />
          
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white"
            >
              {isSubmitting ? 'Enviando...' : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar testimonio
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}