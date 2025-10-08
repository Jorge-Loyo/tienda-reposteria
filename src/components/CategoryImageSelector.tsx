'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { EmojiPicker } from '@/components/EmojiPicker';
import { Check, Plus, Smile } from 'lucide-react';

// Imágenes predefinidas para categorías de repostería
const CATEGORY_IMAGES = [
  { id: 'cake', url: '/images/categories/placeholder.svg', name: 'Tortas y Pasteles', icon: '🎂' },
  { id: 'cupcake', url: '/images/categories/placeholder.svg', name: 'Cupcakes', icon: '🧁' },
  { id: 'cookie', url: '/images/categories/placeholder.svg', name: 'Galletas', icon: '🍪' },
  { id: 'chocolate', url: '/images/categories/placeholder.svg', name: 'Chocolate', icon: '🍫' },
  { id: 'flour', url: '/images/categories/placeholder.svg', name: 'Harinas', icon: '🌾' },
  { id: 'sugar', url: '/images/categories/placeholder.svg', name: 'Azúcares', icon: '🍬' },
  { id: 'cream', url: '/images/categories/placeholder.svg', name: 'Cremas', icon: '🥛' },
  { id: 'fruit', url: '/images/categories/placeholder.svg', name: 'Frutas', icon: '🍓' },
  { id: 'nuts', url: '/images/categories/placeholder.svg', name: 'Frutos Secos', icon: '🥜' },
  { id: 'tools', url: '/images/categories/placeholder.svg', name: 'Herramientas', icon: '🥄' },
  { id: 'decoration', url: '/images/categories/placeholder.svg', name: 'Decoración', icon: '✨' },
  { id: 'molds', url: '/images/categories/placeholder.svg', name: 'Moldes', icon: '🥣' },
];

interface CategoryImageSelectorProps {
  selectedImage?: string;
  onImageSelect: (imageUrl: string) => void;
}

export function CategoryImageSelector({ selectedImage, onImageSelect }: CategoryImageSelectorProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Imagen de la Categoría</Label>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {CATEGORY_IMAGES.map((image) => (
          <Card
            key={image.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedImage === image.icon
                ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20'
                : 'hover:ring-1 hover:ring-gray-300'
            }`}
            onClick={() => onImageSelect(image.icon)}
          >
            <CardContent className="p-6">
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl mb-3">{image.icon}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 font-medium px-2">
                      {image.name.split(' ')[0]}
                    </div>
                  </div>
                </div>
                
                {selectedImage === image.icon && (
                  <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
              
              <p className="text-sm text-center text-gray-600 dark:text-gray-400 leading-tight font-medium">
                {image.name}
              </p>
            </CardContent>
          </Card>
        ))}
        
        {/* Botón para más emojis */}
        <Card className="cursor-pointer transition-all duration-200 hover:shadow-md hover:ring-1 hover:ring-gray-300">
          <CardContent className="p-6">
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="aspect-square w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center mb-4 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900 dark:hover:to-purple-900 transition-all"
              >
                <div className="text-center">
                  <Plus className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                  <Smile className="h-6 w-6 mx-auto text-gray-400" />
                </div>
              </button>
              
              {/* Selector de emojis */}
              {showEmojiPicker && (
                <EmojiPicker
                  selectedEmoji={selectedImage}
                  onEmojiSelect={onImageSelect}
                  onClose={() => setShowEmojiPicker(false)}
                />
              )}
            </div>
            
            <p className="text-sm text-center text-gray-600 dark:text-gray-400 leading-tight font-medium">
              Más emojis
            </p>
          </CardContent>
        </Card>
      </div>
      
      {selectedImage && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg flex items-center gap-3">
          <span className="text-2xl">{selectedImage}</span>
          <div>
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              Icono seleccionado
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {CATEGORY_IMAGES.find(img => img.icon === selectedImage)?.name || 'Emoji personalizado'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}