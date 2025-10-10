'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Check, X, MessageSquare, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Testimonial {
  id: number;
  name: string;
  email: string;
  role: string | null;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [testimonials, ratingFilter, statusFilter]);

  const applyFilters = () => {
    let filtered = [...testimonials];

    if (ratingFilter !== 'all') {
      filtered = filtered.filter(t => t.rating === parseInt(ratingFilter));
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => 
        statusFilter === 'visible' ? t.approved : !t.approved
      );
    }

    setFilteredTestimonials(filtered);
    setCurrentPage(1);
  };

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/admin/testimonials');
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Error al cargar testimonios');
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (id: number, approved: boolean) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved })
      });

      if (response.ok) {
        setTestimonials(prev => 
          prev.map(t => t.id === id ? { ...t, approved } : t)
        );
      }
    } catch (error) {
      console.error('Error al actualizar testimonio');
    }
  };

  const deleteTestimonial = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este testimonio?')) return;
    
    try {
      const response = await fetch(`/api/admin/testimonials/${id}/delete`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setTestimonials(prev => prev.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Error al eliminar testimonio');
    }
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTestimonials = filteredTestimonials.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Cargando testimonios...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="outline" asChild>
          <Link href="/admin/marketing">← Volver a Marketing</Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Gestión de Testimonios
        </h1>
        <p className="text-gray-600 mb-6">
          Administra los comentarios que aparecerán en la página principal
        </p>
        
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Filtrar por estrellas:</label>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="5">5 ⭐</SelectItem>
                <SelectItem value="4">4 ⭐</SelectItem>
                <SelectItem value="3">3 ⭐</SelectItem>
                <SelectItem value="2">2 ⭐</SelectItem>
                <SelectItem value="1">1 ⭐</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Estado:</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="visible">Visibles</SelectItem>
                <SelectItem value="hidden">Ocultos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-gray-500">
            {filteredTestimonials.length} testimonio{filteredTestimonials.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredTestimonials.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">
              {testimonials.length === 0 ? 'No hay testimonios aún' : 'No se encontraron testimonios con los filtros aplicados'}
            </p>
          </div>
        ) : (
          currentTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`p-6 rounded-lg border-2 transition-all ${
                testimonial.approved
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                  <p className="text-gray-600">{testimonial.email}</p>
                  {testimonial.role && (
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <StarRating rating={testimonial.rating} />
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    testimonial.approved
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {testimonial.approved ? 'Visible' : 'Oculto'}
                  </span>
                </div>
              </div>

              <blockquote className="text-gray-700 mb-4 italic">
                "{testimonial.comment}"
              </blockquote>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {new Date(testimonial.createdAt).toLocaleDateString('es-ES')}
                </span>
                
                <div className="flex gap-2">
                  {!testimonial.approved ? (
                    <Button
                      onClick={() => toggleApproval(testimonial.id, true)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Mostrar
                    </Button>
                  ) : (
                    <Button
                      onClick={() => toggleApproval(testimonial.id, false)}
                      variant="outline"
                      size="sm"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Ocultar
                    </Button>
                  )}
                  <Button
                    onClick={() => deleteTestimonial(testimonial.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Anterior
          </Button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? "bg-gradient-to-r from-pink-500 to-orange-500" : ""}
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Siguiente
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}