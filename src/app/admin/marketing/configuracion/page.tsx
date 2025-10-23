import db from '@/db/db';
import { SiteConfigForm } from '@/components/SiteConfigForm';

async function getSiteConfig() {
  try {
    const aboutImage = await db.siteConfig.findUnique({
      where: { key: 'about_section_image' }
    });

    return {
      aboutSectionImage: aboutImage?.value || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1987&auto=format&fit=crop'
    };
  } catch (error) {
    console.error('Error fetching site config:', error);
    return {
      aboutSectionImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1987&auto=format&fit=crop'
    };
  }
}

export default async function SiteConfigPage() {
  const config = await getSiteConfig();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">Configuración del Sitio</h1>
        <p className="text-gray-600 mt-2">Personaliza las imágenes y contenido de las secciones principales</p>
      </div>
      
      <SiteConfigForm config={config} />
    </div>
  );
}