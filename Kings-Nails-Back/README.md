# Kings Nails - Backend

## Logging (MongoDB)

El sistema de logging ahora almacena todos los eventos directamente en la base de datos MongoDB (colección `logs`), lo que lo hace compatible con entornos Serverless como Vercel.

- **Niveles:** `GOOD`, `FAIL`, `ERROR`, `WARN`, `INFO`.
- **Rotación automática:** Los logs se eliminan automáticamente después de 30 días gracias a un índice TTL (`expires: '30d'`) en el esquema de Mongoose.
- **Palabras clave destacadas:** Definir en `.env` la variable `LOG_HIGHLIGHTS` separada por comas (ej: `LOG_HIGHLIGHTS=LEGAL,SECURITY,PAYMENT`). Si una línea contiene alguna palabra, se agrega el campo `highlights` al documento en la base de datos.

Variables de entorno relevantes:

```bash
LOG_HIGHLIGHTS=LEGAL,SECURITY,PAYMENT  # Palabras clave a detectar
```

## Uso en backend

```js
const { logGood, logFail, logError, logWarn, logInfo } = require('../utils/logger');
logGood('Usuario registrado', { userId });
logFail('Login fallido', { emailAttempt });
```

## Uso en frontend

```js
import { logGood, logFail, logInfo } from '../utils/logger';
logGood('Frontend aceptación legal', { meta: { termsVersion: '1.1' }, category: 'legal', highlightWords: ['LEGAL'] });
```

La ruta `POST /api/logs` permite enviar logs desde el frontend. Campos aceptados:
`{ level, message, meta?, category?, highlightWords? }`.

Bienvenido al "cerebro" de Kings Nails. Este es el proyecto de backend que da vida y gestiona toda la lógica y los datos para la aplicación de agendamiento y galería de Kings Nails.

---

## Despliegue en Vercel (Serverless)

Este backend está adaptado para ejecutarse como **Serverless Functions** en Vercel.

- El archivo `app.js` exporta la aplicación (`module.exports = app`) en lugar de iniciar el servidor con `app.listen()` cuando está en producción.
- Incluye un archivo `vercel.json` que enruta todas las peticiones a `app.js` usando el entorno `@vercel/node`.

---

## Variables de Entorno Requeridas

Para que el backend funcione correctamente (tanto en local como en Vercel), necesitas configurar las siguientes variables en tu archivo `.env` o en el panel de Vercel:

```bash
# Servidor
PORT=5000
NODE_ENV=development # o 'production' en Vercel

# Base de Datos
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/kingsnails

# Autenticación JWT
JWT_SECRET=tu_secreto_super_seguro
JWT_EXPIRE=30d

# URLs del Frontend (CORS y Emails)
FRONTEND_URL=https://king-s-nail-s.vercel.app

# Configuración de Email (Nodemailer)
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion

# OAuth (Opcional)
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
FACEBOOK_APP_ID=tu_facebook_app_id
FACEBOOK_APP_SECRET=tu_facebook_app_secret
```

---

## Tabla de Contenidos

