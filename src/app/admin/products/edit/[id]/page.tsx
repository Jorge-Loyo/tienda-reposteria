// src/app/admin/products/edit/[id]/page.tsx
import { PrismaClient } from '@prisma/client';
import ProductForm from '@/components/ProductForm';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

// Esta función obtiene los datos de un único producto de la base de datos
async function getProduct(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    // Si no se encuentra un producto con ese ID, se muestra una página de error 404
    if (!product) {
      notFound();
    }
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    // Si hay un error en la base de datos, también se muestra una página 404
    notFound();
  }
}

// La página recibe los 'params' de la URL, que incluyen el ID dinámico
export default async function EditProductPage({ params }: { params: { id: string } }) {
  const productId = Number(params.id);
  // Se valida que el ID sea un número válido
  if (isNaN(productId)) {
    notFound();
  }
  
  // Se obtienen los datos del producto desde la base de datos
  const productFromDb = await getProduct(productId);

  // Se adaptan los datos para el formulario:
  // Se convierte cualquier valor 'null' en un string vacío '' para evitar errores de tipo.
  const initialDataForForm = {
    id: productFromDb.id,
    name: productFromDb.name,
    description: productFromDb.description ?? '',
    priceUSD: productFromDb.priceUSD,
    stock: productFromDb.stock,
    sku: productFromDb.sku ?? '',
    imageUrl: productFromDb.imageUrl ?? '',
  };

  return (
    // Se utiliza el mismo layout ancho que en la página de "Crear Nuevo Producto"
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center mb-10">Editar Producto</h1>
      {/* Se renderiza el componente del formulario, pasándole los datos iniciales del producto */}
      <ProductForm initialData={initialDataForForm} />
    </div>
  );
}