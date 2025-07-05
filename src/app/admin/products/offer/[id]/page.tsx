import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { OfferForm } from '@/components/OfferForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const prisma = new PrismaClient();

export default async function ManageOfferPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-6">
        <PageHeader>Gestionar Oferta para "{product.name}"</PageHeader>
        <Button variant="outline" asChild>
          <Link href="/admin/products">Volver a Productos</Link>
        </Button>
      </div>
      <OfferForm product={product} />
    </div>
  );
}