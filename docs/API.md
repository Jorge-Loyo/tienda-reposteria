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

## Códigos de Error
- `400` - Datos inválidos
- `401` - No autenticado
- `403` - Sin permisos
- `404` - No encontrado
- `500` - Error servidor