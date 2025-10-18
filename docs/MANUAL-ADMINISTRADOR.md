# 🔧 Manual de Administrador - Casa Dulce Oriente

## 🔐 Acceso al Panel de Administración

### Credenciales de Acceso

- **URL**: `/admin`
- **Email Master**: `jorgenayati@gmail.com`
- **Contraseña**: `258025`
- **Roles**: MASTER (acceso completo), MARKETING (gestión de contenido)

### Seguridad

- **Autenticación JWT**: Sesiones seguras de 8 horas
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **Autorización**: Verificación de permisos por endpoint

---

## 📊 Dashboard Principal

### Métricas en Tiempo Real

- **Pedidos Pendientes**: Órdenes que requieren atención
- **Productos con Stock Bajo**: Alertas de inventario
- **Ventas del Día**: Ingresos diarios
- **Nuevos Clientes**: Registros recientes

### Navegación Rápida

- **Gestión de Productos**: Crear, editar, eliminar productos
- **Gestión de Pedidos**: Procesar y seguir órdenes
- **Marketing**: Banners, ofertas, testimonios
- **Configuración**: Zonas de envío, categorías

---

## 🛍️ Gestión de Productos

### Crear Nuevo Producto

1. **Ir a Admin → Productos → Nuevo Producto**
2. **Información Básica**:
   - Nombre del producto
   - Descripción detallada
   - Precio en USD
   - SKU (código único)
   - Categoría
3. **Inventario**:
   - Stock inicial
   - Estado (publicado/borrador)
4. **Imagen**:
   - Subir imagen (se almacena en Cloudinary)
   - Optimización automática
5. **Guardar**: Producto disponible inmediatamente

### Editar Productos Existentes

1. **Lista de Productos**: Ver todos los productos
2. **Filtros**: Por categoría, stock, estado
3. **Acciones Rápidas**:
   - Editar información
   - Cambiar stock
   - Activar/desactivar
   - Eliminar producto

### Gestión de Stock

- **Actualización Manual**: Cambiar cantidad disponible
- **Alertas Automáticas**: Notificación cuando stock < 5
- **Historial**: Registro de cambios de inventario
- **Stock Negativo**: Prevención automática

---

## 📦 Gestión de Pedidos

### Estados de Pedidos

- **PENDIENTE_DE_PAGO**: Recién creado, esperando pago
- **PAGADO**: Pago confirmado
- **PREPARANDO**: En proceso de preparación
- **ENVIADO**: Despachado al cliente
- **ENTREGADO**: Completado exitosamente
- **CANCELADO**: Cancelado por cliente o admin

### Procesar Pedidos

1. **Ver Pedido**: Click en número de orden
2. **Información Completa**:
   - Datos del cliente
   - Productos ordenados
   - Método de pago
   - Dirección de entrega
3. **Cambiar Estado**: Actualizar progreso del pedido
4. **Notas Internas**: Agregar comentarios para el equipo
5. **Generar PDF**: Factura o guía de despacho

### Confirmación de Pagos

1. **Pedidos Pendientes**: Lista de pagos por confirmar
2. **Verificar Pago**: Revisar comprobante recibido
3. **Confirmar**: Cambiar estado a "PAGADO"
4. **Número de Referencia**: Registrar comprobante de pago
5. **Notificación**: Cliente recibe confirmación automática

---

## 🎨 Gestión de Marketing

### Banners Principales

1. **Admin → Marketing → Banners**
2. **Crear Banner**:
   - Título (opcional)
   - Imagen (recomendado: 1920x600px)
   - Texto alternativo
   - Orden de aparición
3. **Gestión**:
   - Activar/desactivar
   - Reordenar banners
   - Editar contenido
   - Eliminar banner

### Ofertas y Descuentos

1. **Admin → Marketing → Productos → Ofertas**
2. **Crear Oferta**:
   - Seleccionar producto
   - Precio de oferta
   - Fecha de inicio
   - Fecha de finalización
3. **Gestión**:
   - Ver ofertas activas
   - Extender vigencia
   - Finalizar oferta anticipadamente

### Testimonios

1. **Admin → Marketing → Testimonios**
2. **Gestión de Testimonios**:
   - Ver todos los testimonios
   - Filtrar por estrellas (1-5)
   - Filtrar por estado (visible/oculto)
   - Aprobar testimonios nuevos
   - Ocultar testimonios inapropiados
   - Eliminar testimonios
3. **Paginación**: 10 testimonios por página
4. **Moderación**: Solo testimonios aprobados aparecen en la web

---

## 📍 Gestión de Zonas de Envío

### Configurar Zonas

1. **Admin → Configuración → Zonas de Envío**
2. **Crear Nueva Zona**:
   - Nombre (ej: Barcelona)
   - Identificador único
   - Costo de envío
   - Umbral de envío gratis
   - Códigos postales (opcional)
3. **Estado**: Activar/desactivar zona

### Costos de Envío

- **Costo Base**: Precio estándar por zona
- **Envío Gratis**: Monto mínimo para envío gratuito
- **Actualización**: Cambios reflejados inmediatamente
- **Historial**: Registro de cambios de precios

---

## 📂 Gestión de Categorías

### Crear Categorías

1. **Admin → Productos → Categorías**
2. **Nueva Categoría**:
   - Nombre único
   - Imagen representativa (opcional)
   - Descripción
