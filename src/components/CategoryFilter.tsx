"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import './CategoryFilter.css';

interface CategoryFilterProps {
  categories: { id: number; name: string }[];
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
            {getCategoryIcon(category.name)} {category.name}
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