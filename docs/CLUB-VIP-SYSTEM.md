# 🏆 Sistema Club y VIP - Casa Dulce Oriente

## 📋 Resumen del Sistema

Casa Dulce Oriente cuenta con dos sistemas de fidelización complementarios:

1. **🏆 El Club de Casa Dulce**: Sistema de puntos y competencia mensual
2. **💳 Casa Dulce VIP**: Sistema de crédito rotativo para clientes selectos

---

## 🏆 El Club de Casa Dulce

### Concepto General

Sistema de gamificación que recompensa la lealtad del cliente mediante:
- Acumulación de puntos por compras
- Niveles de membresía con beneficios crecientes
- Competencia mensual con premios
- Sistema de cashback por nivel

### Mecánica de Puntos

- **Sistema Inverso**: Se configura cuántos dólares se necesitan para ganar 1 punto
- **Ejemplo**: Si se configura $5 = 1 punto, una compra de $25 otorga 5 puntos
- **Acumulación**: Los puntos se suman automáticamente al perfil del usuario
- **Persistencia**: Los puntos totales se mantienen, los mensuales se reinician

### Niveles de Membresía

| Nivel | Requisitos | Beneficios |
|-------|------------|------------|
| 🥉 Bronce | Puntos configurables | Cashback básico |
| 🥈 Plata | Más puntos requeridos | Mayor cashback |
| 🥇 Oro | Máximo nivel | Mejor cashback |

### Competencia Mensual

- **Ranking**: Basado en puntos del mes actual
- **Premios**: Configurables por administrador
  - 🥇 Primer lugar: Premio principal
  - 🥈 Segundo lugar: Premio secundario  
  - 🥉 Tercer lugar: Premio de consolación
- **Tipos de Premio**: Dinero (vales) o productos físicos
- **Reinicio**: Automático cada mes

### Configuración Administrativa

**Ubicación**: `/admin/club` → Configuración Club

**Parámetros Configurables**:
- Dólares necesarios para 1 punto
- Premios mensuales (imagen, descripción, tipo)
- Umbrales de puntos para cada nivel
- Porcentajes de cashback por nivel

---

## 💳 Casa Dulce VIP

### Concepto General

Sistema de crédito rotativo gratuito para clientes selectos, funcionando como una tarjeta de crédito sin intereses.

### Características Principales

- **Asignación Manual**: Solo administradores pueden asignar estatus VIP
- **Crédito Rotativo**: Se renueva automáticamente cada mes
- **Sin Intereses**: Completamente gratuito para el cliente
- **Fechas de Corte**: Recurrentes mensualmente

### Funcionamiento del Crédito

1. **Asignación**: Admin asigna límite de crédito y fecha de corte
2. **Uso**: Cliente compra hasta agotar su límite disponible
3. **Pago**: Cliente paga antes de la fecha de corte
4. **Renovación**: Crédito se restaura automáticamente

### Sistema de Fechas de Corte

**Opciones Disponibles**:
- **Día Específico**: 1, 5, 10, 15, 20, 25 de cada mes
- **Último Día**: Último día de cada mes
- **Día Hábil**: Primer día hábil de cada mes

**Lógica de Cálculo**:
- Si la fecha ya pasó en el mes actual, se programa para el siguiente mes
- Manejo automático de meses con diferentes días (28, 30, 31)
- Exclusión automática de fines de semana para días hábiles

### Estados del Crédito VIP

- **Activo/Inactivo**: Control administrativo del acceso
- **Límite de Crédito**: Monto máximo disponible
- **Saldo Actual**: Crédito disponible para usar
- **Monto Usado**: Crédito utilizado en el ciclo actual

### Gestión Administrativa

**Ubicación**: `/admin/club` → Gestión VIP

**Funciones Disponibles**:
- Ver todos los usuarios VIP del sistema
- Asignar crédito a nuevos usuarios VIP
- Editar límites y fechas de corte existentes
- Monitorear uso y saldos de crédito

---

## 🗄️ Estructura de Base de Datos

### Tabla: club_config
```sql
- id: INTEGER PRIMARY KEY
- points_per_dollar: DECIMAL(10,2)
- first_prize, second_prize, third_prize: INTEGER
- first_prize_object, second_prize_object, third_prize_object: TEXT (JSON)
- bronze_threshold, silver_threshold, gold_threshold: INTEGER
- bronze_cashback, silver_cashback, gold_cashback: DECIMAL(5,2)
```

