'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X } from 'lucide-react';

// Biblioteca amplia de emojis organizados por categorías
const EMOJI_CATEGORIES = {
  'Comida y Bebida': [
    '🍰', '🧁', '🍪', '🍫', '🍬', '🍭', '🍯', '🥛', '☕', '🍵', 
    '🥤', '🧃', '🍓', '🍒', '🍑', '🥝', '🍌', '🍍', '🥭', '🍎',
    '🍏', '🍊', '🍋', '🥥', '🥜', '🌰', '🍞', '🥖', '🥨', '🥯',
    '🧀', '🥚', '🍳', '🥓', '🥞', '🧈', '🍯', '🥣', '🍲', '🥘'
  ],
  'Herramientas y Utensilios': [
    '🥄', '🍴', '🔪', '🥢', '🍽️', '🥣', '🥛', '☕', '🍵', '🧊',
    '⚖️', '🔥', '❄️', '⏰', '⏲️', '📏', '📐', '✂️', '🔧', '🔨',
    '⚙️', '🛠️', '🧰', '🔩', '⛏️', '🪓', '🗜️', '🔗', '⛓️', '📎'
  ],
  'Decoración y Arte': [
    '✨', '🌟', '⭐', '💫', '🎨', '🖌️', '🖍️', '✏️', '📝', '🎭',
    '🎪', '🎨', '🖼️', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🎗️',
    '🎀', '🎁', '🎊', '🎉', '🎈', '🎂', '🕯️', '🔮', '💎', '💍'
  ],
  'Naturaleza': [
    '🌸', '🌺', '🌻', '🌷', '🌹', '🥀', '🌾', '🌿', '☘️', '🍀',
    '🍃', '🌱', '🌲', '🌳', '🌴', '🌵', '🌶️', '🥕', '🌽', '🥒',
    '🥬', '🥦', '🧄', '🧅', '🍄', '🥔', '🍅', '🫐', '🍇', '🥈'
  ],
  'Símbolos': [
    '💯', '💢', '💥', '💫', '💦', '💨', '🕳️', '💣', '💬', '👁️‍🗨️',
    '🗨️', '🗯️', '💭', '💤', '📢', '📣', '📯', '🔔', '🔕', '🎵',
    '🎶', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🪕', '🎻', '🎤'
  ]
};

interface EmojiPickerProps {
  selectedEmoji?: string;
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

export function EmojiPicker({ selectedEmoji, onEmojiSelect, onClose }: EmojiPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Comida y Bebida');

  // Filtrar emojis por búsqueda
  const getFilteredEmojis = () => {
    if (!searchTerm) {
      return EMOJI_CATEGORIES[activeCategory as keyof typeof EMOJI_CATEGORIES] || [];
    }

    // Buscar en todas las categorías
    const allEmojis = Object.values(EMOJI_CATEGORIES).flat();
    return allEmojis.filter(emoji => {
      // Aquí podrías agregar lógica más sofisticada de búsqueda
      // Por ahora, solo mostramos todos si hay término de búsqueda
      return true;
    });
  };

  const filteredEmojis = getFilteredEmojis();

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden shadow-lg">
      <CardContent className="p-6">
        {/* Header con búsqueda */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar emoji..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-8"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Categorías */}
        {!searchTerm && (
          <div className="flex gap-1 mb-4 overflow-x-auto">
            {Object.keys(EMOJI_CATEGORIES).map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className="whitespace-nowrap text-xs"
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {/* Grid de emojis */}
        <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
          {filteredEmojis.map((emoji, index) => (
            <button
              key={`${emoji}-${index}`}
              onClick={() => {
                onEmojiSelect(emoji);
              }}
              className={`
                w-12 h-12 flex items-center justify-center text-xl rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer
                ${selectedEmoji === emoji ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500' : ''}
              `}
            >
              {emoji}
            </button>
          ))}
        </div>

        {filteredEmojis.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron emojis
          </div>
        )}
      </CardContent>
    </Card>
  );
}