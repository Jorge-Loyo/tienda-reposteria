# 🚀 Guía Completa: Despliegue en AWS EC2 + Neon PostgreSQL

## 📋 Revisión de Código para Producción

### ✅ Estado del Código: LISTO PARA PRODUCCIÓN

**Características de Seguridad Implementadas:**

- ✅ Rate limiting en endpoints críticos
- ✅ Headers de seguridad (CSP, XSS Protection, etc.)
- ✅ Sanitización de inputs y logs
- ✅ Autenticación JWT con cookies seguras
- ✅ Validación de datos con Zod
- ✅ Middleware de seguridad
- ✅ Manejo seguro de errores

**Optimizaciones para Producción:**

- ✅ Prisma con PostgreSQL
- ✅ Cloudinary para imágenes
- ✅ Build optimizado de Next.js
- ✅ Variables de entorno configuradas

---

## 🏗️ PARTE 1: Configuración de Base de Datos Neon

### 1.1 Crear Cuenta en Neon

```bash
# 1. Ve a https://neon.tech
# 2. Crea una cuenta gratuita
# 3. Crea un nuevo proyecto llamado "tienda-reposteria"
```

### 1.2 Obtener Credenciales

```bash
# En el dashboard de Neon:
# 1. Ve a "Connection Details"
# 2. Copia la "Connection string"
# 3. Debe verse así:
postgresql://neondb_owner:PASSWORD@HOST-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

---

## 🖥️ PARTE 2: Configuración de AWS EC2

### 2.1 Crear Instancia EC2

```bash
# 1. Inicia sesión en AWS Console
# 2. Ve a EC2 > Launch Instance
# 3. Configuración recomendada:
#    - AMI: Ubuntu Server 22.04 LTS
#    - Instance Type: t3.micro (Free Tier) o t3.small
#    - Storage: 20 GB gp3
#    - Security Group: HTTP (80), HTTPS (443), SSH (22), Custom (3000)
```

### 2.2 Configurar Security Group

```bash
# Reglas de entrada necesarias:
Type            Protocol    Port Range    Source
SSH             TCP         22           0.0.0.0/0
HTTP            TCP         80           0.0.0.0/0
HTTPS           TCP         443          0.0.0.0/0
Custom TCP      TCP         3000         0.0.0.0/0
```

### 2.3 Conectar a la Instancia

```bash
# Descargar el archivo .pem y conectar
chmod 400 tu-key.pem
ssh -i "tu-key.pem" ubuntu@TU-IP-PUBLICA
```

---

## ⚙️ PARTE 3: Configuración del Servidor

### 3.1 Actualizar Sistema

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install git curl build-essential nginx -y
```

### 3.2 Instalar Node.js

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
npm install -g pm2
```

### 3.3 Clonar Repositorio

```bash
git clone https://github.com/TU-USUARIO/tienda-reposteria.git
cd tienda-reposteria
npm install
```

---

## 🔧 PARTE 4: Configuración de Variables de Entorno

### 4.1 Crear Archivo .env

```bash
nano .env
```

### 4.2 Configurar Variables

```env
# Variables de la aplicación
NEXT_PUBLIC_BASE_URL="http://TU-IP-PUBLICA:3000"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="TU_GOOGLE_MAPS_API_KEY"

# Base de datos Neon
DATABASE_URL="postgresql://neondb_owner:TU_PASSWORD@TU_HOST-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Seguridad
JWT_SECRET="TU_JWT_SECRET_GENERADO"
RESEND_API_KEY="TU_RESEND_API_KEY"

