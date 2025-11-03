# Streamify

Una aplicación web moderna para descubrir, calificar y gestionar películas. Streamify permite a los usuarios explorar un catálogo de películas, calificarlas con estrellas, y a los administradores gestionar películas, géneros y miembros del equipo.

## Tecnologías

### Frontend
- **React 19** con TypeScript
- **Vite** como bundler
- **React Router** para navegación
- **React Hook Form** para gestión de formularios
- **Tailwind CSS** para estilos
- **Shadcn UI** para componentes

### Backend
- **Node.js** con **Express**
- **TypeScript**
- **PostgreSQL** como base de datos
- **Argon2** para hash de contraseñas
- **JOSE** para tokens JWT

### Herramientas
- **pnpm** como gestor de paquetes
- **Monorepo** con workspaces

## Requisitos Previos

- Node.js (v24 o superior)
- pnpm instalado globalmente
- PostgreSQL (v12 o superior)
- Base de datos `streamify` creada

## Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd streamify
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**
   
   En el directorio `server/`, crea un archivo `.env` con las siguientes variables:
   ```env
    PG_USER=someuser
    PG_PASSWORD=somepassword
    SIGNING_SECRET=somesecret
   ```

   > 💡 **Tip:** Puedes generar un secreto JWT con `pnpm secrets:new`

4. **Compilar el backend**
   ```bash
   pnpm run -C server build
   ```

5. **Crear el esquema de la base de datos**
   ```bash
   pnpm run -C server database:create
   ```

6. **Cargar datos de prueba (opcional)**
   ```bash
   pnpm run -C server database:seed
   ```

## Uso

### Desarrollo

**Iniciar el servidor backend:**
```bash
pnpm run -C server start:dev
```

El servidor estará disponible en `http://localhost:3000`

**Iniciar el servidor frontend:**
```bash
pnpm run -C frontend start:dev
```

El frontend estará disponible en `http://localhost:5173` (o el puerto que Vite asigne)

### Producción

**Compilar el backend:**
```bash
pnpm run -C server build
```

**Iniciar el servidor:**
```bash
pnpm run -C server start
```

**Compilar el frontend:**
```bash
pnpm run -C frontend build
```

## Estructura del Proyecto

```
streamify/
├── frontend/          # Aplicación React
│   ├── src/
│   │   ├── api/      # Cliente API
│   │   ├── components/ # Componentes reutilizables
│   │   ├── hooks/    # Custom hooks
│   │   ├── model/    # Tipos TypeScript
│   │   └── pages/    # Páginas/views
│   └── package.json
├── server/            # API Express
│   ├── src/
│   │   ├── config/   # Configuración y scripts de DB
│   │   ├── routers/  # Rutas de la API
│   │   ├── repositories/ # Acceso a datos
│   │   └── index.ts
│   └── package.json
├── execution-plan.md  # Plan de ejecución del proyecto
└── README.md         # Este archivo
```

## Actualización del Proyecto

Si necesitas actualizar tu repositorio y base de datos después de hacer pull:

### 1. Guardar cambios locales (opcional)

Si tienes cambios en archivos existentes que quieres preservar:

```bash
git checkout -b backup
git add .
git commit -m "Guardando cambios locales"
git checkout main
```

### 2. Actualizar el repositorio

```bash
git pull
```

### 3. Deshacer cambios locales (si no los guardaste)

```bash
git restore .
```

> ⚠️ **Nota:** Esto solo afecta archivos existentes. Los archivos nuevos que hayas creado estarán a salvo.

### 4. Recrear la base de datos

```bash
# Eliminar el esquema actual (te pedirá la contraseña de PostgreSQL)
psql -h localhost -p 5432 -U tu_usuario -W -d streamify -c "DROP SCHEMA streamify CASCADE;"

# Compilar el backend
pnpm run -C server build

# Recrear el esquema
pnpm run -C server database:create

# Cargar datos de prueba
pnpm run -C server database:seed
```

### 5. Arranca los servidores

```bash
# Terminal 1 - Backend
pnpm run -C server start:dev

# Terminal 2 - Frontend
pnpm run -C frontend start:dev
```

## Scripts Disponibles

### Root
- `pnpm secrets:new` - Genera un nuevo secreto JWT aleatorio

### Server
- `pnpm run -C server build` - Compila TypeScript a JavaScript
- `pnpm run -C server start` - Inicia el servidor en producción
- `pnpm run -C server start:dev` - Inicia el servidor en modo desarrollo con nodemon
- `pnpm run -C server database:create` - Crea el esquema de la base de datos
- `pnpm run -C server database:seed` - Carga datos de prueba en la base de datos
- `pnpm run -C server lint` - Ejecuta el linter
- `pnpm run -C server fix` - Corrige errores de linting automáticamente

### Frontend
- `pnpm run -C frontend start:dev` - Inicia el servidor de desarrollo Vite
- `pnpm run -C frontend build` - Construye la aplicación para producción
- `pnpm run -C frontend preview` - Previsualiza la build de producción
- `pnpm run -C frontend lint` - Ejecuta el linter

## Base de Datos

El esquema de la base de datos se define en `server/src/config/sql/streamify-dml.sql`.

Los datos de prueba se cargan desde `server/src/config/sql/streamify-seeds.sql`.

## Autenticación

El sistema utiliza JWT para autenticación. Los tokens se almacenan en localStorage del navegador.

## Funcionalidades Principales

### Usuario
- Registro e inicio de sesión
- Explorar catálogo de películas
- Calificar películas (0-5 estrellas)
- Marcar películas como vistas
- Ver reseñas propias
- Buscar películas por nombre
- Filtrar películas por género o miembro del equipo

### Administrador
- Gestión completa de películas (CRUD)
- Gestión completa de géneros (CRUD)
- Gestión completa de miembros del equipo (CRUD)
- Asignar géneros a películas
- Asignar miembros del equipo a películas con roles
- Gestionar relaciones desde múltiples perspectivas

## Licencia

Este proyecto es público y está bajo la licencia MIT.

## Autor

**Sofi**

---

Para más detalles sobre el desarrollo del proyecto, consulta `execution-plan.md`.
