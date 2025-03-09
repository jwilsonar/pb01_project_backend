# Documentación de la API

## Autenticación

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "access_token": "string",
  "user": {
    "id": "number",
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "is_hr": "boolean"
  }
}
```

### Registro
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201 Created):**
```json
{
  "access_token": "string",
  "user": {
    "id": "number",
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "is_hr": "boolean"
  }
}
```

## Empleados

Todos los endpoints de empleados requieren autenticación JWT y rol de RRHH.

### Listar Empleados
```http
GET /api/empleados
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "id": "number",
    "job_title": "string",
    "salary": "number",
    "first_name": "string",
    "last_name": "string",
    "email": "string"
  }
]
```

### Obtener Empleado
```http
GET /api/empleados/{id}
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "number",
  "job_title": "string",
  "salary": "number",
  "first_name": "string",
  "last_name": "string",
  "email": "string"
}
```

### Crear Empleado
```http
POST /api/empleados
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "job_title": "string",
  "salary": "number",
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201 Created):**
```json
{
  "id": "number",
  "job_title": "string",
  "salary": "number",
  "first_name": "string",
  "last_name": "string",
  "email": "string"
}
```

### Actualizar Empleado
```http
PATCH /api/empleados/{id}
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "job_title": "string (opcional)",
  "salary": "number (opcional)"
}
```

**Response (200 OK):**
```json
{
  "id": "number",
  "job_title": "string",
  "salary": "number",
  "first_name": "string",
  "last_name": "string",
  "email": "string"
}
```

### Eliminar Empleado
```http
DELETE /api/empleados/{id}
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response (204 No Content)**

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Error en los datos enviados |
| 401 | Unauthorized - Token inválido o expirado |
| 403 | Forbidden - No tiene permisos para acceder |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - El recurso ya existe |
| 500 | Internal Server Error - Error del servidor |

## Validaciones

### Empleado
- **job_title**: String, requerido
- **salary**: Number, requerido, mínimo 0
- **email**: String, requerido, formato email válido
- **password**: String, requerido, mínimo 6 caracteres

### Usuario
- **first_name**: String, requerido
- **last_name**: String, requerido
- **email**: String, requerido, formato email válido, único
- **password**: String, requerido, mínimo 6 caracteres

## Seguridad

### Headers Requeridos
```http
Authorization: Bearer {token}
Content-Type: application/json
```

### CORS
Configurado para permitir solicitudes desde:
- http://localhost:3000

### Rate Limiting
- 100 solicitudes por IP por minuto

## Ejemplos de Uso

### Login como RRHH
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rrhh@empresa.com","password":"Rrhh2024!"}'
```

### Crear Empleado
```bash
curl -X POST http://localhost:5000/api/empleados \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "job_title": "Desarrollador",
    "salary": 50000,
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@empresa.com",
    "password": "123456"
  }'
```

## Notas Adicionales

- Todas las respuestas incluyen el header `Content-Type: application/json`
- Los timestamps se devuelven en formato ISO 8601
- Los errores incluyen un mensaje descriptivo en español
- Las contraseñas se almacenan encriptadas con bcrypt
- Los tokens JWT expiran en 24 horas 