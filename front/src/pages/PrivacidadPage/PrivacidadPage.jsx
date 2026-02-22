import styles from './PrivacidadPage.module.css';

const PrivacidadPage = () => (
  <div className={styles.wrapper}>
    <h1>Política de Privacidad y Eliminación de Datos</h1>
    <p><strong>Versión 1.0</strong> | Vigente desde {new Date().getFullYear()}</p>
    <p>Esta política explica cómo tratamos tus datos conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) en México.</p>
    <h2>1. Responsable</h2>
    <p>Kings Nails es responsable del tratamiento de tus datos personales.</p>
    <h2>2. Datos Recabados</h2>
    <p>Recabamos: nombre, correo, contraseña (encriptada), IDs de OAuth (Google/Facebook), citas, cotizaciones, reseñas, diseños subidos y metadatos de uso.</p>
    <h2>3. Finalidades</h2>
    <p>Gestionar tu cuenta, autenticación, reservar/administrar citas, enviar notificaciones operativas, mejorar el servicio y prevenir fraude. No realizamos perfilamientos invasivos.</p>
    <h2>4. Base Legal</h2>
    <p>Consentimiento expreso al registrarte y aceptar esta política; ejecución de la relación comercial (servicios solicitados); cumplimiento de obligaciones legales.</p>
    <h2>5. Conservación</h2>
    <p>Conservamos datos mientras exista relación activa o sea necesario para obligaciones legales. Tras solicitud de eliminación se anonimiza o elimina salvo requisitos legales.</p>
    <h2>6. Derechos ARCO</h2>
    <p>Puedes ejercer Acceso, Rectificación, Cancelación u Oposición usando la opción de eliminar perfil dentro de la aplicación o escribiendo a kingsnails25@gmail.com.</p>
    <h2>7. Eliminación Total</h2>
    <p>Al eliminar tu perfil borramos citas, diseños y reseñas asociadas. Copias de seguridad se depuran según ciclos programados (máx 90 días).</p>
    <h2>8. Transferencias</h2>
    <p>Solo compartimos con proveedores de hosting, almacenamiento de imágenes (Cloudinary) y autenticación (Google/Facebook). No vendemos tus datos.</p>
    <h2>9. Seguridad</h2>
    <p>Aplicamos cifrado en tránsito (HTTPS), hashing de contraseñas (bcrypt) y controles de acceso por rol.</p>
    <h2>10. Cookies</h2>
    <p>Usamos cookies de sesión para autenticación segura y evitar almacenamientos de tokens en JavaScript.</p>
    <h2>11. Actualizaciones</h2>
    <p>Si cambiamos sustancialmente esta política pediremos nueva aceptación. Indicado por versión.</p>
    <h2>12. Contacto</h2>
    <p>Para dudas de privacidad: kingsnails25@gmail.com</p>
  </div>
);

export default PrivacidadPage;
