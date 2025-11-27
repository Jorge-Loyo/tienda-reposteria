"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import './CategoryFilter.css';

interface CategoryFilterProps {
  categories: { id: number; name: string; icon?: string | null }[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  const handleFilter = (categoryName: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (categoryName) {
      params.set('category', categoryName);
    } else {
      params.delete('category');
    }
    router.push(`/tienda?${params.toString()}`);
  };

  return (
    <div className="category-filter-container">
      <h2 className="category-filter-title gradient-text">Explora por Categorías</h2>
      
      {/* Desplegable para móviles */}
      <div className="category-filter-mobile">
        <Select value={currentCategory || 'all'} onValueChange={(value) => handleFilter(value === 'all' ? null : value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">🏠 Todos</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.icon || getCategoryIcon(category.name)} {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Botones para desktop */}
      <div className="category-filter-buttons">
        <button
          className={cn(
            "category-filter-button",
            !currentCategory ? "active" : "inactive"
          )}
          onClick={() => handleFilter(null)}
        >
          🏠 Todos
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={cn(
              "category-filter-button",
              currentCategory === category.name ? "active" : "inactive"
            )}
            onClick={() => handleFilter(category.name)}
          >
            {category.icon || getCategoryIcon(category.name)} {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// Función para obtener iconos según la categoría
function getCategoryIcon(categoryName: string): string {
  const icons: Record<string, string> = {
    'Harinas': '🌾',
    'Azúcares': '🍯',
    'Chocolates': '🍫',
    'Colorantes': '🎨',
    'Esencias': '🌸',
    'Decoración': '✨',
    'Moldes': '🧁',
    'Utensilios': '🥄',
    'Ingredientes': '🥚',
    'Especias': '🌿'
  };
  return icons[categoryName] || '📦';
}