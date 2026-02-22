import PropTypes from 'prop-types';
import styles from './ValidationIcon.module.css';

const ValidationIcon = ({ validating = false, error = '', showOk = false, message = '' }) => {
  if (validating) return (
    <svg className={styles.spinner} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="#94a3b8" strokeWidth="2"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
      </path>
    </svg>
  );

  if (error) return (
    <div className={styles.errorContainer}><svg className={styles.error} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#e11d48"/>
      <path d="M12 8v4m0 4h.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg><p style={{ margin: 0, color: '#e11d48', fontSize: '0.6rem'}}>{message}</p></div>
  );

  if (showOk) return (
    <svg className={styles.ok} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#10b981" />
      <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return null;
};

ValidationIcon.propTypes = {
  validating: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  showOk: PropTypes.bool,
  message: PropTypes.string,
};



export default ValidationIcon;
