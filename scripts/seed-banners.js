const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedBanners() {
  try {
    // Crear banners de prueba
    await prisma.banner.createMany({
      data: [
        {
          title: 'El Arte de la Repostería Comienza Aquí',
          alt: 'Banner de macarons coloridos',
          src: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?q=80&w=2070&auto=format&fit=crop',
          active: true,
          order: 1
        },
        {
          title: 'Banner 2',
          alt: 'Banner 2',
          src: 'https://res.cloudinary.com/dnc0btnuv/image/upload/v1753390660/Banner_2_oxssz2.png',
          active: true,
          order: 2
        },
        {
          title: 'Banner 1',
          alt: 'Banner 1',
          src: 'https://res.cloudinary.com/dnc0btnuv/image/upload/v1753390659/Banner_1_anb2mn.png',
          active: true,
          order: 3
        }
      ]
    });

    console.log('Banners creados exitosamente');
  } catch (error) {
    console.error('Error creando banners:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedBanners();