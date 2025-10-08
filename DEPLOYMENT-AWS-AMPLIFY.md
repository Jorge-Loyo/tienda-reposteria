# 🚀 Guía de Despliegue AWS Amplify - Casa Dulce Oriente

## 📋 Prerrequisitos

- ✅ Cuenta AWS activa
- ✅ Repositorio GitHub con el código
- ✅ Cuenta Cloudinary configurada
- ✅ Dominio personalizado (opcional)

---

## 🔧 PASO 1: Preparar el Código para Producción

### 1.1 Migrar de SQLite a PostgreSQL

```bash
# Instalar dependencia PostgreSQL
npm install pg @types/pg
```

**Actualizar `prisma/schema.prisma`:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 1.2 Actualizar Variables de Entorno

**Crear `.env.production`:**
```env
# Base de datos (se configurará después)
DATABASE_URL="postgresql://username:password@host:5432/database"

# JWT Secret (generar uno nuevo para producción)
JWT_SECRET="tu-jwt-secret-super-seguro-para-produccion"

# Cloudinary (usar tus credenciales existentes)
CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"

# Google Maps (opcional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="tu-google-maps-key"
```

### 1.3 Actualizar package.json

**Agregar scripts de build:**
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate",
    "db:migrate": "prisma migrate deploy",
    "db:seed": "prisma db seed"
  }
}
```

### 1.4 Crear amplify.yml

**Crear archivo `amplify.yml` en la raíz:**
```yaml
version: 1
backend:
  phases:
    build:
      commands:
        - npm ci
        - npx prisma generate
        - npx prisma migrate deploy
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

---

## 🗄️ PASO 2: Configurar Base de Datos RDS

### 2.1 Crear RDS PostgreSQL

1. **Ir a AWS Console → RDS**
2. **Crear base de datos:**
   - Engine: PostgreSQL
   - Template: Free tier
   - Instance: db.t3.micro
   - Storage: 20 GB
   - Username: `casadulce_admin`
   - Password: `[generar-password-seguro]`
   - Database name: `casadulce_db`

### 2.2 Configurar Security Group

1. **Ir a EC2 → Security Groups**
2. **Crear nuevo Security Group:**
   - Name: `casadulce-db-sg`
   - Inbound rules:
     - Type: PostgreSQL
     - Port: 5432
     - Source: Anywhere (0.0.0.0/0)

### 2.3 Obtener Connection String

**Formato:**
```
postgresql://casadulce_admin:[PASSWORD]@[RDS-ENDPOINT]:5432/casadulce_db
```

**Ejemplo:**
```
postgresql://casadulce_admin:mi-password@casadulce-db.abc123.us-east-1.rds.amazonaws.com:5432/casadulce_db
```

---

## 🌐 PASO 3: Configurar AWS Amplify

### 3.1 Crear Aplicación Amplify

1. **Ir a AWS Console → Amplify**
2. **Crear nueva aplicación:**
   - Seleccionar: "Host web app"
   - Source: GitHub
   - Autorizar GitHub
   - Seleccionar repositorio: `tienda-reposteria`
   - Branch: `main`

### 3.2 Configurar Build Settings

1. **En la configuración de build:**
   - Usar el archivo `amplify.yml` creado
   - Node version: 18.x

### 3.3 Configurar Variables de Entorno

**En Amplify Console → App settings → Environment variables:**

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://casadulce_admin:[PASSWORD]@[RDS-ENDPOINT]:5432/casadulce_db` |
| `JWT_SECRET` | `tu-jwt-secret-super-seguro-para-produccion` |
| `CLOUDINARY_CLOUD_NAME` | `tu-cloud-name` |
| `CLOUDINARY_API_KEY` | `tu-api-key` |
| `CLOUDINARY_API_SECRET` | `tu-api-secret` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | `tu-google-maps-key` |

---

## 🔄 PASO 4: Migrar Datos

### 4.1 Ejecutar Migraciones

