# Kings Nails - Aplicación Frontend

Este es el repositorio para el frontend de la aplicación web Kings Nails, una plataforma completa para la gestión de un salón de belleza, construida con React y Vite.

![Captura de Pantalla de Kings Nails](https://via.placeholder.com/800x450.png?text=Captura+de+la+App)

---

## Para el Cliente (Visión General)

### ¿Qué es Kings Nails?

Kings Nails es una aplicación web moderna y fácil de usar diseñada para que las clientas de un salón de uñas puedan interactuar con el negocio de manera digital. Permite ver trabajos, agendar citas y gestionar un perfil personal, todo desde la comodidad de su casa.

### Características Principales

* **Galería de Inspiración:** Un carrusel visual en la página de inicio para mostrar los mejores trabajos del salón.
* **Agendamiento de Citas:** Un formulario intuitivo para que las clientas soliciten una cita, eligiendo entre los servicios disponibles.
* **Perfiles de Usuario:** Cada clienta tiene su propio perfil donde puede ver su historial de citas y subir sus propios diseños de inspiración.
* **Inicio de Sesión Fácil:** Opciones para registrarse y acceder con correo y contraseña, o de forma rápida usando cuentas de Google o Facebook.
* **Sistema de Reseñas:** Las clientas pueden dejar una calificación y un comentario después de una cita completada, que se mostrará públicamente para construir confianza.
* **Panel de Administración Completo:** Una sección privada y segura para que la dueña del negocio gestione:
  * **Citas:** Ver todas las citas y cambiar su estado (confirmar, completar, cancelar).
  * **Reseñas:** Aprobar o eliminar los comentarios de las clientas.
  * **Galería:** Subir nuevas fotos de trabajos al carrusel principal.
  * **Servicios:** Añadir, editar o eliminar los servicios ofrecidos por el salón, actualizando el formulario de citas en tiempo real.

---

## Para Desarrolladores (Detalles Técnicos)

### Stack Tecnológico

* **Framework:** [React](https://reactjs.org/) (v18+) con [Vite](https://vitejs.dev/) como empaquetador.
* **Routing:** [React Router DOM](https://reactrouter.com/) (v6).
* **Peticiones HTTP:** [Axios](https://axios-http.com/) con interceptores para la gestión de tokens.
* **Estilos:** [CSS Modules](https://github.com/css-modules/css-modules) para estilos encapsulados por componente.
* **Gestión de Estado Global:** React Context API para el manejo de la autenticación.

### Características Técnicas Implementadas

* **Autenticación JWT:** Flujo completo de registro, login y logout con tokens JWT almacenados en `localStorage`.
* **Autenticación Social (OAuth):** Integración con el backend para inicio de sesión con Google y Facebook.
* **Rutas Protegidas:** Implementación de rutas privadas para usuarios autenticados (`/profile`) y rutas de administrador (`/admin`).
* **Subida de Archivos:** Manejo de `FormData` para la subida de imágenes tanto en el perfil del usuario como en el panel de administración.
* **Variables de Entorno:** Uso de `import.meta.env` para una configuración segura de la URL de la API.

### Nuevas Capacidades (Legal y Logging)

* **Flujo de Aceptación Legal Versionado:** Modal para aceptar Términos y Política de Privacidad asociado a las versiones `TERMS_VERSION` y `PRIVACY_VERSION` definidas en el backend. Si el backend incrementa una versión, el frontend detecta el desajuste y muestra un toast solicitando nueva aceptación.
* **Re-Aceptación Transparente:** El usuario solo vuelve a aceptar cuando cambian las versiones. Se guarda `legalAcceptedAt`, `termsVersion` y `privacyVersion` en el perfil (servidor) y se sincroniza estado local.
* **Logging Multi-Nivel desde el Frontend:** Envío de eventos al backend con niveles (`GOOD`, `FAIL`, `INFO`, `WARN`, `ERROR`) y soporte de palabras clave resaltadas.
* **Toast Contextual y Confirmaciones:** Sistema `ConfirmToast` y lógica de `pendingAction` en `AuthProvider` para controlar apertura de modal legal de forma explícita y no intrusiva.
* **Manejo de Destacados (Highlights):** Se pueden enviar `highlightWords` manualmente desde el frontend para forzar copia en `highlight.log`.
* **Separación por Categorías:** Cada evento puede incluir `category` (ej: `legal`, `auth`, `ui`) para futuras métricas.

### Requisitos Previos

* Node.js (versión 18.x o superior recomendada).
* `pnpm` o `yarn`.

### Instalación y Puesta en Marcha

1.**Clonar el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd Kings-Nails-Front
    ```

2.**Instalar dependencias:**
    ```bash
    pnpm install
    ```

3.**Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y añade la URL de tu backend.
    ```env
    # .env
    VITE_API_BASE_URL=http://localhost:5000/api
    ```

4.**Ejecutar el servidor de desarrollo:**
    La aplicación estará disponible en `http://localhost:3000` (o el puerto que indique Vite).
    ```bash
    pnpm run dev
    ```

### Scripts Disponibles

En el `package.json`, encontrarás los siguientes scripts:

* `pnpm run dev`: Inicia el servidor de desarrollo con Hot-Reload.
* `pnpm run build`: Compila y empaqueta la aplicación para producción en la carpeta `dist`.
* `pnpm run lint`: Ejecuta ESLint para analizar el código en busca de errores y problemas de estilo.
* `pnpm run preview`: Inicia un servidor local para previsualizar la build de producción.

### Estructura del Proyecto

La estructura de carpetas sigue las mejores prácticas para aplicaciones React escalables.

``
src
├── components/   # Componentes reutilizables (Button, Modal, Carousel...)
├── config/       # Configuración (instancia de Axios)
├── context/      # Contexto de React (AuthContext)
├── hooks/        # Hooks personalizados (useAuth)
├── pages/        # Componentes de página (HomePage, LoginPage, ProfilePage...)
├── routes/       # Configuración del enrutador (Router, ProtectedRoute)
├── services/     # Lógica para comunicarse con la API (authService, adminService...)
├── styles/       # Estilos globales y variables CSS
├── App.jsx       # Componente raíz de la aplicación
└── main.jsx      # Punto de entrada de la aplicación
``

## 📜 Flujo de Aceptación Legal

El frontend colabora con el backend para garantizar que cada usuario acepte la última versión de los documentos legales.

### Datos Clave en Backend

En el modelo de usuario se almacenan:

* `legalAcceptedAt`
* `termsVersion`
* `privacyVersion`

El backend expone las versiones activas mediante variables de entorno (`TERMS_VERSION`, `PRIVACY_VERSION`). El perfil retornado tras login OAuth o credenciales incluye las versiones aceptadas; el frontend compara con las actuales.

### Detección de Desajuste

1. Usuario inicia sesión o regresa con sesión vigente.
2. `AuthProvider` compara versiones aceptadas vs vigentes.
3. Si hay diferencia, lanza un toast invitando a revisar/aceptar.
4. El usuario hace clic en el botón del toast para abrir el `LegalModal`.

### Re-Aceptación

Al confirmar, se hace `POST /api/users/legal/accept` enviando `{ termsVersion, privacyVersion }` (las actuales leídas del backend) y se actualiza estado local + storage. Se registra un log `GOOD`.

### Ejemplo de Uso (Fragmento)

```jsx
// Dentro de AuthProvider (simplificado)
import { logGood, logFail } from '../utils/logger';

const handleAcceptLegal = async () => {
    try {
        await acceptLegalApi({ termsVersion: backendTerms, privacyVersion: backendPrivacy });
        logGood('Legal aceptado', { meta: { termsVersion: backendTerms, privacyVersion: backendPrivacy }, category: 'legal', highlightWords: ['LEGAL'] });
    } catch (e) {
        logFail('Error aceptando legal', { meta: { error: e.message }, category: 'legal' });
    }
};
```

## 🧪 Logging Multi-Nivel desde el Frontend

El frontend no escribe archivos locales; delega al backend vía `POST /api/logs`.

### Firma del Payload

```ts
interface FrontendLogPayload {
    level: 'GOOD' | 'FAIL' | 'INFO' | 'WARN' | 'ERROR';
    message: string;
    meta?: Record<string, any>;
    category?: string;          // ej: 'legal', 'auth', 'ui'
    highlightWords?: string[];  // sobrescribe detección del backend
}
```

### Ejemplo de Logger Front

```js
import { logGood, logError } from '../utils/logger';

logGood('Login exitoso', {
    meta: { userId: '123', method: 'email' },
    category: 'auth',
    highlightWords: ['SECURITY']
});

logError('Fallo inesperado UI', {
    meta: { component: 'LegalModal', error: 'Timeout' },
    category: 'ui'
});
```

### Rotación y Destacados

La rotación, retención y palabras clave (`LOG_HIGHLIGHTS`) se configuran en el backend; el frontend solo puede sugerir `highlightWords` para eventos críticos.

## 🧩 Componentes / Módulos Añadidos o Extendidos

| Componente / Módulo | Tipo | Descripción |
|---------------------|------|-------------|
| `LegalModal` | UI | Modal para visualizar y aceptar Términos y Privacidad. |
| `ConfirmToast` | UI | Toast interactivo que solicita acción del usuario ante nuevas versiones. |
| `AuthProvider` | Context | Lógica de comparación de versiones, manejo de `pendingAction`, disparo de logs. |
| `utils/logger.js` | Util | Envío centralizado de logs multi-nivel al backend. |
| `services/authService.js` | Servicio | Incluye llamada `acceptLegal` enviando versiones actuales. |

## 🔄 Flujo Completo de Re-Aceptación (Resumen)

1. Backend actualiza `TERMS_VERSION` o `PRIVACY_VERSION`.
2. Usuario inicia sesión / refresca página.
3. Front detecta mismatch y muestra toast.
4. Usuario abre `LegalModal` y confirma.
5. Front envía `POST /api/users/legal/accept` con versiones actuales.
6. Backend persiste valores y responde perfil actualizado.
7. Front actualiza estado y registra `GOOD` + opcional highlight.

## ⚙️ Variables de Entorno (Frontend)

```env
VITE_API_BASE_URL=http://localhost:5000/api
# Opcional: si se decide exponer valores legales para mostrar en UI sin esperar perfil
# VITE_TERMS_VERSION=1.1
# VITE_PRIVACY_VERSION=1.1
# URL temporal del backend cuando se usa un túnel Dev (VS Code dev tunnels / ngrok)
# VITE_TUNNEL_API_BASE_URL=https://xxxx-5000.use2.devtunnels.ms/api
```

---

## 🔐 Recuperación de Contraseña

### Flujo Completo

#### 1. Solicitar Recuperación (`/forgot-password`)

* Usuario ingresa su email
* Validación en tiempo real con ValidationIcon
* Backend genera token único (32 bytes random)
* Token se hashea con SHA256 antes de guardarse en BD
* Email HTML enviado con enlace de recuperación
* Token expira en 30 minutos

#### 2. Resetear Contraseña (`/reset-password/:token`)

* Usuario hace clic en enlace del email
* Formulario con dos campos:
  * Nueva contraseña
  * Confirmar contraseña
* Botones de "ojo" para visualizar ambos campos
* Validaciones completas:
  * Mínimo 8 caracteres
  * Debe contener: mayúscula, minúscula, número y símbolo
  * Confirmación debe coincidir
* Backend valida token hasheado y no expirado
* Actualiza contraseña y limpia token
* Login automático después del reset
* Redirección según rol (admin/client)

#### 3. Confirmación en Registro

* RegisterPage ahora incluye campo "Confirmar Contraseña"
* Validación en tiempo real de coincidencia
* Mismo UX que ResetPasswordPage (ojo + validaciones)

### Componentes

| Componente | Descripción |
|------------|-------------|
| `ForgotPasswordPage` | Solicitud de recuperación con validación de email |
| `ResetPasswordPage` | Cambio de contraseña con token, validaciones y login automático |
| `RegisterPage` | Actualizado con confirmación de contraseña |

### Rutas API

```javascript
POST /api/users/forgot-password
// Body: { email: string }
// Response: { message: string }

POST /api/users/reset-password/:token
// Body: { password: string }
// Response: { message, token, user }
```

### Ejemplo de Email

El email enviado incluye:

* Diseño responsive con estilos inline
* Botón destacado con enlace de recuperación
* Aviso de expiración (30 minutos)
* Footer con branding de Kings Nails

## 📱 Funcionalidades PWA (Progressive Web App)

### Características Implementadas

#### 1. **Instalación Inteligente**

* **Botón de Instalación**: Visible en el header (solo en móvil)
  * Aparece cuando la app no está instalada
  * Se oculta automáticamente tras instalar
  * Siempre disponible para reinstalar si se borra

* **Prompt Automático Basado en Engagement**:
  * **Primera visita**: Aparece después de 2 segundos (10s en producción)
  * **Usuario recurrente**: Aparece después de 1 segundo (3s en producción)
  * Detecta automáticamente el nivel de interés del usuario

* **Instrucciones Contextuales**:
  * Detecta iOS vs Android para instrucciones específicas
  * Informa sobre la opción automática y manual
  * UX no intrusiva con fallback a instalación manual

#### 2. **Actualización de Contenido**

* **Botón de Refresh**: Circular en el header (solo en PWA instalada)
  * Recarga completa de la aplicación
  * Se expande mostrando "Actualizando..." con animación
  * Tamaño adaptativo según el header

* **Pull-to-Refresh**: Gesto nativo como apps iOS/Android
  * Deslizar hacia abajo desde el tope de la página
  * Indicador visual con animación
  * Umbral de 80px para activar
  * Funciona tanto en navegador como en PWA instalada

#### 3. **Service Worker**

* **Caché Inteligente**: Estrategia Network First
  * Intenta red primero, fallback a caché
  * Excluye endpoints `/api/` del caché
  * Versión de caché: `kings-nails-v1`

* **Detección de Actualizaciones**:
  * Polling cada 60 segundos
  * Prompt al usuario para actualizar
  * Recarga automática al aceptar

#### 4. **Manifest PWA**

```json
{
  "name": "King's Nails - Salón de Uñas",
  "short_name": "King's Nails",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#000000",
  "background_color": "#000000"
}
```

#### 5. **Experiencia Nativa**

* **Splash Screen**: Logo animado al cargar
* **Sin barra de navegación**: En modo standalone
* **Meta tags optimizados**: Para iOS y Android
* **Íconos adaptivos**: 192x192 y 512x512

### Configuración para Desarrollo Móvil

#### VS Code Dev Tunnels

```bash
# En .env del frontend
VITE_TUNNEL_API_BASE_URL=https://74g24bxx-5000.use2.devtunnels.ms/api
```

#### Ajustar Tiempos de Prompt (antes de producción)

En `InstallButton.jsx`:

```javascript
const FIRST_VISIT_DELAY = 10000; // 10 segundos para producción
const RETURNING_USER_DELAY = 3000; // 3 segundos para producción
```

### Pruebas en Móvil

1. **Compartir puerto en VS Code**:
   * Abrir panel "PORTS"
   * Forward puerto 3000 (frontend) y 5000 (backend)
   * Configurar como "Public"
   * Habilitar autenticación GitHub para URLs persistentes

2. **Abrir en móvil**: `https://74g24bxx-3000.use2.devtunnels.ms`

3. **Instalar PWA**:
   * Esperar prompt automático (2s primera vez, 1s después)
   * O hacer clic en botón "Instalar App"
   * O usar menú del navegador (3 puntos → Instalar app)

4. **Probar actualizaciones**:
   * En PWA instalada: usar botón de refresh o pull-to-refresh
   * En navegador: ambos métodos disponibles

### Componentes PWA

* **`InstallButton`**: Gestión de instalación con prompts inteligentes
* **`RefreshButton`**: Actualización manual con animación
* **`PullToRefresh`**: Hook y componente para gesto de actualización
* **`usePullToRefresh`**: Hook custom para detección de touch events
* **`sw.js`**: Service Worker con estrategias de caché y actualizaciones

## ✅ Buenas Prácticas Adoptadas

* No apertura automática intrusiva del modal: solo tras interacción del usuario (toast -> clic).
* Logging semántico con categorías y meta estructurada.
* Re-utilización de contexto para evitar múltiples fuentes de verdad.
* Separación clara entre capa de UI (modal/toast) y capa de lógica (AuthProvider + servicios).

## 📈 Próximos Posibles Mejoras (Opcional)

* Endpoint de métricas de logs (conteos por nivel/categoría).
* Compresión de archivos rotados (`.gz`).
* Panel de auditoría en frontend para admins.