### Tabla: user_points
```sql
- id: INTEGER PRIMARY KEY
- user_id: INTEGER (FK to User)
- total_points: INTEGER
- monthly_points: INTEGER
- level: VARCHAR (BRONZE, SILVER, GOLD)
- last_updated: TIMESTAMP
```

### Tabla: vip_credits
```sql
- id: INTEGER PRIMARY KEY
- user_id: INTEGER (FK to User)
- credit_limit: DECIMAL(10,2)
- current_balance: DECIMAL(10,2)
- used_amount: DECIMAL(10,2)
- is_active: BOOLEAN
- payment_due_date: TIMESTAMP
- notes: TEXT
- created_at, updated_at: TIMESTAMP
```

---

## 🔧 APIs Principales

### Club APIs
- `GET /api/club/config` - Configuración pública del club
- `PUT /api/club/config` - Actualizar configuración (Admin)
- `GET /api/club/top-users` - Ranking mensual
- `GET /api/club/user-stats` - Estadísticas del usuario

### VIP APIs
- `GET /api/club/vip-users` - Listar usuarios VIP (Admin)
- `GET /api/club/all-vip-users` - Todos los usuarios CLIENTE_VIP (Admin)
- `POST /api/club/assign-vip` - Asignar crédito VIP (Admin)
- `PUT /api/club/update-vip-credit` - Actualizar crédito VIP (Admin)

---

## 🎯 Flujo de Usuario

### Para Clientes Regulares (Club)

1. **Registro**: Usuario se registra en la plataforma
2. **Compras**: Realiza compras y acumula puntos automáticamente
3. **Progreso**: Ve su progreso en `/perfil/club`
4. **Competencia**: Participa automáticamente en ranking mensual
5. **Beneficios**: Recibe cashback según su nivel

### Para Clientes VIP

1. **Selección**: Administrador identifica cliente para VIP
2. **Asignación**: Admin asigna crédito y fecha de corte
3. **Notificación**: Cliente ve su estatus en `/perfil/vip`
4. **Uso**: Cliente compra usando su crédito disponible
5. **Pago**: Cliente paga antes de fecha de corte
6. **Renovación**: Crédito se restaura automáticamente

---

## 🔒 Seguridad y Validaciones

### Validaciones del Sistema

- **Límites de Crédito**: No se puede exceder el límite asignado
- **Fechas Válidas**: Validación de fechas de corte mensuales
- **Roles de Usuario**: Solo CLIENTE_VIP puede acceder a funciones VIP
- **Permisos Admin**: Solo administradores pueden gestionar VIP

### Auditoría y Logs

- **Cambios de Crédito**: Registro de todas las modificaciones
- **Asignaciones VIP**: Log de nuevas asignaciones
- **Uso de Crédito**: Historial de transacciones
- **Errores del Sistema**: Logging detallado para debugging

---

## 📊 Métricas y Reportes

### Métricas del Club

- **Participación**: Usuarios activos en el club
- **Distribución de Niveles**: Cantidad por nivel de membresía
- **Puntos Otorgados**: Total de puntos distribuidos
- **Engagement**: Frecuencia de participación

### Métricas VIP

- **Usuarios VIP Activos**: Cantidad con crédito asignado
- **Utilización de Crédito**: Porcentaje de uso promedio
- **Pagos Puntuales**: Cumplimiento de fechas de corte
- **Límites Promedio**: Análisis de límites asignados

---

## 🚀 Beneficios del Sistema

### Para el Negocio

- **Fidelización**: Clientes regresan por puntos y beneficios
- **Incremento de Ventas**: Competencia mensual motiva compras
- **Flujo de Caja**: Sistema VIP permite ventas anticipadas
- **Segmentación**: Identificación de clientes de alto valor

### Para los Clientes

- **Recompensas**: Beneficios tangibles por lealtad
- **Gamificación**: Experiencia divertida de compra
- **Flexibilidad**: Crédito VIP para compras planificadas
- **Exclusividad**: Acceso a beneficios especiales

---

## 🔄 Mantenimiento y Actualizaciones

### Tareas Mensuales

- **Reinicio de Rankings**: Automático el 1ro de cada mes
- **Procesamiento de Premios**: Notificación a ganadores
- **Renovación VIP**: Restauración automática de créditos
- **Análisis de Métricas**: Revisión de performance

### Configuraciones Estacionales

- **Premios Especiales**: Ajustes para fechas especiales
- **Promociones VIP**: Beneficios temporales adicionales
- **Límites Dinámicos**: Ajustes según comportamiento de pago

---

_Documentación actualizada: Octubre 2025_
_Versión: 1.0_