# Cloudinary
CLOUDINARY_CLOUD_NAME="Tdnc0btnuv"
CLOUDINARY_API_KEY="TU_API_KEY"
CLOUDINARY_API_SECRET="TU_API_SECRET"
```

---

## 🗄️ PARTE 5: Configuración de Base de Datos

### 5.1 Crear Tablas

```bash
npx prisma db push
```

### 5.2 Sembrar Datos Iniciales

```bash
npm run db:seed
```

### 5.3 Verificar Conexión

```bash
npx prisma studio --port 5555
# Accede desde tu navegador: http://TU-IP:5555
```

---

## 🚀 PARTE 6: Despliegue de la Aplicación

### 6.1 Compilar Aplicación

```bash
npm run build
```

### 6.2 Iniciar con PM2

```bash
pm2 start npm --name "tienda-app" -- start
pm2 save
pm2 startup
```

### 6.3 Configurar Nginx (Opcional)

```bash
sudo nano /etc/nginx/sites-available/tienda-reposteria
```

```nginx
server {
    listen 80;
    server_name TU-IP-PUBLICA;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/tienda-reposteria /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 PARTE 7: Configuración SSL (Producción)

### 7.1 Instalar Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 7.2 Obtener Certificado (requiere dominio)

```bash
sudo certbot --nginx -d tu-dominio.com
```

---

## 📊 PARTE 8: Monitoreo y Mantenimiento

### 8.1 Comandos PM2 Útiles

```bash
pm2 status                    # Ver estado
pm2 logs tienda-app          # Ver logs
pm2 restart tienda-app       # Reiniciar
pm2 stop tienda-app          # Detener
pm2 delete tienda-app        # Eliminar
```

### 8.2 Actualizar Aplicación

```bash
git pull origin main
npm install
npm run build
pm2 restart tienda-app
```

### 8.3 Backup de Base de Datos

```bash
# Neon maneja backups automáticamente
# Para backup manual, usa pg_dump con la URL de conexión
```

---

## 🛠️ PARTE 9: Solución de Problemas

### 9.1 Problemas Comunes

**Error de conexión a base de datos:**

```bash
# Verificar variables de entorno
cat .env | grep DATABASE_URL

# Probar conexión
npx prisma db push
```

**Error de compilación:**

```bash
# Limpiar cache
rm -rf .next
npm install
npm run build
```

**Error de permisos:**

```bash
# Verificar permisos de archivos
sudo chown -R ubuntu:ubuntu /home/ubuntu/tienda-reposteria
```

### 9.2 Logs Importantes

```bash
# Logs de la aplicación
pm2 logs tienda-app

# Logs de Nginx
sudo tail -f /var/log/nginx/error.log

# Logs del sistema
sudo journalctl -u nginx -f
```

---

## 📝 PARTE 10: Lista de Verificación Final

### ✅ Checklist de Despliegue

- [ ] Instancia EC2 creada y configurada
- [ ] Base de datos Neon configurada
- [ ] Variables de entorno configuradas
- [ ] Aplicación compilada sin errores
- [ ] PM2 ejecutando la aplicación
- [ ] Nginx configurado (opcional)
- [ ] SSL configurado (para producción)
- [ ] Backup automático configurado
- [ ] Monitoreo configurado

### 🔗 URLs de Acceso

- **Aplicación:** `http://TU-IP-PUBLICA:3000`
- **Admin:** `http://TU-IP-PUBLICA:3000/admin`
- **Prisma Studio:** `http://TU-IP-PUBLICA:5555`

### 👤 Credenciales por Defecto

- **Email:** `admin@casadulce.com`
- **Password:** `258025`
- **Rol:** `MASTER`

---

## 🎯 Optimizaciones Adicionales

### Para Mayor Rendimiento:

1. **CDN:** Usar CloudFront para archivos estáticos
2. **Load Balancer:** Para múltiples instancias
3. **Redis:** Para rate limiting y cache
4. **Monitoring:** CloudWatch o Datadog

### Para Mayor Seguridad:

1. **WAF:** Web Application Firewall
2. **VPC:** Red privada virtual
3. **Secrets Manager:** Para variables sensibles
4. **Backup:** Estrategia de respaldo completa

---

**🎉 ¡Felicidades! Tu aplicación está lista para producción.**

Para soporte adicional, revisa los logs y la documentación de cada servicio utilizado.
