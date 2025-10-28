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
  
  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'development' 
              ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https: http: ws: wss:; frame-src 'self';"
              : "default-src 'self'; script-src 'self' 'unsafe-inline' https://maps.googleapis.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: res.cloudinary.com images.unsplash.com maps.googleapis.com; font-src 'self' data:; connect-src 'self' http://18.235.130.104 https://localhost:3002 https://nominatim.openstreetmap.org https://maps.googleapis.com https://pydolarvenezuela.vercel.app https://www.bcv.org.ve https://api.cloudinary.com; frame-src 'self';"
          },
        ],
      },
    ];
  },
};

export default nextConfig;
