import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { InstagramPostForm } from '@/components/InstagramPostForm';

const prisma = new PrismaClient();

async function getInstagramPost(id: number) {
  const post = await prisma.instagramPost.findUnique({
    where: { id }
  });

  if (!post) {
    notFound();
  }

  return post;
}

export default async function EditInstagramPostPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const post = await getInstagramPost(parseInt(params.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <PageHeader 
          title="Editar Publicación de Instagram"
          description="Modifica la información de la publicación"
        />

        <div className="glass rounded-2xl shadow-xl p-8">
          <InstagramPostForm post={post} />
        </div>
      </div>
    </div>
  );
}