/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    remotePatterns: [
      // Dominio para las imágenes de productos (Cloudinary)
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // Dominio para las imágenes de la página de inicio (Unsplash)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Dominio para los mapas estáticos (Google Maps)
      {
          protocol: 'https',
          hostname: 'maps.googleapis.com',
      }
    ],
  },
  
  // Headers de seguridad (CSP completamente deshabilitado)
  // async headers() {
  //   return [];
  // },
};

export default nextConfig;
