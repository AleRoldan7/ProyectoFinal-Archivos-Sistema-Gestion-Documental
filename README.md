# ProyectoFinal-Archivos-Sistema-Gestion-Documental

Gestor de archivos similar a Google Drive. Cada usuario organiza sus archivos de texto (`.txt` y `.md`) en carpetas, los comparte con otras personas, los envía a la papelera y consulta su historial de actividad. El administrador gestiona usuarios y consulta reportes de todo el sistema.

## Contenido

1. [Funcionalidades](#funcionalidades)
2. [Tecnologías](#tecnologías)
3. [Requisitos](#requisitos)
4. [Estructura del proyecto](#estructura-del-proyecto)
5. [Configuración del backend (`.env`)](#configuración-del-backend-env)
6. [Cómo ejecutar el sistema](#cómo-ejecutar-el-sistema)
7. [Datos de demostración (seed)](#datos-de-demostración-seed)
8. [Resumen de comandos](#resumen-de-comandos)
9. [Roles y permisos](#roles-y-permisos)
10. [API REST](#api-rest)
11. [Solución de problemas](#solución-de-problemas)

---

## Funcionalidades

| Módulo | Qué permite |
|---|---|
| **Autenticación** | Inicio de sesión con correo y contraseña; sesión con JWT. |
| **Mi unidad** | Carpetas y subcarpetas, subir archivos (también arrastrando), ver y editar texto, renombrar, mover, descargar, buscar, filtrar por tipo, ordenar y paginar. |
| **Compartir** | Compartir archivos y carpetas con otros usuarios con permiso de lector, comentarista o editor; cambiar permisos y revocar acceso. |
| **Compartido conmigo / por mí** | Listado de lo que se recibe y de lo que se comparte. |
| **Papelera** | Enviar elementos a la papelera, restaurarlos o eliminarlos definitivamente. |
| **Actividad** | Historial de operaciones con filtros por acción y fechas. El administrador ve la de todos los usuarios. |
| **Reportes** | 12 reportes (archivos por tipo y fecha, usuarios con más archivos, compartidos, actividad por tipo y periodo, entre otros), con barras y exportación a CSV. Los usuarios normales ven solo sus 3 reportes personales. |
| **Usuarios** (administrador) | Crear, editar, activar y desactivar usuarios. |

## Tecnologías

| Parte | Tecnología |
|---|---|
| Backend | NestJS (TypeScript, ESM), Mongoose, Passport + JWT, Swagger |
| Base de datos | MongoDB (los datos en colecciones; el contenido de los archivos en GridFS, bucket `file_contents`) |
| Frontend | Angular 21 (componentes standalone, signals), Tailwind CSS v4, SweetAlert2 |
| Contenedores | Docker Compose, solo para MongoDB |

## Requisitos

- **Node.js 22** o superior y **npm**.
- **Angular CLI** (`npm install -g @angular/cli`) para usar `ng serve`.
- **MongoDB**: una instalación local o **Docker** con `docker compose`.
- Linux o macOS para los scripts `.sh` (en Windows, usa Git Bash o WSL).

## Estructura del proyecto

```
proyecto/
├── docker-compose.yml        # MongoDB en un contenedor
├── iniciar-dev.sh            # levanta todo: Mongo, seed, backend y frontend
├── reiniciar-datos.sh        # regenera los datos de demostración
├── backend/
│   ├── .env                  # configuración (no se sube a git)
│   ├── package.json
│   └── src/
│       ├── main.ts           # arranque, CORS, Swagger, validación
│       ├── seed.ts           # carga de datos de demostración
│       ├── auth/             # login y JWT
│       ├── users/            # usuarios
│       ├── folders/          # carpetas
│       ├── files/            # archivos (metadatos + GridFS)
│       ├── sharing/          # comparticiones y permisos
│       ├── trash/            # papelera
│       ├── activity/         # historial de actividad
│       ├── report/           # reportes
│       └── common/           # guards, decoradores, enums, utilidades
└── frontend/
    └── src/
        ├── app/              # configuración y rutas
        ├── components/       # login, layout, modales reutilizables
        ├── pages/            # Mi unidad, compartidos, papelera, actividad, reportes, usuarios
        ├── service/          # servicios que llaman a la API
        ├── guard/            # protección de rutas por sesión y rol
        ├── models/           # interfaces
        ├── shared/           # dirección de la API (rest-api-const.ts)
        └── utils/            # utilidades y diálogos
```

## Configuración del backend (`.env`)

Crea el archivo `backend/.env`. Este archivo contiene secretos: **no lo subas a git** y agrégalo al `.gitignore`.

```dotenv
# SERVIDOR
PUERTO=3000

# BASE DE DATOS
MONGO_URI=mongodb://127.0.0.1:27017/sistema_gestion_documental

# URL DEL FRONTEND (para CORS)
ORIGEN_CLIENTE=http://localhost:4200

# JWT
JWT_SECRET=<cadena-larga-y-aleatoria>
JWT_EXPIRES_IN=86400

# ADMINISTRADOR INICIAL (se crea solo si no existe ningún usuario)
ADMIN_FIRST_NAME=Admin
ADMIN_LAST_NAME=Sistema
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=<contraseña-del-administrador>
```

### Qué significa cada variable

| Variable | Descripción |
|---|---|
| `PUERTO` | Puerto donde escucha el backend. Si no se define, usa 3000. |
| `MONGO_URI` | Cadena de conexión a MongoDB. El nombre al final (`sistema_gestion_documental`) es la base de datos; se crea sola la primera vez. Si MongoDB corre en Docker y el backend también, el host sería el nombre del servicio (`mongo`) y no `127.0.0.1`. |
| `ORIGEN_CLIENTE` | Dirección desde la que el navegador usa la API. El backend solo acepta peticiones (CORS) desde ese origen, así que debe coincidir con la URL del frontend. |
| `JWT_SECRET` | Clave con la que se firman los tokens de sesión. Debe ser larga y aleatoria. Si la cambias, todas las sesiones abiertas dejan de ser válidas. |
| `JWT_EXPIRES_IN` | Duración de la sesión **en segundos**. `86400` equivale a 24 horas. |
| `ADMIN_FIRST_NAME`, `ADMIN_LAST_NAME` | Nombre y apellido del administrador inicial. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Credenciales del administrador inicial. |

Para generar un `JWT_SECRET` seguro:

```bash
openssl rand -hex 48
```

### Cómo se crea el administrador

Al arrancar, si la colección de usuarios está **vacía**, el backend crea un usuario con rol `ADMIN` usando las variables `ADMIN_*`. Si ya existe algún usuario, no hace nada. Cambiar `ADMIN_PASSWORD` en el `.env` después de la primera ejecución **no** cambia la contraseña ya guardada.

### Dirección de la API en el frontend

El frontend llama a la API en la dirección fija de `frontend/src/shared/rest-api-const.ts` (por defecto `http://localhost:3000`). Si cambias `PUERTO` en el backend, cambia también esa dirección.

## Cómo ejecutar el sistema

### Opción 1: un solo comando (recomendada)

Desde la raíz del proyecto:

```bash
chmod +x iniciar-dev.sh reiniciar-datos.sh     # solo la primera vez
./iniciar-dev.sh
```

El script:

1. Comprueba si MongoDB responde en el puerto 27017; si no, lo levanta con Docker.
2. Instala las dependencias que falten (`npm install`).
3. Carga los datos de demostración (si ya existen, no duplica nada).
4. Arranca el backend y el frontend, y guarda sus registros en `.logs/`.

Al terminar verás las direcciones:

- Frontend: <http://localhost:4200>
- API: <http://localhost:3000>
- Documentación Swagger: <http://localhost:3000/api>

Con **Ctrl+C** se detienen backend y frontend; MongoDB sigue corriendo en Docker.

### Opción 2: paso a paso

**1. Base de datos** (si no tienes MongoDB instalado):

```bash
docker compose up -d mongo
```

**2. Backend:**

```bash
cd backend
npm install
npm run seed            # opcional: datos de demostración
npm run start           # o: npm run start:dev  (con recarga automática, si tu package.json lo define)
```

**3. Frontend** (en otra terminal):

```bash
cd frontend
npm install
ng serve
```

Abre <http://localhost:4200> e inicia sesión.

### Apagar

```bash
docker compose down        # apaga MongoDB y conserva los datos
docker compose down -v     # apaga MongoDB y BORRA todos los datos
```

## Datos de demostración (seed)

El script `backend/src/seed.ts` carga información para probar el sistema y generar reportes:

| Elemento | Cantidad |
|---|---|
| Usuarios | 3 de demostración + el administrador del `.env` |
| Carpetas | Estructura de carpetas y subcarpetas distribuida entre los 4 usuarios |
| Archivos | 50 (`.txt` y `.md`) repartidos entre usuarios y carpetas |
| Comparticiones | Más de 20, con permisos lector, comentarista y editor |
| Papelera | Archivos y una carpeta enviados a la papelera, más restauraciones y una eliminación definitiva |
| Actividad | Los 15 tipos de acción, con fechas repartidas en los últimos 40 días |

### Cuentas de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| `ana@gestor.com` | `Demo12345` | Usuario |
| `luis@gestor.com` | `Demo12345` | Usuario |
| `maria@gestor.com` | `Demo12345` | Usuario |
| el de `ADMIN_EMAIL` | el de `ADMIN_PASSWORD` | Administrador |

### Comandos del seed

```bash
cd backend
npm run seed          # carga los datos; si ya existen, avisa y no duplica
npm run seed:reset    # BORRA carpetas, archivos, comparticiones, actividad y
                      # todos los usuarios menos el administrador, y los vuelve a cargar
```

Estos scripts van en `backend/package.json`:

```json
"seed": "nest build && node dist/seed.js",
"seed:reset": "nest build && node dist/seed.js --reset"
```

> `seed:reset` es destructivo. No lo ejecutes con datos reales.

## Resumen de comandos

| Qué quiero hacer | Comando | Desde |
|---|---|---|
| Levantar todo | `./iniciar-dev.sh` | raíz |
| Regenerar datos de demostración | `./reiniciar-datos.sh` | raíz |
| Levantar solo MongoDB | `docker compose up -d mongo` | raíz |
| Apagar MongoDB (conserva datos) | `docker compose down` | raíz |
| Apagar MongoDB y borrar datos | `docker compose down -v` | raíz |
| Instalar dependencias del backend | `npm install` | `backend/` |
| Arrancar el backend | `npm run start` | `backend/` |
| Cargar datos de demostración | `npm run seed` | `backend/` |
| Regenerar datos de demostración | `npm run seed:reset` | `backend/` |
| Compilar el backend | `npm run build` | `backend/` |
| Instalar dependencias del frontend | `npm install` | `frontend/` |
| Arrancar el frontend | `ng serve` | `frontend/` |
| Compilar el frontend | `ng build` | `frontend/` |
| Ver la base por consola | `docker exec -it gestor-mongo mongosh sistema_gestion_documental` | cualquiera |

## Roles y permisos

### Roles del sistema

| Rol | Puede |
|---|---|
| `USUARIO` | Gestionar sus carpetas y archivos, compartir, usar la papelera, ver su actividad y sus 3 reportes personales. |
| `ADMIN` | Todo lo anterior, más gestionar usuarios, ver la actividad de todos y consultar los 12 reportes. |

### Permisos al compartir

| Permiso | Alcance |
|---|---|
| `READ` (Lector) | Ver y descargar. |
| `COMMENT` (Comentarista) | Lo anterior, con nivel de comentario. |
| `EDIT` (Editor) | Lo anterior, y además modificar el contenido. |

Solo el propietario de un recurso puede compartirlo.

## API REST

Todas las rutas requieren el encabezado `Authorization: Bearer <token>`, excepto `POST /auth/login`. La documentación interactiva está en `/api` (Swagger).

| Módulo | Rutas principales |
|---|---|
| **Auth** | `POST /auth/login` |
| **Usuarios** | `GET /users/me`, `GET /users/directory`; solo administrador: `POST /users/create-user`, `GET /users/all-users`, `PATCH /users/:id/update`, `PATCH /users/:id/state` |
| **Carpetas** | `POST /folders`, `GET /folders`, `GET /folders/:id`, `PATCH /folders/:id/rename`, `PATCH /folders/:id/move` |
| **Archivos** | `POST /files/upload-file`, `GET /files/list-file`, `GET /files/:id`, `GET /files/:id/download`, `PUT /files/:id/content`, `PATCH /files/:id/rename`, `PATCH /files/:id/move` |
| **Papelera** | `DELETE /folders/:id`, `DELETE /files/:id` (enviar a la papelera); `GET /trash`; `PATCH /trash/folders/:id/restore`, `PATCH /trash/files/:id/restore`; `DELETE /trash/folders/:id`, `DELETE /trash/files/:id` (eliminar definitivamente) |
| **Compartir** | `POST /shares`, `GET /shares/with-me`, `GET /shares/by-me`, `PATCH /shares/:id`, `DELETE /shares/:id` |
| **Actividad** | `GET /activity` |
| **Reportes** | `GET /reports/files/by-type`, `files/by-date`, `files/most-operated`, `users/top-files`, `users/most-shared`, `shares/most-shared-files`, `shares/by-user`, `shares/received`, `activity/user`, `activity/by-type`, `activity/by-period`, `activity/top-actions` |

Solo se aceptan archivos `.txt` y `.md`, de hasta 5 MB.

## Solución de problemas

| Síntoma | Causa y solución |
|---|---|
| `ECONNREFUSED 127.0.0.1:27017` | MongoDB no está corriendo. Ejecuta `docker compose up -d mongo`. |
| Puerto 27017 ocupado al levantar Docker | Ya hay un MongoDB local. Úsalo, o detenlo con `sudo systemctl stop mongodb`. |
| `permission denied ... docker.sock` | Tu usuario no está en el grupo `docker`. Ejecuta `sudo usermod -aG docker $USER` y vuelve a iniciar sesión. |
| El navegador muestra un error de CORS | `ORIGEN_CLIENTE` no coincide con la URL del frontend. |
| El login falla con el administrador | La contraseña de `ADMIN_PASSWORD` solo se usa al crear el usuario. Si la cambiaste después, cámbiala desde la pantalla de Usuarios o ejecuta `npm run seed:reset`. |
| `Cannot find module dist/seed.js` | Falta `src/seed.ts` en el backend, o no se compiló. Revisa que exista y ejecuta `npm run seed` desde `backend/`. |
| El seed dice que los datos ya existen | Es normal en la segunda ejecución. Para regenerarlos usa `npm run seed:reset`. |
| El frontend no se conecta al backend | Revisa que `src/shared/rest-api-const.ts` apunte al `PUERTO` del backend. |
| Las pantallas se ven sin estilos | Revisa la configuración de Tailwind: `.postcssrc.json` con `@tailwindcss/postcss` y `@import "tailwindcss";` en `src/styles.css`; reinicia `ng serve` después de cambiarlo. |
| Los scripts `.sh` no se ejecutan | `chmod +x iniciar-dev.sh reiniciar-datos.sh`. Los registros están en `.logs/`. |

## Seguridad

- No subas `backend/.env` a git.
- Usa un `JWT_SECRET` propio y largo, distinto en cada entorno.
- Cambia la contraseña del administrador antes de desplegar en un servidor real.
- Las cuentas de demostración (`Demo12345`) son solo para pruebas.
