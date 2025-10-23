import { PrismaClient } from '@prisma/client';
import ProductForm from '@/components/ProductForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import './new-product.css';

const prisma = new PrismaClient();

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="new-product-container">
      <div className="new-product-content">
        <div className="new-product-header">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Crear Nuevo Producto</h1>
            <p className="text-gray-600">Agrega un nuevo producto al catálogo</p>
          </div>
          <Button variant="modern" asChild>
            <Link href="/admin/products">← Volver</Link>
          </Button>
        </div>

        <div className="new-product-form-container">
          <ProductForm categories={categories} />
        </div>
      </div>
    </div>
  );
}