3. **Organización**: Orden de aparición en la tienda

### Gestión

- **Editar**: Cambiar nombre o imagen
- **Eliminar**: Solo si no tiene productos asociados
- **Reordenar**: Cambiar orden de visualización

---

## 👥 Gestión de Usuarios

### Roles de Usuario

- **MASTER**: Acceso completo al sistema
- **MARKETING**: Gestión de contenido y testimonios
- **ORDERS_USER**: Solo realizar pedidos (clientes)

### Administrar Usuarios

1. **Ver Usuarios**: Lista completa de usuarios registrados
2. **Cambiar Rol**: Promover usuarios a roles administrativos
3. **Activar/Desactivar**: Suspender cuentas si es necesario
4. **Información**: Ver datos de perfil y historial de pedidos

---

## 📊 Reportes y Estadísticas

### Métricas Disponibles

- **Productos Totales**: Cantidad en catálogo
- **Clientes Únicos**: Basado en emails de pedidos
- **Calificación Promedio**: De testimonios aprobados
- **Ventas por Período**: Ingresos por fecha
- **Productos Más Vendidos**: Ranking de popularidad

### Exportar Datos

- **Pedidos**: Exportar a Excel/CSV
- **Productos**: Lista completa con stock
- **Clientes**: Base de datos de contactos

---

## 🔧 Configuración del Sistema

### Variables de Entorno

- **DATABASE_URL**: Conexión a base de datos
- **JWT_SECRET**: Clave de encriptación
- **CLOUDINARY\_\***: Configuración de imágenes
- **BCV_API**: Tasa de cambio automática

### Mantenimiento

- **Backup de Base de Datos**: Respaldos automáticos
- **Limpieza de Imágenes**: Eliminar archivos no utilizados
- **Logs del Sistema**: Monitoreo de errores
- **Actualizaciones**: Despliegue de nuevas versiones

---

## 📱 Gestión de Contenido Instagram

### Publicaciones

1. **Admin → Marketing → Instagram**
2. **Agregar Publicación**:
   - URL de la publicación
   - Imagen destacada
   - Descripción
   - Orden de aparición
3. **Gestión**:
   - Activar/desactivar
   - Reordenar publicaciones
   - Eliminar publicaciones

---

## 🚨 Monitoreo y Alertas

### Alertas Automáticas

- **Stock Bajo**: Productos con menos de 5 unidades
- **Pedidos Pendientes**: Órdenes sin procesar por más de 24h
- **Errores del Sistema**: Fallos en APIs o base de datos
- **Intentos de Acceso**: Intentos de login fallidos

### Logs de Seguridad

- **Accesos Administrativos**: Registro de logins
- **Cambios Críticos**: Modificaciones importantes
- **Intentos de Intrusión**: Actividad sospechosa
- **Rate Limiting**: Bloqueos por exceso de requests

---

## 🔄 Flujo de Trabajo Recomendado

### Gestión Diaria

1. **Revisar Pedidos Nuevos**: Procesar órdenes pendientes
2. **Confirmar Pagos**: Verificar comprobantes recibidos
3. **Actualizar Stock**: Ajustar inventario según ventas
4. **Moderar Testimonios**: Aprobar comentarios nuevos

### Gestión Semanal

1. **Revisar Métricas**: Analizar ventas y tendencias
2. **Actualizar Ofertas**: Crear nuevas promociones
3. **Gestionar Contenido**: Actualizar banners e Instagram
4. **Backup de Datos**: Verificar respaldos automáticos

### Gestión Mensual

1. **Análisis de Ventas**: Reportes detallados
2. **Optimización de Catálogo**: Eliminar productos sin ventas
3. **Actualización de Precios**: Ajustes según mercado
4. **Mantenimiento del Sistema**: Actualizaciones y limpieza

---

## 🆘 Solución de Problemas

### Problemas Comunes

**Error al subir imágenes**

- Verificar conexión con Cloudinary
- Comprobar formato de imagen (JPG, PNG)
- Revisar tamaño máximo (5MB)

**Pedidos no se crean**

- Verificar stock de productos
- Comprobar configuración de zonas de envío
- Revisar logs de errores en la consola

**Usuarios no pueden iniciar sesión**

- Verificar estado de la cuenta (activa)
- Comprobar credenciales
- Revisar rate limiting

### Contacto de Soporte Técnico

- **Desarrollador**: Contacto directo para problemas críticos
- **Documentación**: Manual técnico disponible
- **Logs del Sistema**: Información detallada de errores

---

## 📋 Checklist de Seguridad

### Verificaciones Regulares

- [ ] Cambiar contraseñas administrativas cada 3 meses
- [ ] Revisar usuarios con permisos administrativos
- [ ] Verificar logs de acceso sospechoso
- [ ] Comprobar actualizaciones de seguridad
- [ ] Validar respaldos de base de datos
- [ ] Revisar configuración de rate limiting

### Mejores Prácticas

- **Contraseñas Fuertes**: Mínimo 8 caracteres, números y símbolos
- **Acceso Limitado**: Solo otorgar permisos necesarios
- **Sesiones Seguras**: Cerrar sesión al terminar
- **Navegación Privada**: Usar modo incógnito en computadoras compartidas

---

_Manual actualizado: Octubre 2025_
_Versión: 1.0_
