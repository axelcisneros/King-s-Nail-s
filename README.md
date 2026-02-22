# PNPM Adoption Guide for Kings-Nails

This repository is configured to use pnpm as the package manager.

Quick start:

1. Enable corepack (recommended) or install pnpm globally:

   corepack enable
   corepack prepare pnpm@latest --activate

2. From the repository root run:

   pnpm install

3. To install and run in each workspace separately:

   cd Kings-Nails-Back
   pnpm install
   pnpm run dev # or pnpm start

   cd ../Kings-Nails-Front
   pnpm install
   pnpm run dev

Notes:

- The repo includes `pnpm-workspace.yaml` and a root `.npmrc` that pins a pnpm version.
- Commit the generated `pnpm-lock.yaml` files after installation.

## Resumen de Mejoras (Backend & Frontend)

Este repositorio ha incorporado nuevas funcionalidades clave recientemente:

### Backend

- Flujo versionado de aceptación legal (`TERMS_VERSION`, `PRIVACY_VERSION`) con almacenamiento de `legalAcceptedAt`, `termsVersion`, `privacyVersion` por usuario.
- Endpoint de re-aceptación: `POST /api/users/legal/accept` protegido.
- Asignación automática de rol `admin` al primer usuario (incluye OAuth Google/Facebook).
- **Logging en MongoDB**: Sistema de logging multi-nivel (`GOOD`, `FAIL`, `ERROR`, `WARN`, `INFO`) almacenado en base de datos con rotación automática (TTL de 30 días).
- Destacado de palabras clave configurables (`LOG_HIGHLIGHTS`).
- **Despliegue Serverless**: Adaptación completa para despliegue en Vercel (`vercel.json` y exportación de la app Express).

### Frontend

- Modal de aceptación legal y lógica de comparación de versiones en `AuthProvider`.
- Toast de re-aceptación no intrusivo (usuario decide cuándo abrir el modal).
- Envío centralizado de logs multi-nivel al backend (`POST /api/logs`) con categorías y `highlightWords`.
- Nuevos componentes: `LegalModal`, `ConfirmToast` y util `logger.js`.
- Manejo consistente de estado de autenticación y aceptación legal para evitar desajustes tras recargas.
- **Recuperación de Contraseña**:
  - Flujo completo de forgot/reset password con tokens temporales
  - Página ForgotPasswordPage para solicitar recuperación vía email
  - Página ResetPasswordPage con validaciones y visualización de contraseña
  - Confirmación de contraseña en registro (RegisterPage)
  - Tokens con expiración de 30 minutos y hash SHA256
  - Email HTML profesional con enlace de recuperación
  - Login automático después de reset exitoso
- **PWA (Progressive Web App)**:
  - Manifest con display standalone y meta tags para iOS/Android
  - Service Worker con estrategia Network First y detección de actualizaciones
  - Botón de instalación inteligente con prompts basados en engagement (2s primera visita, 1s recurrente)
  - Botón de refresh circular en header (solo PWA instalada)
  - Pull-to-refresh con detección de gestos táctiles (umbral 80px)
  - Splash screen animado y experiencia nativa sin barra de navegación
  - Soporte para VS Code Dev Tunnels con URLs persistentes para pruebas móviles

### Integración

- Cuando el backend incrementa versiones legales, el frontend detecta el desajuste y solicita re-aceptación.
- Logs del frontend se consolidan en los archivos del backend, permitiendo auditoría unificada.

Para más detalle consulta los README específicos en `Kings-Nails-Back/README.md` y `Kings-Nails-Front/README.md`.
