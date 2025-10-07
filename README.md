# Casa Dulce Oriente - E-commerce de Repostería

Sistema de comercio electrónico especializado en insumos de repostería, desarrollado con Next.js 14, TypeScript y Prisma.

## 🚀 Características

- **Catálogo de productos** con categorías y ofertas especiales
- **Carrito de compras** con gestión de estado usando Zustand
- **Sistema de autenticación** con JWT y roles de usuario
- **Panel administrativo** para gestión de productos, pedidos y usuarios
- **Cálculo automático de envío** por zonas geográficas
- **Conversión de moneda** USD/VES con tasa BCV actualizada
- **Tema claro/oscuro** con persistencia
- **Responsive design** optimizado para móviles

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Base de datos**: SQLite con Prisma ORM
- **Autenticación**: JWT con cookies seguras
- **Estado**: Zustand para carrito de compras
- **Validación**: Zod schemas
- **Imágenes**: Cloudinary

## 📦 Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd tienda-reposteria

# Instalar dependencias
npm install

# Configurar base de datos
npx prisma generate
npx prisma db push
npx prisma db seed

# Ejecutar en desarrollo
npm run dev
```

## ⚙️ Variables de Entorno

Crear archivo `.env` con:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="tu-secreto-jwt-super-seguro"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="tu-api-key-de-google-maps"
CLOUDINARY_CLOUD_NAME="tu-cloudinary-name"
CLOUDINARY_API_KEY="tu-cloudinary-key"
CLOUDINARY_API_SECRET="tu-cloudinary-secret"
```

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── admin/             # Panel administrativo
│   ├── api/               # API Routes
│   ├── cart/              # Carrito de compras
│   ├── checkout/          # Proceso de compra
│   └── tienda/            # Catálogo público
├── components/            # Componentes reutilizables
│   └── ui/                # Componentes base UI
├── lib/                   # Utilidades y configuración
├── store/                 # Estado global (Zustand)
├── types/                 # Tipos TypeScript
└── context/               # Contextos React
```

## 👥 Roles de Usuario

### ADMIN
- Gestión completa de productos y categorías
- Administración de usuarios y roles
- Control de pedidos y estados
- Configuración de zonas de envío
- Gestión de ofertas especiales

### ORDERS_USER
- Visualización y gestión de pedidos
- Actualización de estados de pedidos
- Acceso limitado al panel administrativo

## 🛒 Funcionalidades Principales

### Catálogo de Productos
- Filtrado por categorías
- Búsqueda de productos
- Visualización de ofertas activas
- Gestión de stock en tiempo real

### Carrito de Compras
- Añadir/quitar productos
- Actualizar cantidades
- Cálculo automático de totales
- Persistencia entre sesiones

### Proceso de Compra
- Formulario de datos del cliente
- Selección de zona de envío
- Cálculo de costos de envío
- Múltiples métodos de pago

### Panel Administrativo
- Dashboard con métricas
- CRUD completo de productos
- Gestión de categorías
- Administración de pedidos con Kanban
- Control de usuarios y permisos

## 🔐 Seguridad

- Autenticación JWT con cookies httpOnly
- Middleware de protección de rutas
- Validación de datos con Zod
- Sanitización de inputs
- Control de acceso basado en roles

## 📱 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Datos del usuario actual
- `POST /api/auth/logout` - Cerrar sesión

### Productos
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto (Admin)
- `PUT /api/products/[id]` - Actualizar producto (Admin)
- `DELETE /api/products/[id]` - Eliminar producto (Admin)

### Pedidos
- `GET /api/orders` - Listar pedidos
- `POST /api/orders` - Crear pedido
- `PUT /api/orders/[id]` - Actualizar estado (Admin)

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Docker
```bash
docker build -t tienda-reposteria .
docker run -p 3000:3000 tienda-reposteria
```

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests de integración
npm run test:integration

# Coverage
npm run test:coverage
```

## 📄 Licencia

Este proyecto es privado y propietario de Casa Dulce Oriente.

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📞 Soporte

Para soporte técnico contactar a: contacto@casadulce.com
