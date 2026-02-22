import PropTypes from 'prop-types';
import styles from './ConfirmToast.module.css';

// Componente reutilizable para un toast de confirmación.
const ConfirmToast = ({ closeToast, onConfirm, message }) => {
  return (
    <div className={styles.confirmToast}>
      <p>{message}</p>
      <div className={styles.confirmButtons}>
        <button
          onClick={() => {
            onConfirm();
            closeToast();
          }}
        >
          Sí, estoy segura
        </button>
        <button onClick={closeToast}>No, cancelar</button>
      </div>
    </div>
  );
};

ConfirmToast.propTypes = {
  closeToast: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default ConfirmToast;