```bash
# En tu máquina local, conectar a RDS
export DATABASE_URL="postgresql://casadulce_admin:[PASSWORD]@[RDS-ENDPOINT]:5432/casadulce_db"

# Ejecutar migraciones
npx prisma migrate deploy

# Ejecutar seed (datos iniciales)
npx prisma db seed
```

### 4.2 Migrar Datos Existentes (si tienes datos)

```bash
# Exportar datos de SQLite
npx prisma db pull
npx prisma generate

# Script para migrar datos (crear archivo migrate-data.js)
node migrate-data.js
```

---

## 🌍 PASO 5: Configurar Dominio (Opcional)

### 5.1 Comprar Dominio en Route 53

1. **Ir a Route 53 → Registered domains**
2. **Registrar dominio:** `casadulceoriente.com`
3. **Costo:** ~$12/año

### 5.2 Configurar Dominio en Amplify

1. **En Amplify Console → Domain management**
2. **Add domain:** `casadulceoriente.com`
3. **Configurar subdominios:**
   - `www.casadulceoriente.com` → Redirect to apex
   - `casadulceoriente.com` → Main site

---

## ✅ PASO 6: Verificar Despliegue

### 6.1 Checklist de Verificación

- [ ] ✅ Aplicación carga correctamente
- [ ] ✅ Base de datos conecta
- [ ] ✅ Login funciona
- [ ] ✅ Productos se muestran
- [ ] ✅ Carrito funciona
- [ ] ✅ Panel admin accesible
- [ ] ✅ Imágenes de Cloudinary cargan
- [ ] ✅ SSL/HTTPS activo

### 6.2 URLs de Verificación

- **Sitio principal:** `https://[app-id].amplifyapp.com`
- **Panel admin:** `https://[app-id].amplifyapp.com/admin`
- **API health:** `https://[app-id].amplifyapp.com/api/health`

---

## 💰 PASO 7: Monitoreo de Costos

### 7.1 Configurar Billing Alerts

1. **Ir a AWS Billing → Budgets**
2. **Crear budget:**
   - Type: Cost budget
   - Amount: $30/month
   - Alert threshold: 80%

### 7.2 Costos Estimados Mensuales

| Servicio | Costo Estimado |
|----------|----------------|
| Amplify Hosting | $1-5 |
| RDS t3.micro | $15-20 |
| Route 53 (dominio) | $1 |
| Data Transfer | $1-3 |
| **TOTAL** | **$18-29/mes** |

---

## 🔧 PASO 8: Configuración Post-Despliegue

### 8.1 Crear Usuario Master

```bash
# Conectar a la base de datos y crear usuario master
# Usar el email: jorgenayati@gmail.com
# Password: 258025
# Role: MASTER
```

### 8.2 Configurar Backup Automático

1. **En RDS Console → Automated backups**
2. **Configurar:**
   - Backup retention: 7 days
   - Backup window: 03:00-04:00 UTC

---

## 🚨 TROUBLESHOOTING

### Problemas Comunes

**❌ Error de conexión a base de datos:**
```bash
# Verificar Security Group permite conexiones en puerto 5432
# Verificar que RDS está en estado "available"
```

**❌ Build falla en Amplify:**
```bash
# Verificar que todas las variables de entorno están configuradas
# Revisar logs en Amplify Console
```

**❌ Prisma no encuentra tablas:**
```bash
# Ejecutar migraciones manualmente:
npx prisma migrate deploy
```

---

## 📞 SOPORTE

**En caso de problemas:**
1. Revisar logs en Amplify Console
2. Verificar variables de entorno
3. Comprobar estado de RDS
4. Contactar soporte AWS si es necesario

---

## 🎉 ¡LISTO!

Tu ecommerce Casa Dulce Oriente está ahora desplegado en AWS con:
- ✅ Escalabilidad automática
- ✅ SSL/HTTPS
- ✅ CDN global
- ✅ Backup automático
- ✅ Monitoreo incluido

**URL de producción:** `https://[tu-dominio].com`