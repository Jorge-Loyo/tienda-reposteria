import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/PageHeader';

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Button variant="outline" asChild>
            <Link href="/perfil">
              ← Volver
            </Link>
          </Button>
        </div>

        <PageHeader 
          title="Marketing"
          description="Gestiona el contenido visual y promocional de tu tienda"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="glass p-8 rounded-2xl shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="9" cy="9" r="2"/>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold gradient-text">Banner Principal</h3>
                <p className="text-gray-600">Gestiona las imágenes del carrusel</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Administra las imágenes que aparecen en el banner principal de la página de inicio. 
              Puedes agregar, editar y organizar las imágenes del carrusel.
            </p>
            <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
              <Link href="/admin/banner">
                Gestionar Banner
              </Link>
            </Button>
          </div>

          <div className="glass p-8 rounded-2xl shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold gradient-text">Instagram</h3>
                <p className="text-gray-600">Gestiona las publicaciones destacadas</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Administra las publicaciones de Instagram que se muestran en la página principal. 
              Agrega, edita y organiza las publicaciones destacadas.
            </p>
            <Button asChild className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white">
              <Link href="/admin/instagram">
                Gestionar Instagram
              </Link>
            </Button>
          </div>

          <div className="glass p-8 rounded-2xl shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 1v6m6-6v6"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold gradient-text">Productos</h3>
                <p className="text-gray-600">Edita imágenes y descripciones</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Actualiza las imágenes y descripciones de los productos. 
              Solo contenido visual y descriptivo, sin afectar precios o inventario.
            </p>
            <Button asChild className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white">
              <Link href="/admin/marketing/products">
                Gestionar Productos
              </Link>
            </Button>
          </div>

          <div className="glass p-8 rounded-2xl shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold gradient-text">Testimonios</h3>
                <p className="text-gray-600">Administra comentarios de clientes</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Revisa y decide qué testimonios de clientes se mostrarán en la página principal. 
              Controla la visibilidad de los comentarios recibidos.
            </p>
            <Button asChild className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
              <Link href="/admin/marketing/testimonios">
                Gestionar Testimonios
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}