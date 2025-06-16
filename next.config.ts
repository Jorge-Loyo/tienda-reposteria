// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // 1. Dominio que ya teníamos para Cloudinary
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**', // Permite cualquier ruta dentro de ese hostname
      },
      // 2. Añadimos el nuevo dominio para los mapas estáticos
      {
        protocol: 'https',
        hostname: 'staticmap.openstreetmap.de',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;