'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X } from 'lucide-react';

// Biblioteca amplia de emojis organizados por categorías con palabras clave
const EMOJI_CATEGORIES = {
  'Comida y Bebida': [
    { emoji: '🍰', keywords: ['torta', 'pastel', 'cake', 'dulce'] },
    { emoji: '🧁', keywords: ['cupcake', 'magdalena', 'muffin'] },
    { emoji: '🍪', keywords: ['galleta', 'cookie'] },
    { emoji: '🍫', keywords: ['chocolate', 'barra'] },
    { emoji: '🍬', keywords: ['caramelo', 'dulce', 'azucar'] },
    { emoji: '🍭', keywords: ['chupeta', 'paleta', 'lollipop'] },
    { emoji: '🍯', keywords: ['miel', 'honey'] },
    { emoji: '🥛', keywords: ['leche', 'milk', 'vaso'] },
    { emoji: '☕', keywords: ['cafe', 'coffee'] },
    { emoji: '🍵', keywords: ['te', 'tea'] },
    { emoji: '🍓', keywords: ['fresa', 'strawberry'] },
    { emoji: '🍌', keywords: ['banana', 'platano'] },
    { emoji: '🍎', keywords: ['manzana', 'apple'] },
    { emoji: '🍊', keywords: ['naranja', 'orange'] },
    { emoji: '🥜', keywords: ['nuez', 'fruto seco', 'nut'] },
    { emoji: '🍞', keywords: ['pan', 'bread'] },
    { emoji: '🧀', keywords: ['queso', 'cheese'] },
    { emoji: '🥚', keywords: ['huevo', 'egg'] }
  ],
  'Herramientas y Utensilios': [
    { emoji: '🥄', keywords: ['cuchara', 'spoon'] },
    { emoji: '🍴', keywords: ['tenedor', 'fork'] },
    { emoji: '🔪', keywords: ['cuchillo', 'knife'] },
    { emoji: '🍽️', keywords: ['plato', 'plate'] },
    { emoji: '🥣', keywords: ['bowl', 'tazon', 'recipiente'] },
    { emoji: '⚖️', keywords: ['balanza', 'peso', 'scale'] },
    { emoji: '🔥', keywords: ['fuego', 'fire', 'calor'] },
    { emoji: '❄️', keywords: ['frio', 'hielo', 'cold'] },
    { emoji: '⏰', keywords: ['reloj', 'tiempo', 'clock'] },
    { emoji: '📏', keywords: ['regla', 'medida', 'ruler'] },
    { emoji: '✂️', keywords: ['tijera', 'scissors'] },
    { emoji: '🔧', keywords: ['herramienta', 'tool'] },
    { emoji: '🧰', keywords: ['caja', 'herramientas', 'toolbox'] }
  ],
  'Decoración y Arte': [
    { emoji: '✨', keywords: ['brillo', 'sparkle', 'decoracion'] },
    { emoji: '🌟', keywords: ['estrella', 'star'] },
    { emoji: '🎨', keywords: ['arte', 'pintura', 'art'] },
    { emoji: '🖌️', keywords: ['pincel', 'brush'] },
    { emoji: '🎀', keywords: ['lazo', 'bow', 'decoracion'] },
    { emoji: '🎁', keywords: ['regalo', 'gift', 'caja'] },
    { emoji: '🎊', keywords: ['confeti', 'celebration'] },
    { emoji: '🎉', keywords: ['fiesta', 'party'] },
    { emoji: '🎈', keywords: ['globo', 'balloon'] },
    { emoji: '🎂', keywords: ['torta', 'cumpleanos', 'birthday'] },
    { emoji: '🕯️', keywords: ['vela', 'candle'] },
    { emoji: '💎', keywords: ['diamante', 'joya', 'diamond'] },
    { emoji: '📦', keywords: ['caja', 'box', 'paquete'] }
  ],
  'Naturaleza': [
    { emoji: '🌸', keywords: ['flor', 'flower', 'rosa'] },
    { emoji: '🌺', keywords: ['flor', 'hibisco'] },
    { emoji: '🌻', keywords: ['girasol', 'sunflower'] },
    { emoji: '🌷', keywords: ['tulipan', 'tulip'] },
    { emoji: '🌹', keywords: ['rosa', 'rose'] },
    { emoji: '🌾', keywords: ['trigo', 'wheat', 'cereal'] },
    { emoji: '🌿', keywords: ['hierba', 'herb', 'hoja'] },
    { emoji: '🍀', keywords: ['trebol', 'clover', 'suerte'] },
    { emoji: '🍃', keywords: ['hoja', 'leaf'] },
    { emoji: '🌱', keywords: ['planta', 'plant', 'semilla'] },
    { emoji: '🌲', keywords: ['arbol', 'tree', 'pino'] },
    { emoji: '🌵', keywords: ['cactus'] },
    { emoji: '🍄', keywords: ['hongo', 'mushroom'] }
  ],
  'Símbolos': [
    { emoji: '💯', keywords: ['cien', 'hundred', 'perfecto'] },
    { emoji: '💫', keywords: ['estrella', 'magic'] },
    { emoji: '💬', keywords: ['mensaje', 'chat'] },
    { emoji: '🔔', keywords: ['campana', 'bell'] },
    { emoji: '🎵', keywords: ['musica', 'music', 'nota'] },
    { emoji: '🎶', keywords: ['musica', 'music', 'notas'] },
    { emoji: '📦', keywords: ['caja', 'box', 'paquete'] },
    { emoji: '📋', keywords: ['lista', 'clipboard'] },
    { emoji: '📝', keywords: ['escribir', 'write', 'nota'] }
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
      const categoryEmojis = EMOJI_CATEGORIES[activeCategory as keyof typeof EMOJI_CATEGORIES] || [];
      return categoryEmojis.map(item => item.emoji);
    }

    // Buscar en todas las categorías
    const allEmojis = Object.values(EMOJI_CATEGORIES).flat();
    const searchLower = searchTerm.toLowerCase();
    
    return allEmojis
      .filter(item => 
        item.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchLower)
        )
      )
      .map(item => item.emoji);
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
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Categorías */}
        {!searchTerm && (
          <div className="flex gap-1 mb-4 overflow-x-auto">
            {Object.keys(EMOJI_CATEGORIES).map((category) => (
              <Button
                key={category}
                type="button"
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
              type="button"
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