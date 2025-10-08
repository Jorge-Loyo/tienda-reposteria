import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedInstagramPosts() {
  const posts = [
    {
      url: 'https://www.instagram.com/casadulceoriente/p/DPR3YNEAT2W/',
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
      caption: 'Los mejores insumos para tus creaciones 🍰 #CasaDulceOriente #Repostería',
      order: 1,
      isActive: true
    },
    {
      url: 'https://www.instagram.com/casadulceoriente/p/DMz6xkGACzV/',
      imageUrl: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=400&h=400&fit=crop',
      caption: 'Nuevos productos disponibles ✨ ¡Ven y descúbrelos! #Barcelona #Anzoátegui',
      order: 2,
      isActive: true
    },
    {
      url: 'https://www.instagram.com/casadulceoriente/p/DMvIn5XMyV6/',
      imageUrl: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=400&fit=crop',
      caption: 'Calidad garantizada en cada producto 🌟 #CalidadPremium',
      order: 3,
      isActive: true
    },
    {
      url: 'https://www.instagram.com/casadulceoriente/reel/DPhX0b_ETtM/',
      imageUrl: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&h=400&fit=crop',
      caption: 'Tu aliado perfecto en repostería 🎨 #TuAliado #Repostería',
      order: 4,
      isActive: true
    }
  ];

  for (const post of posts) {
    await prisma.instagramPost.create({
      data: post
    });
  }

  console.log('✅ Publicaciones de Instagram creadas exitosamente');
}

seedInstagramPosts()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });