# API Documentation

## Autenticación

### POST /api/auth/login
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### GET /api/auth/me
Obtener datos del usuario autenticado.

## Productos

### GET /api/products
Query: `category`, `search`, `page`, `limit`

### POST /api/products (Admin)
```json
{
  "name": "Producto",
  "priceUSD": 5.99,
  "stock": 50,
  "categoryId": 1
}
```

## Pedidos

### GET /api/orders
Listar pedidos según rol de usuario.

### POST /api/orders
```json
{
  "customerName": "Juan Pérez",
  "customerEmail": "juan@example.com",
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 2.50
    }
  ]
}
```

## Club de Casa Dulce

### GET /api/club/config
Obtener configuración del club (público).

### PUT /api/club/config (Admin)
```json
{
  "points_per_dollar": 5.0,
  "first_prize_object": "{\"type\":\"money\",\"amount\":200}",
  "bronze_threshold": 50,
  "bronze_cashback": 2.5
}
```

### GET /api/club/top-users
Obtener ranking mensual de usuarios.

### GET /api/club/user-stats
Obtener estadísticas del usuario autenticado.

## Sistema VIP

### GET /api/club/vip-users (Admin)
Listar todos los usuarios VIP con sus créditos.

### GET /api/club/all-vip-users (Admin)
Listar todos los usuarios con rol CLIENTE_VIP.

### POST /api/club/assign-vip (Admin)
```json
{
  "userId": "user@example.com",
  "creditLimit": 500.00,
  "notes": "Cliente premium",
  "paymentDueDate": "15"
}
```

### PUT /api/club/update-vip-credit (Admin)
```json
{
  "vipId": "1",
  "creditLimit": 750.00,
  "paymentDueDate": "ultimo"
}
```

### Opciones de Fecha de Corte VIP
- `"1"`, `"5"`, `"10"`, `"15"`, `"20"`, `"25"` - Día específico del mes
- `"ultimo"` - Último día del mes
- `"habil"` - Primer día hábil del mes

## Códigos de Error
- `400` - Datos inválidos
- `401` - No autenticado
- `403` - Sin permisos
- `404` - No encontrado
- `500` - Error servidor