import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/PageHeader';
import { InstagramPostsTable } from '@/components/InstagramPostsTable';

const prisma = new PrismaClient();

async function getInstagramPosts() {
  return await prisma.instagramPost.findMany({
    orderBy: { order: 'asc' }
  });
}

export default async function InstagramAdminPage() {
  const posts = await getInstagramPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <PageHeader>
          Gestión de Instagram
        </PageHeader>
        <p className="text-gray-600 text-center mb-8">Administra las publicaciones que aparecen en la página principal</p>

        <div className="mb-8 flex justify-between items-center">
          <Button variant="outline" asChild>
            <Link href="/admin/marketing">
              ← Volver
            </Link>
          </Button>
          <Button variant="gradient" asChild>
            <Link href="/admin/instagram/new">
              Agregar Nueva Publicación
            </Link>
          </Button>
        </div>

        <div className="glass rounded-2xl shadow-xl overflow-hidden">
          <InstagramPostsTable posts={posts} />
        </div>
      </div>
    </div>
  );
}