'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TestimonialForm } from './TestimonialForm';
import './TestimonialsSection.css';

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  comment: string;
  role: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="testimonials-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`testimonials-star ${
            star <= rating ? 'filled' : 'empty'
          }`}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => {
        setTestimonials(data);
      })
      .catch(() => {
        setTestimonials([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2 className="testimonials-title gradient-text">
            Lo que dicen nuestros clientes
          </h2>
          <p className="testimonials-subtitle">
            Miles de reposteros confían en nosotros para crear sus mejores obras
          </p>
        </div>

        {loading ? (
          <div className="testimonials-loading">
            <div className="testimonials-loading-text">Cargando testimonios...</div>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="testimonials-empty">
            <div className="testimonials-empty-text">Aún no hay testimonios disponibles</div>
          </div>
        ) : (
          <div className="testimonials-card-container">
            <div className="testimonials-card glass">
              <div className="testimonials-card-content">
                <div className="testimonials-avatar">
                  <div className="testimonials-avatar-circle">
                    <span className="testimonials-avatar-text">
                      {testimonials[currentIndex].name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="testimonials-content">
                  <StarRating rating={testimonials[currentIndex].rating} />
                  <blockquote className="testimonials-quote">
                    "{testimonials[currentIndex].comment}"
                  </blockquote>
                  <div>
                    <p className="testimonials-author-name">
                      {testimonials[currentIndex].name}
                    </p>
                    <p className="testimonials-author-role">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            {testimonials.length > 1 && (
              <div className="testimonials-navigation">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevTestimonial}
                  className="testimonials-nav-button"
                >
                  <ChevronLeft className="testimonials-nav-icon" />
                </Button>
                
                <div className="testimonials-indicators">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`testimonials-indicator ${
                        index === currentIndex ? 'active' : 'inactive'
                      }`}
                    />
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextTestimonial}
                  className="testimonials-nav-button"
                >
                  <ChevronRight className="testimonials-nav-icon" />
                </Button>
              </div>
            )}
          </div>
        )}
        
        <TestimonialForm />
      </div>
    </section>
  );
}