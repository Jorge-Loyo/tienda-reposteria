# 🔑 Claves de APIs - Casa Dulce Oriente

## 📋 Variables de Entorno Requeridas

### 🗄️ **Base de Datos**

```env
# Desarrollo (SQLite)
DATABASE_URL="file:./dev.db"

# Producción (PostgreSQL)
DATABASE_URL="postgresql://username:password@host:5432/database"
```

### 🔐 **Autenticación y Seguridad**

```env
# JWT Secret para autenticación (CRÍTICO - Cambiar en producción)
JWT_SECRET="AIzaSyDNoBIpBY77KqN4Ba6TJOi6ae9DR3J5zHg"
```

### ☁️ **Cloudinary (Gestión de Imágenes)**

```env
# Cloud Name (público)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dnc0btnuv"
CLOUDINARY_CLOUD_NAME="dnc0btnuv"

# API Key
CLOUDINARY_API_KEY="528497696243236"

# API Secret (PRIVADO)
CLOUDINARY_API_SECRET="qhJT-1WlXZzf25m99WFidMF-Ssw"
```

### 🗺️ **Google Maps**

```env
# Google Maps API Key (público)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSyA7NF5r-pJS1LO3ZvrYVYCDBlluGNC1Wq8"
```

### 📧 **Resend (Emails)**

```env
# Resend API Key para envío de emails
RESEND_API_KEY="re_5SLQZiWv_8AYYvrhpikqeXsNfVvRHE9uy"

# Email remitente (opcional)
FROM_EMAIL="onboarding@resend.dev"
```

### 🌐 **Configuración de Aplicación**

```env
# URL base de la aplicación
NEXT_PUBLIC_BASE_URL="http://54.234.83.233:3000"

# Entorno de ejecución
NODE_ENV="development"
```

---

## 🔧 Servicios Utilizados

### 1. **Cloudinary**

- **Propósito**: Almacenamiento y optimización de imágenes
- **Uso**: Productos, banners, avatares, Instagram posts
- **Cuenta**: dnc0btnuv
- **Dashboard**: https://cloudinary.com/console

### 2. **Google Maps**

- **Propósito**: Mapas interactivos y geolocalización
- **Uso**: Ubicación de la tienda, cálculo de rutas
- **Console**: https://console.cloud.google.com/apis/

### 3. **Resend**

- **Propósito**: Envío de emails transaccionales
- **Uso**: Recuperación de contraseñas, confirmaciones
- **Dashboard**: https://resend.com/dashboard

### 4. **BCV API**

- **Propósito**: Tasa de cambio USD a Bolívares
- **Uso**: Conversión automática de precios
- **Endpoint**: https://pydolarve.org/api/v1/dollar

---

## 🚀 Configuración para Producción

### Variables Críticas a Cambiar

```env
# CAMBIAR OBLIGATORIAMENTE
JWT_SECRET="S2JXzg6oJTok88e6KHr028W8AdhROEGhNtjEhT8Iu9e0+kBbnNq7MCBKAB8EU3+3+T36mIqbst6xDfCaLTRURQ=="
DATABASE_URL="postgresql://[casadulce_admin]:[feqcOpqxs2U+6nlV9z+KNTbjbhDdCO0e6Sx9uMVNZ9Q/N771iCVujtGyrwXAn88h0wBugCBOvZxx4bNlQ88jfA==]@[HOST]:5432/[DATABASE]"
NEXT_PUBLIC_BASE_URL="http://54.234.83.233:3000"

# Mantener si funcionan correctamente
CLOUDINARY_CLOUD_NAME="dnc0btnuv"
CLOUDINARY_API_KEY="528497696243236"
CLOUDINARY_API_SECRET="qhJT-1WlXZzf25m99WFidMF-Ssw"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSyA7NF5r-pJS1LO3ZvrYVYCDBlluGNC1Wq8"
RESEND_API_KEY="re_5SLQZiWv_8AYYvrhpikqeXsNfVvRHE9uy"
```

---

## 🔒 Seguridad de las Claves

### Claves Públicas (Seguras para exponer)

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_BASE_URL`

### Claves Privadas (NUNCA exponer)

- `JWT_SECRET`
- `DATABASE_URL`
- `CLOUDINARY_API_SECRET`
- `RESEND_API_KEY`

---

## 📍 Información de Contacto Configurada

### Datos de la Empresa

```javascript
COMPANY_LOCATION: {
  lat: 10.135122,
  lng: -64.682316,
  address: '48P9+23P, Calle Bolívar, Barcelona 6001, Anzoátegui, Venezuela'
}

CONTACT: {
  phone: '0424-8536954',
  email: 'contacto@casadulce.com'
}
```

### WhatsApp

- **Número**: +58 424-853-6954
- **Formato internacional**: 584248536954

---

## 🛠️ Comandos Útiles

### Generar JWT Secret Seguro

```bash
# Opción 1: OpenSSL
openssl rand -base64 32

# Opción 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Verificar Variables de Entorno

```bash
# Ver todas las variables
printenv | grep -E "(DATABASE|JWT|CLOUDINARY|GOOGLE|RESEND)"

# Verificar variable específica
echo $JWT_SECRET
```

---

## 📊 Límites y Cuotas

### Cloudinary (Plan Gratuito)

- **Almacenamiento**: 25 GB
- **Transformaciones**: 25,000/mes
- **Ancho de banda**: 25 GB/mes

### Google Maps (Plan Gratuito)

- **Requests**: 28,000/mes
- **Maps JavaScript API**: $7/1000 requests después del límite

### Resend (Plan Gratuito)

- **Emails**: 3,000/mes
- **Dominios**: 1 dominio verificado

---

## 🔄 Backup de Configuración

### Archivo .env Completo (Desarrollo)

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dnc0btnuv"
CLOUDINARY_CLOUD_NAME="dnc0btnuv"
CLOUDINARY_API_KEY="528497696243236"
CLOUDINARY_API_SECRET="qhJT-1WlXZzf25m99WFidMF-Ssw"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSyA7NF5r-pJS1LO3ZvrYVYCDBlluGNC1Wq8"
JWT_SECRET="AIzaSyDNoBIpBY77KqN4Ba6TJOi6ae9DR3J5zHg"
RESEND_API_KEY="re_5SLQZiWv_8AYYvrhpikqeXsNfVvRHE9uy"
NEXT_PUBLIC_BASE_URL="http://54.234.83.233:3000"
```

---

## ⚠️ Notas Importantes

1. **JWT_SECRET**: Debe ser único y seguro en producción
2. **DATABASE_URL**: Cambiar a PostgreSQL para producción
3. **Cloudinary**: Monitorear uso para no exceder límites
4. **Google Maps**: Restringir API key por dominio en producción
5. **Resend**: Configurar dominio propio para mejor deliverability

---

## 📞 Soporte de APIs

### Cloudinary

- **Documentación**: https://cloudinary.com/documentation
- **Soporte**: https://support.cloudinary.com

### Google Maps

- **Documentación**: https://developers.google.com/maps
- **Soporte**: https://developers.google.com/maps/support

### Resend

- **Documentación**: https://resend.com/docs
- **Soporte**: https://resend.com/support

---

_Documento actualizado: Enero 2025_
_Versión: 1.0_

**🚨 IMPORTANTE: Mantener este archivo seguro y no compartir las claves privadas**
