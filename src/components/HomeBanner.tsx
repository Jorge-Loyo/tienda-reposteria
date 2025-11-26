'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import './HomeBanner.css';

interface BannerImage {
  src: string;
  alt: string;
  // Hacemos que los textos y enlaces sean opcionales
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface HomeBannerProps {
  images: BannerImage[];
}

export default function HomeBanner({ images }: HomeBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mejorar calidad de imágenes de Cloudinary
  const optimizeCloudinaryUrl = (url: string) => {
    if (url.includes('cloudinary.com')) {
      // Agregar transformaciones para mejor calidad
      return url.replace('/upload/', '/upload/q_auto:best,f_auto,w_1920,c_limit/');
    }
    return url;
  };

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <section className="home-banner">
      {images.map((image, index) => {
        // Determinamos si el slide actual debe tener texto y sombreado
        const hasOverlay = !!image.title;

        return (
          <div
            key={image.src}
            className={`home-banner-slide ${
              index === currentIndex ? 'active' : 'inactive'
            }`}
          >
            <Image
              src={optimizeCloudinaryUrl(image.src)}
              alt={image.alt}
              fill
              quality={100}
              style={{ objectFit: 'cover' }}
              priority={index === 0}
              unoptimized
            />
            {/* CORRECCIÓN: El sombreado oscuro solo se aplica si hay un título */}
            {hasOverlay && (
              <div className="home-banner-overlay"></div>
            )}
          </div>
        );
      })}
      
      {/* CORRECCIÓN: El contenedor del texto solo se renderiza si el slide actual tiene un título */}
      {images[currentIndex]?.title && (
        <div className="home-banner-content">
            <h1 className="home-banner-title">
              {images[currentIndex]?.title}
            </h1>
        </div>
      )}

      {/* Flechas de navegación */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="home-banner-nav-button prev"
            aria-label="Imagen anterior"
          >
            <svg className="home-banner-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="home-banner-nav-button next"
            aria-label="Imagen siguiente"
          >
            <svg className="home-banner-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicadores de puntos */}
      {images.length > 1 && (
        <div className="home-banner-indicators">
            {images.map((_, index) => (
                <button
                    key={index}
                    aria-label={`Ir al slide ${index + 1}`}
                    onClick={() => setCurrentIndex(index)}
                    className={`home-banner-indicator ${
                        currentIndex === index ? 'active' : 'inactive'
                    }`}
                />
            ))}
        </div>
      )}
    </section>
  );
}