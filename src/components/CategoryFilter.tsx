"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // Asegúrate de que este archivo de utilidad exista en tu proyecto shadcn

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
    <div className="glass p-6 rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold gradient-text mb-6 text-center">Explora por Categorías</h2>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          className={cn(
            "px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105",
            !currentCategory
              ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg"
              : "bg-white/50 text-gray-700 hover:bg-white/80 border border-white/30"
          )}
          onClick={() => handleFilter(null)}
        >
          🏠 Todos
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={cn(
              "px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105",
              currentCategory === category.name
                ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg"
                : "bg-white/50 text-gray-700 hover:bg-white/80 border border-white/30"
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