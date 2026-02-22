import styles from './TerminosPage.module.css';

const TerminosPage = () => (
  <div className={styles.wrapper}>
    <h1>Términos y Condiciones - Kings Nails</h1>
    <p><strong>Versión 1.0</strong> | Vigente desde {new Date().getFullYear()}</p>
    <p>Este documento rige el uso de la plataforma Kings Nails ("Servicio") en México. Al crear una cuenta, iniciar sesión o usar el Servicio declaras haber leído y aceptado estos términos.</p>
    <h2>1. Objeto</h2>
    <p>La plataforma permite gestionar citas, cotizaciones, diseños personalizados, reseñas y comunicación entre clientes y administración de Kings Nails.</p>
    <h2>2. Edad y Capacidad</h2>
    <p>Debes tener 18 años o más o contar con autorización expresa de tu tutor legal.</p>
    <h2>3. Cuenta y Seguridad</h2>
    <p>Eres responsable de la confidencialidad de tus credenciales. Notifica cualquier acceso no autorizado. Podemos suspender cuentas que comprometan la seguridad.</p>
    <h2>4. Contenido del Usuario</h2>
    <p>Diseños, reseñas y comentarios deben ser lícitos, no difamatorios, no ofensivos y no infringir derechos de terceros. Nos otorgas una licencia limitada para mostrar ese contenido en el Servicio.</p>
    <h2>5. Reservas y Cancelaciones</h2>
    <p>Las citas pueden modificarse o cancelarse según la política interna mostrada en la aplicación. Incumplimientos reiterados podrán derivar en suspensión.</p>
    <h2>6. Limitación de Responsabilidad</h2>
    <p>El Servicio se ofrece "tal cual" sin garantías tácitas de funcionamiento ininterrumpido. En ningún caso nuestra responsabilidad excederá el monto efectivamente pagado por servicios reservados a través de la plataforma.</p>
    <h2>7. Modificaciones</h2>
    <p>Podemos actualizar estos Términos. Si los cambios son sustanciales se solicitará nueva aceptación. La fecha y versión permiten identificar la última revisión.</p>
    <h2>8. Ley Aplicable y Jurisdicción</h2>
    <p>Se rige por las leyes de México. Cualquier controversia se someterá a los tribunales competentes de la Ciudad de México salvo disposición legal imperativa distinta.</p>
    <h2>9. Contacto</h2>
    <p>Para dudas legales: kingsnails25@gmail.com</p>
  </div>
);

export default TerminosPage;
