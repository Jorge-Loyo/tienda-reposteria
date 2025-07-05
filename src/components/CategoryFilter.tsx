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
    <div className="flex flex-wrap gap-2 mb-8">
      <Button
        variant={!currentCategory ? 'default' : 'outline'}
        onClick={() => handleFilter(null)}
      >
        Todos
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={currentCategory === category.name ? 'default' : 'outline'}
          onClick={() => handleFilter(category.name)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}