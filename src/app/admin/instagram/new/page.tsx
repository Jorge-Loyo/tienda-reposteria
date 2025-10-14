import { PageHeader } from '@/components/PageHeader';
import { InstagramPostForm } from '@/components/InstagramPostForm';

export default function NewInstagramPostPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <PageHeader>
          Nueva Publicación de Instagram
        </PageHeader>
        <p className="text-gray-600 text-center mb-8">Agrega una nueva publicación para mostrar en la página principal</p>

        <div className="glass rounded-2xl shadow-xl p-8">
          <InstagramPostForm />
        </div>
      </div>
    </div>
  );
}