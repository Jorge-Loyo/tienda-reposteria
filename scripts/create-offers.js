const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createOffers() {
  try {
    // Obtener algunos productos existentes
    const products = await prisma.product.findMany({
      take: 3,
      where: { published: true }
    });

    if (products.length === 0) {
      console.log('No hay productos para crear ofertas');
      return;
    }

    // Crear ofertas para los primeros productos
    for (const product of products) {
      const offerPrice = product.priceUSD * 0.8; // 20% de descuento
      const offerEndsAt = new Date();
      offerEndsAt.setDate(offerEndsAt.getDate() + 7); // Oferta válida por 7 días

      await prisma.product.update({
        where: { id: product.id },
        data: {
          isOfferActive: true,
          offerPriceUSD: offerPrice,
          offerEndsAt: offerEndsAt
        }
      });

      console.log(`Oferta creada para ${product.name}: $${product.priceUSD} -> $${offerPrice}`);
    }

    console.log('Ofertas creadas exitosamente');
  } catch (error) {
    console.error('Error creando ofertas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createOffers();