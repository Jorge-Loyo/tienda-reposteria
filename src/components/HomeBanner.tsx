'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';

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

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden bg-gray-800">
      {images.map((image, index) => {
        // Determinamos si el slide actual debe tener texto y sombreado
        const hasOverlay = !!image.title;

        return (
          <div
            key={image.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              style={{ objectFit: 'cover' }}
              priority={index === 0}
            />
            {/* CORRECCIÓN: El sombreado oscuro solo se aplica si hay un título */}
            {hasOverlay && (
              <div className="absolute inset-0 bg-black opacity-50"></div>
            )}
          </div>
        );
      })}
      
      {/* CORRECCIÓN: El contenedor del texto solo se renderiza si el slide actual tiene un título */}
      {images[currentIndex]?.title && (
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 drop-shadow-lg">
              {images[currentIndex]?.title}
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-200 mb-8 drop-shadow-md">
              {images[currentIndex]?.subtitle}
            </p>
            <Button asChild size="lg">
              <Link href={images[currentIndex]?.buttonLink || '/'}>{images[currentIndex]?.buttonText}</Link>
            </Button>
        </div>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {images.map((_, index) => (
                <button
                    key={index}
                    aria-label={`Ir al slide ${index + 1}`}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-3 w-3 rounded-full transition-colors ${
                        currentIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white'
                    }`}
                />
            ))}
        </div>
      )}
    </section>
  );
}