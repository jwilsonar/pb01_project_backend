# Sistema de Gestión de Empleados - API REST

## Descripción

API REST desarrollada con NestJS para la gestión de empleados y recursos humanos. El sistema permite gestionar empleados, sus documentos y permisos de acceso basados en roles.

## Características Principales

- Autenticación JWT
- Roles de usuario (RRHH y empleados)
- Gestión de empleados (CRUD)
- Documentación OpenAPI/Swagger
- Validación de datos
- Manejo de errores estandarizado
- Seguridad y encriptación de contraseñas
- Migraciones de base de datos
- Seeders para datos iniciales

## Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL (v12 o superior)
- npm (incluido con Node.js)

## Configuración del Proyecto

1. **Clonar el repositorio**
```bash
git clone https://github.com/jwilsonar/pb01_project_backend.git
cd server
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=your_user
DATABASE_PASSWORD=your_password
DATABASE_NAME=your_database

# JWT
JWT_SECRET=your_jwt_secret

# Server
PORT=5000
```

4. **Ejecutar migraciones**
```bash
npm run migration:run
```

5. **Crear usuario inicial de RRHH**
```bash
npm run seed
```

## Estructura de la Base de Datos

### Tablas Principales
- **t_users**: Almacena información de usuarios y sus roles
- **t_employees**: Información específica de empleados
- **t_document_types**: Tipos de documentos permitidos
- **t_employee_documents**: Documentos asociados a empleados

## Usuarios y Roles

### Usuario de RRHH (por defecto)
- **Email**: rrhh@empresa.com
- **Contraseña**: Rrhh2024!
- **Rol**: RRHH (is_hr: true)
- **Permisos**: 
  - Crear empleados
  - Ver lista de empleados
  - Ver detalles de empleados
  - Actualizar empleados
  - Eliminar empleados

### Empleados Regulares
- Acceso limitado a su propia información
- No pueden crear/modificar otros empleados

## API Endpoints

### Autenticación
- **POST /api/auth/login**: Iniciar sesión
- **POST /api/auth/register**: Registrar nuevo usuario
- **POST /api/auth/logout**: Cerrar sesión

### Empleados (requiere rol RRHH)
- **GET /api/empleados**: Obtener lista de empleados
- **GET /api/empleados/:id**: Obtener detalles de un empleado
- **POST /api/empleados**: Crear nuevo empleado
- **PATCH /api/empleados/:id**: Actualizar empleado
- **DELETE /api/empleados/:id**: Eliminar empleado

## Documentación de la API

La documentación detallada de la API está disponible a través de Swagger UI:
```bash
# Iniciar el servidor
npm run start:dev

# Acceder a la documentación
http://localhost:5000/api/docs
```

## Scripts Disponibles

```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod

# Migraciones
npm run migration:generate -- src/migrations/NombreMigracion
npm run migration:run
npm run migration:revert

# Seeders
npm run seed

# Tests
npm run test
npm run test:e2e
npm run test:cov
```

## Seguridad

- Autenticación mediante JWT
- Contraseñas encriptadas con bcrypt
- Validación de roles y permisos
- Protección contra inyección SQL (TypeORM)
- Validación de datos de entrada
- CORS configurado

## Manejo de Errores

El sistema incluye manejo de errores estandarizado para:
- Errores de autenticación
- Errores de validación
- Errores de permisos
- Errores de base de datos
- Errores de negocio

## Buenas Prácticas Implementadas

- Arquitectura modular
- Principios SOLID
- Inyección de dependencias
- DTOs para validación de datos
- Interfaces y tipos TypeScript
- Documentación OpenAPI
- Logging estructurado
- Configuración centralizada

## Desarrollo

Para contribuir al proyecto:
1. Crear una rama para la nueva funcionalidad
2. Implementar cambios siguiendo el estilo de código
3. Escribir pruebas
4. Crear Pull Request

## Despliegue

Para desplegar en producción:
1. Configurar variables de entorno
2. Ejecutar migraciones
3. Compilar el proyecto
4. Iniciar con PM2 o similar

```bash
npm run build
npm run start:prod
```

## Soporte

Para reportar problemas o solicitar ayuda:
1. Crear un issue en el repositorio
2. Proporcionar detalles del problema
3. Incluir logs relevantes

## Licencia

[MIT licensed](LICENSE)