- [🌍 Visión General](#-visión-general)
- [✨ Funcionalidades Clave](#-funcionalidades-clave)
- [💅 Para Clientes](#-para-clientes)
- [💼 Para la Administradora (Dueña del Salón)](#-para-la-administradora-dueña-del-salón)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [🚀 Puesta en Marcha (Instalación)](#-puesta-en-marcha-instalación)
- [🔑 Variables de Entorno](#-variables-de-entorno)
- [🔌 Documentación de la API (Endpoints)](#-documentación-de-la-api-endpoints)

---

## 🌍 Visión General

Este servidor se encarga de:

- **Gestionar Cuentas:** Permite a los usuarios registrarse, iniciar sesión (con email, Google o Facebook) y administrar su perfil.
- **Administrar Citas:** Procesa las solicitudes de citas, las guarda y permite su gestión.
- **Controlar Galerías:** Administra la galería de trabajos del salón y las galerías de inspiración personales de cada cliente.
- **Seguridad:** Protege los datos y asegura que solo los usuarios autorizados (clientes o administradora) puedan realizar ciertas acciones.

---

## ✨ Funcionalidades Clave

### 💅 Para Clientes

- **Autenticación Flexible:** Crea una cuenta con tu email o usa tus perfiles de **Google** y **Facebook** para un acceso rápido.
- **Gestión de Perfil:** Actualiza tus datos personales y contraseña de forma segura.
- **Agendamiento de Citas:** Reserva tu próxima cita de manicura de manera sencilla.
- **Historial de Citas:** Consulta el estado y los detalles de tus citas pasadas y futuras.
- **Galería de Inspiración:** Sube imágenes de los diseños de uñas que te gustan para compartirlos con la manicurista.

### 💼 Para la Administradora (Dueña del Salón)

El sistema está diseñado para que **la primera persona que se registre** reciba automáticamente el rol de `admin`.

- **Gestión Total de Citas:** Visualiza, actualiza (ej. confirmar, completar) y elimina las citas de todos los clientes desde un solo lugar.
- **Curación de la Galería Oficial:** Tiene control total para subir, actualizar y eliminar las fotos de la galería de trabajos del salón.
- **Supervisión de Diseños:** Revisa todas las imágenes de inspiración que han subido los clientes para preparar las citas de forma eficiente.

---

## 🛠️ Stack Tecnológico

- **Entorno de Ejecución:** Node.js
- **Framework Web:** Express.js
- **Base de Datos:** MongoDB con Mongoose como ODM.
- **Autenticación:**
  - Tokens JWT para sesiones seguras.
  - Passport.js con estrategias para Google (`passport-google-oauth20`) y Facebook (`passport-facebook`).
  - bcrypt.js para el hasheo de contraseñas.
- **Variables de Entorno:** dotenv.
- **CORS:** Middleware `cors` para permitir la comunicación segura con el frontend.

---

## 🚀 Puesta en Marcha (Instalación)

Sigue estos pasos para levantar el servidor en tu entorno local.

1. **Clonar el repositorio**

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    ```

2. **Navegar a la carpeta del backend**

    ```bash
    cd Kings-Nails-Back
    ```

3. **Instalar dependencias**

    ```bash
    pnpm install
    ```

4. **Crear el archivo de variables de entorno**
    Copia el archivo de ejemplo `.env.example` y renómbralo a `.env`.

    ```bash
    # En Windows (cmd)
    copy .env.example .env
    # En macOS/Linux
    cp .env.example .env
    ```

5. **Configurar las variables en `.env`**
    Abre el archivo `.env` y rellena todas las variables. Consulta la sección Variables de Entorno para más detalles. Necesitarás credenciales de MongoDB, Google y Facebook.

6. **Ejecutar el servidor**

    ```bash
    # Para modo desarrollo con reinicio automático (nodemon)
    pnpm run dev

    # Para modo producción
    pnpm start
    ```

    El servidor debería estar corriendo en `http://localhost:5000` (o el puerto que hayas configurado).

---

## 🔑 Variables de Entorno

Para que el proyecto funcione, tu archivo `.env` debe contener las siguientes variables:

| Variable                | Descripción                                                                         | Ejemplo                                     |
| ----------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------- |
| `PORT`                  | El puerto en el que correrá el servidor.                                            | `5000`                                      |
| `NODE_ENV`              | El entorno de la aplicación.                                                        | `development` o `production`                |
| `MONGO_URI`             | La cadena de conexión a tu base de datos MongoDB.                                   | `mongodb://127.0.0.1:27017/kings-nails`     |
| `JWT_SECRET`            | Una cadena secreta larga y aleatoria para firmar los tokens.                        | `unasecretamuylargayaleatoria`              |
| `FRONTEND_URL`          | La URL base de tu aplicación frontend (para redirecciones de OAuth).                | `http://localhost:5173`                     |
| `GOOGLE_CLIENT_ID`      | El ID de Cliente de tu app en Google Cloud Console.                                 | `xxxx.apps.googleusercontent.com`           |
| `GOOGLE_CLIENT_SECRET`  | El Secreto de Cliente de tu app en Google Cloud Console.                            | `GOCSPX-xxxx`                               |
| `FACEBOOK_APP_ID`       | El ID de tu App en Meta for Developers.                                             | `1234567890`                                |
| `FACEBOOK_APP_SECRET`   | La Clave Secreta de tu App en Meta for Developers.                                  | `abcdef123456`                              |
| `CLOUDINARY_CLOUD_NAME` | El nombre de tu "Cloud" en Cloudinary.                                              | `ejemplo-cloud`                             |
| `CLOUDINARY_API_KEY`    | La clave API de tu cuenta de Cloudinary.                                            | `123456789012345`                           |
| `CLOUDINARY_API_SECRET` | El secreto de la API de tu cuenta de Cloudinary.                                    | `abcdefg-hijklmnopqrstuv`                   |
| `EMAIL_SERVICE`         | El servicio de correo a utilizar (ej. 'hotmail', 'outlook').                        | `hotmail`                                   |
| `EMAIL_USER`            | El correo electrónico desde el que se enviarán las notificaciones.                  | `tu_correo@hotmail.com`                     |
| `EMAIL_PASS`            | La contraseña de tu correo electrónico (o contraseña de aplicación si tienes 2FA).  | `tu_contraseña_de_hotmail`                  |
| `ADMIN_EMAIL`           | El correo de la administradora para recibir notificaciones.                         | `admin@ejemplo.com`                         |

---

## 🔌 Documentación de la API (Endpoints)

A continuación se detallan las rutas disponibles en la API.

- `Público`: No requiere autenticación.
- `Privado`: Requiere un token JWT de un usuario logueado.
- `Admin`: Requiere un token JWT de un usuario con rol `admin`.

### Autenticación (`/api/users`)

| Método  | Ruta                     | Descripción                           | Acceso  |
| ------- | ------------------------ | ------------------------------------- | ------- |
| `POST`  | `/register`              | Registrar un nuevo usuario.           | Público |
| `POST`  | `/login`                 | Iniciar sesión con email/pass.        | Público |
| `GET`   | `/profile`               | Obtener perfil del usuario.           | Privado |
| `PUT`   | `/profile`               | Actualizar perfil del usuario.        | Privado |
| `DELETE`| `/profile`               | Eliminar perfil del usuario.          | Privado |
| `GET`   | `/google`                | Iniciar login con Google.             | Público |
| `GET`   | `/google/callback`       | Callback de Google.                   | Público |
| `GET`   | `/facebook`              | Iniciar login con Facebook.           | Público |
| `GET`   | `/facebook/callback`     | Callback de Facebook.                 | Público |
| `POST`  | `/forgot-password`       | Solicitar recuperación de contraseña. | Público |
| `POST`  | `/reset-password/:token` | Restablecer contraseña con token.     | Público |

### Citas (`/api/appointments`)

| Método  | Ruta                 | Descripción                     | Acceso  |
| ------- | -------------------- | ------------------------------- | ------- |
| `POST`  | `/`                  | Crear una nueva cita.           | Privado |
| `GET`   | `/`                  | Obtener todas las citas.        | Admin   |
| `GET`   | `/my`                | Obtener mis citas.              | Privado |
| `PUT`   | `/:id`               | Actualizar una cita específica. | Admin   |
| `DELETE`| `/:id`               | Eliminar una cita específica.   | Admin   |
| `PUT`   | `/my/:id/cancel`     | Cliente cancela su propia cita. | Privado |

### Galería (`/api/gallery`)

| Método  | Ruta      | Descripción                         | Acceso  |
| ------- | --------- | ----------------------------------- | ------- |
| `GET`   | `/`       | Obtener imágenes de la galería.     | Público |
| `POST`  | `/`       | Añadir una imagen a la galería.     | Admin   |
| `PUT`   | `/:id`    | Actualizar una imagen específica.   | Admin   |
| `DELETE`| `/:id`    | Eliminar una imagen específica.     | Admin   |

### Diseños de Usuario (`/api/designs`)

| Método  | Ruta   | Descripción                               | Acceso  |
| ------- | ------ | ----------------------------------------- | ------- |
| `GET`   | `/`    | Obtener mis diseños de inspiración.       | Privado |
| `POST`  | `/`    | Subir un nuevo diseño de inspiración.     | Privado |
| `DELETE`| `/:id` | Eliminar un diseño de inspiración.        | Privado |
| `GET`   | `/all` | Obtener todos los diseños de los clientes.| Admin   |

### Reseñas (`/api/reviews`)

| Método  | Ruta                 | Descripción                    | Acceso  |
| ------- | -------------------- | ------------------------------ | ------- |
| `GET`   | `/`                  | Obtener reseñas aprobadas.     | Público |
| `POST`  | `/`                  | Crear una nueva reseña.        | Privado |
| `GET`   | `/all`               | Obtener todas las reseñas.     | Admin   |
| `PUT`   | `/:id/approve`       | Aprobar una reseña.            | Admin   |
| `DELETE`| `/:id`               | Eliminar una reseña.           | Admin   |

---

## 📱 Integración PWA y Móvil

### Variables de Entorno para Tunnels

Para pruebas en dispositivos móviles usando VS Code Dev Tunnels:

```bash
# Frontend URL del tunnel (para redirección OAuth)
TUNNEL_FRONTEND_URL=https://74g24bxx-3000.use2.devtunnels.ms

# Callbacks OAuth con URLs del tunnel
GOOGLE_CALLBACK_URL=https://74g24bxx-5000.use2.devtunnels.ms/api/users/google/callback
FACEBOOK_CALLBACK_URL=https://74g24bxx-5000.use2.devtunnels.ms/api/users/facebook/callback
```

### Configuración OAuth

- **Google Cloud Console**: Agregar las URLs del tunnel como URIs de redirección autorizadas
- **Facebook Developers**: Configurar Valid OAuth Redirect URIs con las URLs del tunnel
- El backend prioriza `TUNNEL_FRONTEND_URL` sobre `FRONTEND_URL` para redirecciones post-OAuth
