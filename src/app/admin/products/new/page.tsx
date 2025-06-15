// src/app/admin/products/new/page.tsx
import ProductForm from '@/components/ProductForm';

export default function NewProductPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center mb-10">Crear Nuevo Producto</h1>
      <ProductForm />
    </div>
  );
}
