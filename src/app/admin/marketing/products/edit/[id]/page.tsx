import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { MarketingProductForm } from '@/components/MarketingProductForm';

const prisma = new PrismaClient();

async function getProduct(id: number) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true
    }
  });

  if (!product) {
    notFound();
  }

  return product;
}

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });
}

export default async function EditMarketingProductPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const [product, categories] = await Promise.all([
    getProduct(parseInt(params.id)),
    getCategories()
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <PageHeader 
          title={`Editar: ${product.name}`}
          description="Solo puedes modificar la imagen y descripción del producto"
        />

        <div className="glass rounded-2xl shadow-xl p-8">
          <MarketingProductForm product={product} categories={categories} />
        </div>
      </div>
    </div>
  );
}