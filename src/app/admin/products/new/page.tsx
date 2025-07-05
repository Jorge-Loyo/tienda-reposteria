// src/app/admin/products/new/page.tsx
import { PrismaClient } from '@prisma/client';
import ProductForm from '@/components/ProductForm'; // Asegúrate de que la ruta sea correcta

const prisma = new PrismaClient();

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Crear Nuevo Producto</h1>
      <ProductForm categories={categories} />
    </div>
  );
}