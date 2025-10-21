'use client';

import { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface InspirationImage {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  alt: string;
}

interface GalleryModalProps {
  images: InspirationImage[];
}

export function GalleryModal({ images }: GalleryModalProps) {
  const [selectedImage, setSelectedImage] = useState<InspirationImage | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((inspirationImage) => (
          <div
            key={inspirationImage.id}
            className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            onClick={() => setSelectedImage(inspirationImage)}
          >
            <div className="aspect-square">
              <img
                src={inspirationImage.imageUrl}
                alt={inspirationImage.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">{inspirationImage.title}</h3>
                <p className="text-sm opacity-90">{inspirationImage.description}</p>
              </div>
            </div>

            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <ExternalLink className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold gradient-text mb-2">
                  {selectedImage.title}
                </h3>
                <p className="text-gray-600">
                  {selectedImage.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}