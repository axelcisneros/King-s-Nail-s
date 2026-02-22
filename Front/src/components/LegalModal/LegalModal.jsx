import { useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './LegalModal.module.css';
import { Link } from 'react-router-dom';
import api from '../../config/api';
import { TERMS_VERSION, PRIVACY_VERSION } from '../../config/legal';

const LegalModal = ({ onAccept, requireReaccept = false, isAuthenticated = false }) => {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') e.preventDefault(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const accept = async () => {
    localStorage.setItem('legalAccepted', 'true');
    localStorage.setItem('termsVersion', TERMS_VERSION);
    localStorage.setItem('privacyVersion', PRIVACY_VERSION);

    if (isAuthenticated) {
      try {
        await api.post('/users/legal/accept');
      } catch (e) {
        console.error('Error actualizando aceptación legal en backend', e);
      }
    }
    onAccept();
  };

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby="legal-title">
      <div className={styles.modal}>
        <h2 id="legal-title">{requireReaccept ? 'Actualización Legal' : 'Términos y Privacidad'}</h2>
        <p>{requireReaccept ? 'Tenemos una nueva versión de nuestros documentos legales. Debes aceptar para continuar.' : 'Antes de continuar necesitamos que aceptes nuestros'} <Link to="/terminos" target="_blank" rel="noopener noreferrer">Términos y Condiciones</Link> y nuestra <Link to="/privacidad" target="_blank" rel="noopener noreferrer">Política de Privacidad</Link>. Cumplimos con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (México).</p>
        <ul className={styles.points}>
          <li>Uso lícito y limitado de tus datos para gestionar citas, diseños, reseñas y comunicación.</li>
          <li>Puedes solicitar la eliminación total de tus datos desde tu perfil.</li>
          <li>No vendemos tus datos a terceros. Compartimos sólo con proveedores de infraestructura esenciales.</li>
          <li>Tus credenciales OAuth (Google/Facebook) se usan únicamente para autenticarte.</li>
        </ul>
        <button className={styles.acceptBtn} onClick={accept}>Acepto</button>
      </div>
    </div>
  );
};

LegalModal.propTypes = { onAccept: PropTypes.func.isRequired, requireReaccept: PropTypes.bool, isAuthenticated: PropTypes.bool };

export default LegalModal;
