import { PrismaClient } from '@prisma/client';
import ProductForm from '@/components/ProductForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Crear Nuevo Producto</h1>
            <p className="text-gray-600">Agrega un nuevo producto al catálogo</p>
          </div>
          <Button variant="modern" asChild>
            <Link href="/admin/products">← Volver</Link>
          </Button>
        </div>

        <div className="glass p-8 rounded-2xl shadow-xl">
          <ProductForm categories={categories} />
        </div>
      </div>
    </div>
  );
}