# Guía de Despliegue

## Variables de Entorno Requeridas

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="tu-secreto-jwt-super-seguro"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="tu-api-key"
CLOUDINARY_CLOUD_NAME="tu-cloudinary-name"
CLOUDINARY_API_KEY="tu-cloudinary-key"
CLOUDINARY_API_SECRET="tu-cloudinary-secret"
```

## Despliegue en Vercel

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Configurar base de datos (PlanetScale/Neon)
4. Deploy automático

```bash
npm run build
vercel --prod
```

## Despliegue Local

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

## Base de Datos

### Migraciones
```bash
npx prisma migrate dev
npx prisma generate
```

### Seed inicial
```bash
npx prisma db seed
```

## Configuración de Producción

- Usar PostgreSQL en lugar de SQLite
- Configurar HTTPS
- Implementar rate limiting
- Configurar monitoreo
- Backup automático de BD