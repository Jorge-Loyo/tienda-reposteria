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
  const [showEmojiPicker, setShowEmojiPicker] = useState(true);

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Selecciona un Emoji para la Categoría</Label>
      
      <div className="relative">
        <EmojiPicker
          selectedEmoji={selectedImage}
          onEmojiSelect={onImageSelect}
          onClose={() => setShowEmojiPicker(false)}
        />
      </div>
      
      {selectedImage && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg flex items-center gap-3">
          <span className="text-3xl">{selectedImage}</span>
          <div>
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              Emoji seleccionado
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Este emoji representará la categoría
            </p>
          </div>
        </div>
      )}
    </div>
  );
}